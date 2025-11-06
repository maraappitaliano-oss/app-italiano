"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, signOut, type UserRole } from "@/lib/auth";
import {
  Upload,
  Users,
  LogOut,
  Mic,
  Layers,
  FileAudio,
  Keyboard,
  BookOpen,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      const r = await getUserRole();
      setRole(r);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
        <p className="text-sm" style={{ color: "var(--color-navy-italy)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--color-ice-white)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Dashboard</h1>
          <button
            onClick={async () => { await signOut(); router.replace("/login"); }}
            className="rounded-lg px-3 py-2 text-white"
            style={{ backgroundColor: "var(--color-red-italy)" }}
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Pronúncia */}
          <div
            className="rounded-xl border p-4 shadow cursor-pointer"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
            onClick={() => router.push("/modos/pronuncia")}
          >
            <div className="flex items-center gap-2">
              <Mic size={20} color={"var(--color-green-italy)"} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Pronúncia (Escutar e Repetir)</h3>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#333" }}>Falar italiano corretamente.</p>
          </div>

          {/* Flashcards */}
          <div
            className="rounded-xl border p-4 shadow cursor-pointer"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
            onClick={() => router.push("/modos/flashcards")}
          >
            <div className="flex items-center gap-2">
              <Layers size={20} color={"var(--color-navy-italy)"} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Flashcards (SRS)</h3>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#333" }}>Memorizar vocabulário e frases.</p>
          </div>

          {/* Fala (Prática) */}
          <div
            className="rounded-xl border p-4 shadow cursor-pointer"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
            onClick={() => router.push("/fala")}
          >
            <div className="flex items-center gap-2">
              <FileAudio size={20} color={"var(--color-navy-italy)"} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Fala (Prática)</h3>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#333" }}>Treinar o consulado italiano.</p>
          </div>

          {/* Ditado */}
          <div
            className="rounded-xl border p-4 shadow cursor-pointer"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
            onClick={() => router.push("/modos/ditado")}
          >
            <div className="flex items-center gap-2">
              <Keyboard size={20} color={"var(--color-navy-italy)"} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Ditado (Escrita)</h3>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#333" }}>Compreensão auditiva e ortografia.</p>
          </div>

          {/* Histórias / Diálogos */}
          <div
            className="rounded-xl border p-4 shadow cursor-pointer"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
            onClick={() => router.push("/modos/historias")}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={20} color={"var(--color-navy-italy)"} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Histórias / Diálogos</h3>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#333" }}>Aprender em contexto real.</p>
          </div>

          {/* Prática Rápida */}
          <div
            className="rounded-xl border p-4 shadow cursor-pointer"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
            onClick={() => router.push("/modos/pratica")}
          >
            <div className="flex items-center gap-2">
              <Zap size={20} color={"var(--color-green-italy)"} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Prática Rápida (5 minutos)</h3>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#333" }}>Estudar diariamente de forma leve.</p>
          </div>

          {/* Usuários - Admin */}
          {role === "admin" && (
            <div
              className="rounded-xl border p-4 shadow cursor-pointer"
              style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
              onClick={() => router.push("/users")}
            >
              <div className="flex items-center gap-2">
                <Users size={20} color={"var(--color-navy-italy)"} />
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Usuários</h3>
              </div>
              <p className="mt-1 text-sm" style={{ color: "#333" }}>Criar e gerenciar contas e papéis.</p>
            </div>
          )}

          {/* Upload de Áudios - por último */}
          {(role === "admin" || role === "editor") && (
            <div
              className="rounded-xl border p-4 shadow cursor-pointer"
              style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
              onClick={() => router.push("/upload")}
            >
              <div className="flex items-center gap-2">
                <Upload size={20} color={"var(--color-green-italy)"} />
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Upload de Áudios</h3>
              </div>
              <p className="mt-1 text-sm" style={{ color: "#333" }}>Subir áudios (somente admin/editor).</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


