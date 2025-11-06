"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, type UserRole } from "@/lib/auth";
import { supabase, type Entrevista } from "@/lib/supabaseClient";

export default function FalaPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [ready, setReady] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [items, setItems] = useState<Entrevista[]>([]);
  const [index, setIndex] = useState(0);
  const [recognized, setRecognized] = useState<string>("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const qa = useMemo(() => items[index] ?? null, [items, index]);
  const supportSpeech = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) { router.replace("/login"); return; }
      const r = await getUserRole();
      setRole(r);
      // Carregar categorias distintas do Supabase
      const { data, error } = await supabase
        .from("entrevista")
        .select("categoria")
        .not("categoria", "is", null);
      if (!error && Array.isArray(data)) {
        const uniq = Array.from(new Set((data as any[]).map((d) => d.categoria))).filter(Boolean) as string[];
        setCategories(uniq);
        setCategory((prev) => prev || uniq[0] || "");
      }
      setReady(true);
    })();
  }, [router]);

  useEffect(() => {
    (async () => {
      if (!category) { setItems([]); return; }
      const { data, error } = await supabase
        .from("entrevista")
        .select("id, domanda_it, domanda_pt, risposta_it, risposta_pt, categoria, audio_domanda_url, audio_risposta_url, created_at")
        .eq("categoria", category)
        .order("id", { ascending: true });
      if (!error && Array.isArray(data)) {
        setItems(data as Entrevista[]);
        setIndex(0);
        setRecognized("");
      }
    })();
  }, [category]);

  function playQuestionAudio() {
    const url = qa?.audio_domanda_url || null;
    if (url && audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
      return;
    }
    // fallback: TTS nativo do navegador
    if (qa?.domanda_it && typeof window !== "undefined" && ("speechSynthesis" in window)) {
      const utter = new SpeechSynthesisUtterance(qa.domanda_it);
      utter.lang = "it-IT"; // ajustar idioma conforme conteúdo
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }

  function startListening() {
    if (!supportSpeech) return;
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const rec = new SR();
    rec.lang = "pt-BR"; // ajuste conforme o idioma praticado
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const txt = e.results?.[0]?.[0]?.transcript ?? "";
      setRecognized(txt);
      setListening(false);
    };
    rec.onerror = () => { setListening(false); };
    rec.onend = () => { setListening(false); };
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stopListening() {
    const rec = recognitionRef.current;
    if (rec) { try { rec.stop(); } catch {} }
    setListening(false);
  }

  const { score, missing } = useMemo(() => similarityScore(qa?.risposta_it ?? "", recognized), [qa, recognized]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
        <p className="text-sm" style={{ color: "var(--color-navy-italy)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--color-ice-white)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Fala (Prática)</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            style={{ borderColor: "var(--color-soft-gray)", color: "var(--color-navy-italy)" }}
          >
             Voltar ao Dashboard
          </button>
        </div>

        {/* Seleção de categoria */}
        <div className="flex items-center gap-3">
          <label className="text-sm" style={{ color: "#333" }}>Categoria:</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); }}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--color-soft-gray)", color: "var(--color-navy-italy)" }}
          >
            {categories.length === 0 ? (
              <option value="">(Nenhuma categoria  faça upload de planilha)</option>
            ) : (
              categories.map((c) => (<option key={c} value={c}>{c}</option>))
            )}
          </select>
        </div>

        {/* Pergunta (áudio + texto) */}
        <div className="rounded-xl border p-4 shadow w-full" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Pergunta</h2>
          {!qa ? (
            <p className="mt-1" style={{ color: "#333" }}>(Sem perguntas nesta categoria)</p>
          ) : (
            <>
              <p className="mt-1" style={{ color: "#333" }}>{qa.domanda_it}</p>
              <audio ref={audioRef} className="mt-2" controls />
              <div className="mt-3 flex gap-2">
                <button onClick={playQuestionAudio} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50" style={{ borderColor: "var(--color-soft-gray)" }}> Ouvir</button>
                <button onClick={() => setIndex((i) => (i + 1) % items.length)} disabled={items.length === 0} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50" style={{ borderColor: "var(--color-soft-gray)" }}>Próxima</button>
              </div>
            </>
          )}
        </div>

        {/* Resposta do usuário (microfone) */}
        <div className="rounded-xl border p-4 shadow w-full" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Sua resposta</h2>
          {!supportSpeech && (
            <p className="text-sm" style={{ color: "#333" }}>
              Seu navegador não suporta reconhecimento de fala. Tente no Chrome.
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => (listening ? stopListening() : startListening())}
              className={`rounded-lg border px-3 py-2 text-sm ${listening ? "bg-red-50" : "hover:bg-gray-50"}`}
              style={{ borderColor: "var(--color-soft-gray)", color: listening ? "var(--color-red-italy)" : "var(--color-navy-italy)" }}
            >
              {listening ? " Parar" : " Gravar"}
            </button>
            <button
              onClick={() => setRecognized("")}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              style={{ borderColor: "var(--color-soft-gray)" }}
            >
              Limpar
            </button>
          </div>
          <p className="mt-3 text-sm" style={{ color: "#333" }}>
            {recognized ? recognized : "(Nenhuma resposta ainda)"}
          </p>
        </div>

        {/* Avaliação */}
        <Evaluation expected={qa?.risposta_it ?? ""} actual={recognized} score={score} missing={missing} />
      </main>
    </div>
  );
}

function tokenize(text: string): string[] {
  const STOPWORDS = new Set(["a","o","as","os","um","uma","de","do","da","dos","das","e","é","em","no","na","nos","nas","que","por","para","com","se","eu","você","meu","minha","seu","sua","os","as","como"]);
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zà-úç0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

function similarityScore(expected: string, actual: string): { score: number; missing: string[] } {
  const exp = tokenize(expected);
  const act = tokenize(actual);
  const actSet = new Set(act);
  let hit = 0;
  exp.forEach((w) => { if (actSet.has(w)) hit++; });
  const missing = exp.filter((w) => !actSet.has(w));
  const score = exp.length === 0 ? 0 : Math.round((hit / exp.length) * 100);
  return { score, missing };
}

function Evaluation({ expected, actual, score, missing }: { expected: string; actual: string; score: number; missing: string[] }) {
  return (
    <div className="rounded-xl border p-4 shadow w-full" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Pontuação</h2>
      <p className="mt-1 text-sm" style={{ color: "#333" }}>Score: {score} / 100</p>
      <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--color-navy-italy)" }}>Resposta esperada</h3>
      <p className="text-sm" style={{ color: "#333" }}>{expected || "(sem resposta cadastrada)"}</p>
      <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--color-navy-italy)" }}>Pontos fracos</h3>
      {missing.length === 0 ? (
        <p className="text-sm" style={{ color: "#333" }}>Boa! Você cobriu os principais termos.</p>
      ) : (
        <p className="text-sm" style={{ color: "#333" }}>Faltou mencionar: {missing.join(", ")}</p>
      )}
    </div>
  );
}
