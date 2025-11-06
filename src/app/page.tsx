"use client";
import React, { useState } from "react";
import HealthStatus from "@/components/HealthStatus";
import UploadSheet from "@/components/UploadSheet";
import ListaDomande from "@/components/ListaDomande";

export default function Home() {
  const [reloadSignal, setReloadSignal] = useState(0);
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <h1 className="text-3xl font-bold">Gestione delle Domande e Risposte 🇮🇹</h1>
        <p className="text-sm text-zinc-600">
          Importe uma planilha com perguntas e respostas em IT/PT. Os áudios em
          italiano serão gerados automaticamente e salvos no Supabase.
        </p>
        <HealthStatus />
        <UploadSheet onUploaded={() => setReloadSignal((v) => v + 1)} />
        <ListaDomande reloadSignal={reloadSignal} />
      </main>
    </div>
  );
}