"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, type UserRole } from "@/lib/auth";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Users as UsersIcon, UserPlus, Mail, Lock, Shield } from "lucide-react";

export default function UsersAdminPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleNew, setRoleNew] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

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

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: roleNew }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMsg(data?.error || "Falha ao criar usuário");
    } else {
      setMsg("Usuário criado com sucesso");
      setEmail("");
      setPassword("");
      setRoleNew("viewer");
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--blue-700)" }}>Carregando...</p>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <Card variant="soft">
          <h2 className="text-xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Acesso negado</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Somente admin pode gerenciar usuários.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--background)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <div className="flex items-center gap-3">
          <span className="icon-circle icon-blue"><UsersIcon size={18} /></span>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Usuários</h1>
        </div>
        <Card className="w-full" variant="soft"
          header={<div className="flex items-center gap-2"><span className="icon-circle icon-purple"><UserPlus size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Criar usuário</span></div>}
        >
          <form className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={createUser}>
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<span className="icon-circle sm icon-blue"><Mail size={16} /></span>}
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<span className="icon-circle sm icon-yellow"><Lock size={16} /></span>}
              required
            />
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium" style={{ color: "var(--gray-900)", fontFamily: "var(--font-title)" }}>
                <span className="icon-circle sm icon-green"><Shield size={16} /></span>
                Papel
              </label>
              <select
                value={roleNew}
                onChange={(e) => setRoleNew(e.target.value)}
                className="input-ios w-full"
              >
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="md:col-span-3">
              {msg && (
                <p className="text-sm" style={{ color: msg.includes("sucesso") ? "var(--primary)" : "var(--danger, #E53935)" }}>{msg}</p>
              )}
              <Button type="submit" disabled={loading} className="mt-2" leadingIcon={<span className="icon-circle sm icon-purple"><UserPlus size={16} /></span>}>
                {loading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}