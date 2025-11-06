"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Lock, LogIn } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md px-4">
        <Card variant="soft">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-blue"><LogIn size={18} /></span>
              <h1 className="text-2xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Entrar</h1>
            </div>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Use seu e-mail e senha para acessar.</p>
            <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                leftIcon={<span className="icon-circle sm icon-blue"><Mail size={16} /></span>}
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<span className="icon-circle sm icon-yellow"><Lock size={16} /></span>}
                required
              />
              {error && (
                <p className="text-sm" style={{ color: "var(--danger, #E53935)" }}>Erro: {error}</p>
              )}
              <Button type="submit" variant="primary" disabled={loading} leadingIcon={<span className="icon-circle sm icon-blue"><LogIn size={16} /></span>}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}