"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Layers } from "lucide-react";

export default function FlashcardsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
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
        <div className="flex items-center gap-2">
          <Layers size={22} color={"var(--color-navy-italy)"} />
          <h1 className="text-2xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Flashcards (SRS)</h1>
        </div>
        <p className="text-sm" style={{ color: "#333" }}>Placeholder: frente (frase + áudio), verso (tradução + exemplo) e botões Fácil/Médio/Difícil.</p>
      </main>
    </div>
  );
}