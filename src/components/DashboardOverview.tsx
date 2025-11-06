"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "./CircularProgress";
import { BookOpen, MessageSquare, Edit3, RefreshCw, Mic, Layers, FileAudio, Keyboard, Zap } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardOverview() {
  const router = useRouter();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        const fullName = (user?.user_metadata as any)?.full_name as string | undefined;
        const email = user?.email || "";
        const fallback = email ? email.split("@")[0] : "Marco";
        setName(fullName?.trim() || fallback);
      } catch {
        setName("Marco");
      }
    })();
  }, []);

  const lessonsDone = 4;
  const lessonsTotal = 6;
  const percent = useMemo(() => Math.round((lessonsDone / lessonsTotal) * 100), [lessonsDone, lessonsTotal]);

  return (
    <section className="w-full">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}
          >
            Buongiorno,
          </h2>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--primary)", fontFamily: "var(--font-title)" }}
          >
            {name}!
          </p>
        </div>
        <button
          className="rounded-full border p-2"
          style={{ borderColor: "var(--color-soft-gray)", background: "#fff" }}
          title="Configurações"
          onClick={() => router.push("/settings")}
        >
          {/* simple gear icon using SVG to avoid extra deps */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy-italy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73h.09a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Progress Card */}
      <div className="mt-5 tile flex w-full items-center gap-4 p-4">
        <div className="flex-shrink-0">
          <CircularProgress value={percent} size={120} strokeWidth={10} label="Progresso" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ color: "var(--color-navy-italy)" }}>Progresso Diário</span>
          <span className="mt-1 text-xl font-bold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>
            {lessonsDone} de {lessonsTotal} lições
          </span>
          <span className="mt-1 text-sm" style={{ color: "#4b5563" }}>Continue assim!</span>
        </div>
      </div>

      {/* Continue Aprendendo */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Continue Aprendendo</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            className="tile tile-tinted-purple flex items-center justify-between p-4"
            onClick={() => router.push("/modos/flashcards")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-purple"><BookOpen size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Vocabulário</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>28 palavras novas</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <span className="status-dot dot-info" />
              ›
            </span>
          </button>

          <button
            className="tile tile-tinted-blue flex items-center justify-between p-4"
            onClick={() => router.push("/fala")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-blue"><MessageSquare size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Diálogos</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Conversação básica</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <span className="status-dot dot-success" />
              ›
            </span>
          </button>

          <button
            className="tile tile-tinted-yellow flex items-center justify-between p-4"
            onClick={() => router.push("/modos/ditado")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-yellow"><Edit3 size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Exercícios</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>12 questões</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <span className="status-dot dot-warning" />
              ›
            </span>
          </button>

          <button
            className="tile tile-tinted-green flex items-center justify-between p-4"
            onClick={() => router.push("/modos/pratica")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-green"><RefreshCw size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Revisão</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>8 cartões prontos</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
              <span className="status-dot dot-neutral" />
              ›
            </span>
          </button>
          {/* Outros Modos integrados */}
          <button
            className="tile tile-tinted-blue flex items-center justify-between p-4"
            onClick={() => router.push("/modos/pronuncia")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-blue"><Mic size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Pronúncia (Escutar e Repetir)</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Falar italiano corretamente.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>›</span>
          </button>
          <button
            className="tile tile-tinted-purple flex items-center justify-between p-4"
            onClick={() => router.push("/modos/flashcards")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-purple"><Layers size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Flashcards (SRS)</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Memorizar vocabulário e frases.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>›</span>
          </button>
          <button
            className="tile tile-tinted-green flex items-center justify-between p-4"
            onClick={() => router.push("/fala")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-green"><FileAudio size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Fala (Prática)</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Treinar o consulado italiano.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>›</span>
          </button>
          <button
            className="tile tile-tinted-yellow flex items-center justify-between p-4"
            onClick={() => router.push("/modos/ditado")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-yellow"><Keyboard size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Ditado (Escrita)</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Compreensão auditiva e ortografia.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>›</span>
          </button>
          <button
            className="tile tile-tinted-orange flex items-center justify-between p-4"
            onClick={() => router.push("/modos/historias")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-orange"><BookOpen size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Histórias / Diálogos</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Aprender em contexto real.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>›</span>
          </button>
          <button
            className="tile tile-tinted-blue flex items-center justify-between p-4"
            onClick={() => router.push("/modos/pratica")}
          >
            <div className="flex items-center gap-3">
              <span className="icon-circle icon-blue"><Zap size={18} /></span>
              <div className="text-left">
                <p className="font-semibold" style={{ color: "var(--color-navy-italy)" }}>Prática Rápida (5 minutos)</p>
                <p className="text-sm" style={{ color: "#4b5563" }}>Estudar diariamente de forma leve.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>›</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Suas Estatísticas</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="tile-solid-blue p-4 text-center">
            <p className="text-sm opacity-80">Dias seguidos</p>
            <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-title)" }}>12</p>
          </div>
          <div className="tile-solid-blue p-4 text-center">
            <p className="text-sm opacity-80">Pontos totais</p>
            <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-title)" }}>247</p>
          </div>
        </div>
      </div>
    </section>
  );
}