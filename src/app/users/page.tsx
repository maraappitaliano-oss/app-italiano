"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, type UserRole } from "@/lib/auth";

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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
        <p className="text-sm" style={{ color: "var(--color-navy-italy)" }}>Carregando...</p>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
        <div className="rounded-xl border p-6 shadow" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Acesso negado</h2>
          <p className="mt-1 text-sm" style={{ color: "#333" }}>Somente admin pode gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center" style={{ background: "var(--color-ice-white)" }}>
      <main className="flex w-full max-w-4xl flex-col items-start gap-6 py-16 px-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Usuários</h1>
        <div className="w-full rounded-xl border p-6 shadow" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
          <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Criar usuário</h3>
          <form className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={createUser}>
            <label className="text-sm">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
                style={{ borderColor: "var(--color-soft-gray)" }}
                required
              />
            </label>
            <label className="text-sm">
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
                style={{ borderColor: "var(--color-soft-gray)" }}
                required
              />
            </label>
            <label className="text-sm">
              Papel
              <select
                value={roleNew}
                onChange={(e) => setRoleNew(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
                style={{ borderColor: "var(--color-soft-gray)" }}
              >
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <div className="md:col-span-3">
              {msg && (
                <p className="text-sm" style={{ color: msg.includes("sucesso") ? "var(--color-green-italy)" : "var(--color-red-italy)" }}>{msg}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg px-4 py-2 text-white"
                style={{ backgroundColor: "var(--color-green-italy)" }}
              >
                {loading ? "Criando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}