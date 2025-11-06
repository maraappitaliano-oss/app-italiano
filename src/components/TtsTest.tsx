"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Volume2, Type, Play } from "lucide-react";

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
    <Card variant="soft" header={<div className="flex items-center gap-2"><span className="icon-circle icon-blue"><Volume2 size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Teste de TTS (Google)</span></div>}>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Digite um texto curto e gere áudio para validar a integração.
      </p>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-2">
          <Input
            label="Texto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um texto curto em italiano"
            leftIcon={<span className="icon-circle sm icon-purple"><Type size={16} /></span>}
          />
        </div>
        <div>
          <Button onClick={runTest} disabled={loading || !text.trim()} leadingIcon={<span className="icon-circle sm icon-blue"><Play size={16} /></span>}>
            {loading ? "Gerando..." : "Testar TTS"}
          </Button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm" style={{ color: "var(--danger, #E53935)" }}>Erro: {error}</p>
      )}
      {audioSrc && (
        <audio className="mt-3 w-full" controls src={audioSrc} />
      )}
    </Card>
  );
}