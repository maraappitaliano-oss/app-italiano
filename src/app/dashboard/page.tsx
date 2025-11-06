"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, signOut, type UserRole } from "@/lib/auth";
import { Upload, Users, LogOut } from "lucide-react";
import DashboardOverview from "@/components/DashboardOverview";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--blue-700)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--background)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Dashboard</h1>
          <Button
            onClick={async () => { await signOut(); router.replace("/login"); }}
            variant="outline"
            title="Sair"
            leadingIcon={<span className="icon-circle sm icon-blue"><LogOut size={16} /></span>}
          >
            Sair
          </Button>
        </div>

        {/* Overview com progresso e cards principais */}
        <DashboardOverview />

        {/* Admin tools (sem título) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {role === "admin" && (
            <Card clickable className="tile-solid-blue" onClick={() => router.push("/users")}>
              <div className="flex items-center gap-3">
                <span className="icon-circle" style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}><Users size={18} /></span>
                <h3 className="text-lg font-semibold" style={{ color: "#fff", fontFamily: "var(--font-title)" }}>Usuários</h3>
              </div>
              <p className="mt-1 text-sm" style={{ color: "#fff" }}>Criar e gerenciar contas e papéis.</p>
            </Card>
          )}
          {(role === "admin" || role === "editor") && (
            <Card clickable className="tile-solid-blue" onClick={() => router.push("/upload")}>
              <div className="flex items-center gap-3">
                <span className="icon-circle" style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}><Upload size={18} /></span>
                <h3 className="text-lg font-semibold" style={{ color: "#fff", fontFamily: "var(--font-title)" }}>Upload de Áudios</h3>
              </div>
              <p className="mt-1 text-sm" style={{ color: "#fff" }}>Subir áudios (somente admin/editor).</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}


