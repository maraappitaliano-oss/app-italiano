"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import ProgressBar from "@/components/ui/ProgressBar";
import Icon from "@/components/ui/Icon";
import { ArrowRight, Search, Settings, CheckCircle } from "lucide-react";

export default function StyleguidePage() {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <main className="mx-auto max-w-md px-5 py-10 space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--gray-900)", fontFamily: "var(--font-title)" }}>Sistema Visual</h1>
          <p className="text-sm" style={{ color: "var(--gray-600)" }}>Paleta, tipografia, componentes e microinterações.</p>
        </header>

        {/* Paleta Azul */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--gray-900)" }}>Paleta Azul</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: "Sky", var: "var(--blue-300)" },
              { name: "Aqua", var: "var(--blue-200)" },
              { name: "Surface", var: "var(--surface)" },
              { name: "Navy", var: "var(--blue-900)" },
            ].map((c) => (
              <div key={c.name} className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--blue-100)", background: c.var }}>
                <p className="text-xs" style={{ color: "var(--gray-900)" }}>{c.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Botões */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--gray-900)" }}>Botões</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" trailingIcon={<ArrowRight size={16} />}>
              Continuar
            </Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Perigo</Button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--gray-900)" }}>Cards</h2>
          <Card header={<div className="flex items-center gap-2"><Icon><Settings /></Icon><span className="font-semibold">Configurações</span></div>}>
            <p className="text-sm" style={{ color: "var(--gray-600)" }}>Com sombras suaves estilo iOS e cantos arredondados.</p>
          </Card>
        </section>

        {/* Inputs */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--gray-900)" }}>Inputs</h2>
          <Input label="Busca" placeholder="Pesquisar frases" leftIcon={<Search size={16} />} hint="Toque para começar" />
        </section>

        {/* Progresso */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--gray-900)" }}>Progresso</h2>
          <ProgressBar value={67} />
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--gray-600)" }}>
            <CheckCircle size={16} color="var(--primary)" />
            <span>4 de 6 lições hoje</span>
          </div>
        </section>
      </main>
    </div>
  );
}