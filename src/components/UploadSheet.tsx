"use client";
import React, { useState } from "react";

type Props = {
  onUploaded?: () => void;
};

export default function UploadSheet({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [categoria, setCategoria] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [created, setCreated] = useState<number | null>(null);
  const [percent, setPercent] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLogs([]);
    setCreated(null);
    setPercent(0);
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (categoria.trim()) {
        fd.append("categoria", categoria.trim());
      }
      const res = await fetch("/api/uploadSheet", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no upload");
      setLogs(data.logs || []);
      setCreated(data.created ?? 0);
      const total = (data.total ?? 0) || (Array.isArray(data.logs) ? data.logs.length : 0);
      const processed = (data.processed ?? data.created ?? 0) || 0;
      if (total > 0) setPercent(Math.min(100, Math.round((processed / total) * 100)));
      onUploaded?.();
    } catch (err: any) {
      setLogs([`Erro: ${err?.message ?? "desconhecido"}`]);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 rounded-xl border bg-white p-4 shadow-md">
        <p className="text-sm text-zinc-800">
          Preferimos planilha comum (.xlsx), mas .csv também funciona. Baixe o modelo com as colunas
          obrigatórias (<code>domanda_it, domanda_pt, risposta_it, risposta_pt</code>).
        </p>
        <a
          href="/api/template"
          download
          className="mt-2 inline-block rounded-lg px-3 py-2 text-white hover:opacity-90"
          style={{ backgroundColor: "var(--color-green-italy)" }}
        >
          Baixar modelo (.csv)
        </a>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-medium">Título/Categoria (opcional)</span>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex.: Básico 1, Viagens, Negócios"
            className="mt-2 block w-full rounded-lg border p-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Planilha (.xlsx ou .csv)</span>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full rounded-lg border p-2"
          />
        </label>
        <button
          disabled={!file || isUploading}
          className="rounded-xl px-4 py-2 text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--color-green-italy)" }}
        >
          {isUploading ? "Processando..." : "Enviar e Processar"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border p-4 shadow-md" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
        <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Progresso</h3>
        <div className="mt-2 h-3 w-full rounded-full" style={{ backgroundColor: "var(--color-soft-gray)" }}>
          <div className="h-3 rounded-full" style={{ width: `${percent}%`, backgroundColor: "var(--color-green-italy)" }} />
        </div>
        {isUploading && (
          <p className="mt-2 text-sm" style={{ color: "#333" }}>Processando linhas, aguarde...</p>
        )}
        {created !== null && (
          <p className="mt-2 text-sm" style={{ color: "#333" }}>
            Registros inseridos: <span className="font-bold">{created}</span>
          </p>
        )}
        <ul className="mt-2 list-disc pl-6 text-sm">
          {logs.map((l, idx) => (
            <li key={idx}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}