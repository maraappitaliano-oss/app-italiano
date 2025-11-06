"use client";
import React, { useState } from "react";

type Props = {
  onUploaded?: () => void;
};

export default function UploadSheet({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [created, setCreated] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLogs([]);
    setCreated(null);
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploadSheet", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no upload");
      setLogs(data.logs || []);
      setCreated(data.created ?? 0);
      onUploaded?.();
    } catch (err: any) {
      setLogs([`Erro: ${err?.message ?? "desconhecido"}`]);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isUploading ? "Processando..." : "Enviar e Processar"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border bg-white p-4 shadow-md">
        <h3 className="text-lg font-semibold">Progresso</h3>
        {isUploading && (
          <p className="mt-2 text-sm text-zinc-600">Processando linhas, aguarde...</p>
        )}
        {created !== null && (
          <p className="mt-2 text-sm text-zinc-800">
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