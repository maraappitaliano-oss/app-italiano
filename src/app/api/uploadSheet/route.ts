import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { synthesizeItalianMP3 } from "@/lib/tts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_KEY não configurada", logs: [] },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Arquivo não enviado", logs: [] },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

    const logs: string[] = [];
    let created = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const domanda_it = String(r.domanda_it ?? r["domanda_it"] ?? "").trim();
      const domanda_pt = String(r.domanda_pt ?? r["domanda_pt"] ?? "").trim();
      const risposta_it = String(r.risposta_it ?? r["risposta_it"] ?? "").trim();
      const risposta_pt = String(r.risposta_pt ?? r["risposta_pt"] ?? "").trim();

      if (!domanda_it || !risposta_it) {
        logs.push(`Linha ${i + 1}: campos em italiano ausentes, pulando.`);
        continue;
      }

      const domandaFilename = `domanda_${i + 1}.mp3`;
      const rispostaFilename = `risposta_${i + 1}.mp3`;

      // Verificar duplicatas no Storage
      const { data: existingDomanda } = await supabaseAdmin.storage
        .from("audios")
        .download(domandaFilename);
      const { data: existingRisposta } = await supabaseAdmin.storage
        .from("audios")
        .download(rispostaFilename);

      let domandaUrl: string | null = null;
      let rispostaUrl: string | null = null;

      if (!existingDomanda) {
        const domandaMP3 = await synthesizeItalianMP3(domanda_it);
        const up1 = await supabaseAdmin.storage
          .from("audios")
          .upload(domandaFilename, domandaMP3, {
            contentType: "audio/mpeg",
            upsert: false,
          });
        if (up1.error) {
          logs.push(
            `Erro ao enviar ${domandaFilename}: ${up1.error.message}. Pulando.`
          );
        }
      } else {
        logs.push(`Encontrado existente ${domandaFilename}, não gerado novamente.`);
      }

      if (!existingRisposta) {
        const rispostaMP3 = await synthesizeItalianMP3(risposta_it);
        const up2 = await supabaseAdmin.storage
          .from("audios")
          .upload(rispostaFilename, rispostaMP3, {
            contentType: "audio/mpeg",
            upsert: false,
          });
        if (up2.error) {
          logs.push(
            `Erro ao enviar ${rispostaFilename}: ${up2.error.message}. Pulando.`
          );
        }
      } else {
        logs.push(`Encontrado existente ${rispostaFilename}, não gerado novamente.`);
      }

      const pubDomanda = supabaseAdmin.storage
        .from("audios")
        .getPublicUrl(domandaFilename);
      domandaUrl = pubDomanda.data.publicUrl;
      const pubRisposta = supabaseAdmin.storage
        .from("audios")
        .getPublicUrl(rispostaFilename);
      rispostaUrl = pubRisposta.data.publicUrl;

      // Evitar duplicatas na tabela
      const existing = await supabaseAdmin
        .from("entrevista")
        .select("id")
        .eq("domanda_it", domanda_it)
        .eq("risposta_it", risposta_it)
        .limit(1)
        .maybeSingle();

      if (existing.data) {
        logs.push(
          `Registro já existe (id=${existing.data.id}) para linha ${i + 1}.`
        );
      } else {
        const insert = await supabaseAdmin.from("entrevista").insert({
          domanda_it,
          domanda_pt,
          risposta_it,
          risposta_pt,
          audio_domanda_url: domandaUrl,
          audio_risposta_url: rispostaUrl,
        });
        if (insert.error) {
          logs.push(
            `Erro ao inserir linha ${i + 1}: ${insert.error.message}.`
          );
        } else {
          created++;
          logs.push(
            `🎧 Gerado e salvo ${domandaFilename} / ${rispostaFilename}.`
          );
        }
      }
    }

    return NextResponse.json({ ok: true, created, logs });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Erro desconhecido", logs: [] },
      { status: 500 }
    );
  }
}