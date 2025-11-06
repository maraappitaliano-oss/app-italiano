"use client";
import React, { useState } from "react";

export default function TtsTest() {
  const [text, setText] = useState("Ciao, questo è un test del TTS.");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function runTest() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/tts-test?text=${encodeURIComponent(text)}&t=${Date.now()}`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Falha TTS (${res.status})`);
      }
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 rounded-xl border bg-white p-4 shadow-md">
      <h3 className="text-lg font-semibold">Teste de TTS (Google)</h3>
      <p className="mt-1 text-sm text-zinc-700">
        Digite um texto curto e gere áudio para validar a integração.
      </p>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end">
        <label className="md:flex-1">
          <span className="text-sm font-medium">Texto</span>
          <input
            className="mt-2 block w-full rounded-lg border p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um texto curto em italiano"
          />
        </label>
        <button
          onClick={runTest}
          disabled={loading || !text.trim()}
          className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Testar TTS"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">Erro: {error}</p>
      )}
      {audioSrc && (
        <audio className="mt-3 w-full" controls src={audioSrc} />
      )}
    </div>
  );
}