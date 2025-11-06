"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import ListaDomande from "@/components/ListaDomande";
import { BookOpen } from "lucide-react";

export default function ListaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [reloadSignal, setReloadSignal] = useState(0);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      setReady(true);
    })();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--blue-700)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--background)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <div className="flex items-center gap-3">
          <span className="icon-circle icon-blue"><BookOpen size={18} /></span>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Lista de Frases</h1>
        </div>
        <ListaDomande reloadSignal={reloadSignal} />
      </main>
    </div>
  );
}