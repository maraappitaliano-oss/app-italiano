"use client";
import React, { useEffect, useState } from "react";

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
    <div className="w-full rounded-xl border bg-white p-4 shadow-md">
      <h3 className="text-lg font-semibold">Status do Supabase</h3>
      {error && (
        <p className="mt-2 text-sm text-red-600">Erro ao verificar: {error}</p>
      )}
      {health && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium">Variáveis de Ambiente</p>
            <ul className="mt-1 pl-5 list-disc">
              {Object.entries(health.env).map(([k, v]) => (
                <li key={k}>
                  {k}: {v ? "ok" : "faltando"}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Storage</p>
            <p>Bucket "audios": {health.storage.bucketExists ? "ok" : "inexistente"}</p>
            {health.storage.error && (
              <p className="text-zinc-600">{health.storage.error}</p>
            )}
          </div>
          <div>
            <p className="font-medium">Banco de Dados</p>
            <p>Tabela "entrevista": {health.db.tableExists ? "ok" : "inexistente"}</p>
            {health.db.error && <p className="text-zinc-600">{health.db.error}</p>}
          </div>
          <div>
            <p className="font-medium">RLS (Cliente)</p>
            <p>Leitura com anon: {health.clientRLS.canRead ? "ok" : "bloqueado"}</p>
            {health.clientRLS.error && (
              <p className="text-zinc-600">{health.clientRLS.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}