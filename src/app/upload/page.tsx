"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, type UserRole } from "@/lib/auth";
import UploadSheet from "@/components/UploadSheet";

export default function UploadPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      const r = await getUserRole();
      setRole(r);
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

  if (!(role === "admin" || role === "editor")) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
        <div className="rounded-xl border p-6 shadow" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Acesso negado</h2>
          <p className="mt-1 text-sm" style={{ color: "#333" }}>Somente admin/editor podem acessar o upload de áudios.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            style={{ borderColor: "var(--color-soft-gray)", color: "var(--color-navy-italy)" }}
          >
             Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--color-ice-white)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3 text-sm" style={{ color: "var(--color-navy-italy)" }}>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
              style={{ borderColor: "var(--color-soft-gray)" }}
            >
               Voltar ao Dashboard
            </button>
            <span className="mx-2"></span>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
              style={{ borderColor: "var(--color-soft-gray)" }}
            >
              Início
            </button>
          </div>
        </nav>

        <h1 className="text-2xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Upload de áudios</h1>
        <p className="text-sm" style={{ color: "#333" }}>Envie seus arquivos de áudio para processamento.</p>

        <UploadSheet onUploaded={() => {}} />
      </main>
    </div>
  );
}
