"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Input from "@/components/ui/Input";
import { Tag, FileSpreadsheet, Upload as UploadIcon, Layers, Info, Download } from "lucide-react";

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
      <Card variant="soft" className="mb-6 tile-tinted-blue" header={<div className="flex items-center gap-2"><span className="icon-circle icon-blue"><Info size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Como funciona</span></div>}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Preferimos planilha comum (.xlsx), mas .csv também funciona. Baixe o modelo com as colunas
          obrigatórias (<code>domanda_it, domanda_pt, risposta_it, risposta_pt</code>).
        </p>
        <a
          href="/api/template"
          download
          className="mt-3 btn-base btn-primary inline-flex items-center gap-2 h-10 px-4 text-sm w-fit"
        >
          <span className="icon-circle sm icon-blue"><Download size={16} /></span>
          <span>Baixar modelo (.csv)</span>
        </a>
      </Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card
          variant="soft"
          className="tile-tinted-purple"
          header={<div className="flex items-center gap-2"><span className="icon-circle icon-purple"><Tag size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Título/Categoria</span></div>}
        >
          <Input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex.: Básico 1, Viagens, Negócios"
          />
        </Card>

        <Card
          variant="soft"
          className="tile-tinted-blue"
          header={<div className="flex items-center gap-2"><span className="icon-circle icon-blue"><FileSpreadsheet size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Planilha (.xlsx ou .csv)</span></div>}
        >
          <Input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)}
          />
        </Card>

        <Button disabled={!file || isUploading} leadingIcon={<span className="icon-circle sm icon-blue"><UploadIcon size={16} /></span>}>
          {isUploading ? "Processando..." : "Enviar e Processar"}
        </Button>
      </form>
      <Card className="mt-4 tile-tinted-green" variant="soft" header={<div className="flex items-center gap-2"><span className="icon-circle icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M20 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7" /><path d="M7 7h10l-2-3H9L7 7z" /></svg></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Progresso</span></div>}>
        <div className="mt-2">
          <ProgressBar value={percent} trackColor="var(--green-100)" fillColor="var(--green-500)" />
        </div>
        {isUploading && (
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Processando linhas, aguarde...</p>
        )}
        {created !== null && (
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Registros inseridos: <span className="font-bold">{created}</span>
          </p>
        )}
        <ul className="mt-2 list-disc pl-6 text-sm" style={{ color: "var(--text-muted)" }}>
          {logs.map((l, idx) => (
            <li key={idx}>{l}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}