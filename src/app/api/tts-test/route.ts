import { NextResponse } from "next/server";
import { synthesizeItalianMP3 } from "@/lib/tts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const text = url.searchParams.get("text") || "Ciao, questo è un test del TTS.";

    const mp3 = await synthesizeItalianMP3(text);
    return new Response(mp3, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache, no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Errore TTS" },
      { status: 500 }
    );
  }
}