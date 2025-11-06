"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import ListaDomande from "@/components/ListaDomande";

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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
        <p className="text-sm" style={{ color: "var(--color-navy-italy)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--color-ice-white)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Lista de Frases</h1>
        <ListaDomande reloadSignal={reloadSignal} />
      </main>
    </div>
  );
}