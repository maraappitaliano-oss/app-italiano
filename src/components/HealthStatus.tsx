"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { Settings, Database, Folder, Shield, Cloud } from "lucide-react";

type Health = {
  env: Record<string, boolean>;
  storage: { bucketExists: boolean | null; error: string | null };
  db: { tableExists: boolean | null; error: string | null };
  clientRLS: { canRead: boolean | null; error: string | null };
};

export default function HealthStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.db?.error || data?.storage?.error || "Falha no health");
        setHealth(data);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      }
    })();
  }, []);

  return (
    <Card variant="soft" header={<div className="flex items-center gap-2"><span className="icon-circle icon-blue"><Settings size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Status do Supabase</span></div>}>
      {error && (
        <p className="mt-2 text-sm text-red-600">Erro ao verificar: {error}</p>
      )}
      {health && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium flex items-center gap-2" style={{ color: "var(--blue-900)" }}>
              <span className="icon-circle sm icon-green"><Cloud size={16} /></span>
              Variáveis de Ambiente
            </p>
            <ul className="mt-1 pl-5 list-disc">
              {Object.entries(health.env).map(([k, v]) => (
                <li key={k}>
                  {k}: {v ? "ok" : "faltando"}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium flex items-center gap-2" style={{ color: "var(--blue-900)" }}>
              <span className="icon-circle sm icon-purple"><Folder size={16} /></span>
              Storage
            </p>
            <p>Bucket "audios": {health.storage.bucketExists ? "ok" : "inexistente"}</p>
            {health.storage.error && (
              <p className="text-zinc-600">{health.storage.error}</p>
            )}
          </div>
          <div>
            <p className="font-medium flex items-center gap-2" style={{ color: "var(--blue-900)" }}>
              <span className="icon-circle sm icon-yellow"><Database size={16} /></span>
              Banco de Dados
            </p>
            <p>Tabela "entrevista": {health.db.tableExists ? "ok" : "inexistente"}</p>
            {health.db.error && <p className="text-zinc-600">{health.db.error}</p>}
          </div>
          <div>
            <p className="font-medium flex items-center gap-2" style={{ color: "var(--blue-900)" }}>
              <span className="icon-circle sm icon-orange"><Shield size={16} /></span>
              RLS (Cliente)
            </p>
            <p>Leitura com anon: {health.clientRLS.canRead ? "ok" : "bloqueado"}</p>
            {health.clientRLS.error && (
              <p className="text-zinc-600">{health.clientRLS.error}</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}