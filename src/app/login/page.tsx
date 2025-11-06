"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!supabase || !(supabase as any).auth) {
      setLoading(false);
      setError("Configuração do Supabase ausente. Verifique variáveis de ambiente.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.session) {
      router.replace("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
      <div className="w-full max-w-md rounded-2xl border p-6 shadow" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Entrar</h1>
        <p className="mt-1 text-sm" style={{ color: "#333" }}>Use seu e-mail e senha para acessar.</p>
        <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
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
          {error && (
            <p className="text-sm" style={{ color: "var(--color-red-italy)" }}>Erro: {error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg px-4 py-2 text-white"
            style={{ backgroundColor: "var(--color-green-italy)" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}