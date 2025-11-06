"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, type UserRole } from "@/lib/auth";
import UploadSheet from "@/components/UploadSheet";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Upload as UploadIcon, Home, LayoutDashboard, ArrowLeft } from "lucide-react";

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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--blue-700)" }}>Carregando...</p>
      </div>
    );
  }

  if (!(role === "admin" || role === "editor")) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <Card variant="soft">
          <h2 className="text-xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Acesso negado</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Somente admin/editor podem acessar o upload de áudios.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Voltar ao Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--background)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3 text-sm" style={{ color: "var(--blue-900)" }}>
            <Button variant="outline" onClick={() => router.push("/dashboard")} leadingIcon={<span className="icon-circle sm icon-green"><ArrowLeft size={16} /></span>}>
              Voltar ao Dashboard
            </Button>
            <span className="mx-2"></span>
            <Button variant="outline" onClick={() => router.push("/")} leadingIcon={<span className="icon-circle sm icon-purple"><Home size={16} /></span>}>
              Início
            </Button>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <span className="icon-circle icon-blue"><UploadIcon size={18} /></span>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Upload de áudios</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Envie seus arquivos de áudio para processamento.</p>

        <UploadSheet onUploaded={() => {}} />
      </main>
    </div>
  );
}
