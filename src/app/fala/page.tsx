"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserRole, type UserRole } from "@/lib/auth";
import { supabase, type Entrevista } from "@/lib/supabaseClient";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Mic, Volume2, ArrowRight, Trash2, Layers, CheckCircle, MessageSquare, Home } from "lucide-react";

export default function FalaPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [ready, setReady] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [items, setItems] = useState<Entrevista[]>([]);
  const [index, setIndex] = useState(0);
  const [recognized, setRecognized] = useState<string>("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const qa = useMemo(() => items[index] ?? null, [items, index]);
  const supportSpeech = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) { router.replace("/login"); return; }
      const r = await getUserRole();
      setRole(r);
      // Carregar categorias distintas do Supabase
      const { data, error } = await supabase
        .from("entrevista")
        .select("categoria")
        .not("categoria", "is", null);
      if (!error && Array.isArray(data)) {
        const uniq = Array.from(new Set((data as any[]).map((d) => d.categoria))).filter(Boolean) as string[];
        setCategories(uniq);
        setCategory((prev) => prev || uniq[0] || "");
      }
      setReady(true);
    })();
  }, [router]);

  useEffect(() => {
    (async () => {
      if (!category) { setItems([]); return; }
      const { data, error } = await supabase
        .from("entrevista")
        .select("id, domanda_it, domanda_pt, risposta_it, risposta_pt, categoria, audio_domanda_url, audio_risposta_url, created_at")
        .eq("categoria", category)
        .order("id", { ascending: true });
      if (!error && Array.isArray(data)) {
        setItems(data as Entrevista[]);
        setIndex(0);
        setRecognized("");
      }
    })();
  }, [category]);

  function playQuestionAudio() {
    const url = qa?.audio_domanda_url || null;
    if (url && audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
      return;
    }
    // fallback: TTS nativo do navegador
    if (qa?.domanda_it && typeof window !== "undefined" && ("speechSynthesis" in window)) {
      const utter = new SpeechSynthesisUtterance(qa.domanda_it);
      utter.lang = "it-IT"; // ajustar idioma conforme conteúdo
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }

  function startListening() {
    if (!supportSpeech) return;
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const rec = new SR();
    rec.lang = "pt-BR"; // ajuste conforme o idioma praticado
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const txt = e.results?.[0]?.[0]?.transcript ?? "";
      setRecognized(txt);
      setListening(false);
    };
    rec.onerror = () => { setListening(false); };
    rec.onend = () => { setListening(false); };
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stopListening() {
    const rec = recognitionRef.current;
    if (rec) { try { rec.stop(); } catch {} }
    setListening(false);
  }

  const { score, missing } = useMemo(() => similarityScore(qa?.risposta_it ?? "", recognized), [qa, recognized]);

  if (!ready) {
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
          <div className="flex items-center gap-3">
            <span className="icon-circle icon-blue"><Mic size={18} /></span>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Fala (Prática)</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")} leadingIcon={<span className="icon-circle sm icon-blue"><Home size={16} /></span>}>
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Seleção de categoria */}
        <div className="flex items-center gap-3">
          <label className="text-sm flex items-center gap-2" style={{ color: "#333" }}>
            <span className="icon-circle sm icon-green"><Layers size={16} /></span>
            Categoria:
          </label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); }}
            className="input-ios text-sm"
          >
            {categories.length === 0 ? (
              <option value="">(Nenhuma categoria  faça upload de planilha)</option>
            ) : (
              categories.map((c) => (<option key={c} value={c}>{c}</option>))
            )}
          </select>
        </div>

        {/* Pergunta (áudio + texto) */}
        <Card variant="soft" header={<div className="flex items-center gap-2"><span className="icon-circle icon-blue"><MessageSquare size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Pergunta</span></div>}>
          {!qa ? (
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>(Sem perguntas nesta categoria)</p>
          ) : (
            <>
              <p className="mt-1" style={{ color: "var(--text-muted)" }}>{qa.domanda_it}</p>
              <audio ref={audioRef} className="mt-2" controls />
              <div className="mt-3 flex gap-2">
                <Button onClick={playQuestionAudio} variant="primary" leadingIcon={<span className="icon-circle sm icon-blue"><Volume2 size={16} /></span>}>Ouvir</Button>
                <Button onClick={() => setIndex((i) => (i + 1) % items.length)} disabled={items.length === 0} variant="outline" leadingIcon={<span className="icon-circle sm icon-yellow"><ArrowRight size={16} /></span>}>Próxima</Button>
              </div>
            </>
          )}
        </Card>

        {/* Resposta do usuário (microfone) */}
        <Card variant="soft" header={<div className="flex items-center gap-2"><span className="icon-circle icon-purple"><Mic size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Sua resposta</span></div>}>
          {!supportSpeech && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Seu navegador não suporta reconhecimento de fala. Tente no Chrome.
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={() => (listening ? stopListening() : startListening())} variant={listening ? "danger" : "primary"}
              leadingIcon={<span className="icon-circle sm icon-purple"><Mic size={16} /></span>}>
              {listening ? "Parar" : "Gravar"}
            </Button>
            <Button onClick={() => setRecognized("")} variant="outline" leadingIcon={<span className="icon-circle sm icon-orange"><Trash2 size={16} /></span>}>
              Limpar
            </Button>
          </div>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            {recognized ? recognized : "(Nenhuma resposta ainda)"}
          </p>
        </Card>

        {/* Avaliação */}
        <Evaluation expected={qa?.risposta_it ?? ""} actual={recognized} score={score} missing={missing} />
      </main>
    </div>
  );
}

function tokenize(text: string): string[] {
  const STOPWORDS = new Set(["a","o","as","os","um","uma","de","do","da","dos","das","e","é","em","no","na","nos","nas","que","por","para","com","se","eu","você","meu","minha","seu","sua","os","as","como"]);
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zà-úç0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

function similarityScore(expected: string, actual: string): { score: number; missing: string[] } {
  const exp = tokenize(expected);
  const act = tokenize(actual);
  const actSet = new Set(act);
  let hit = 0;
  exp.forEach((w) => { if (actSet.has(w)) hit++; });
  const missing = exp.filter((w) => !actSet.has(w));
  const score = exp.length === 0 ? 0 : Math.round((hit / exp.length) * 100);
  return { score, missing };
}

function Evaluation({ expected, actual, score, missing }: { expected: string; actual: string; score: number; missing: string[] }) {
  return (
    <Card variant="soft" header={<div className="flex items-center gap-2"><span className="icon-circle icon-green"><CheckCircle size={18} /></span><span className="font-semibold" style={{ color: "var(--blue-900)", fontFamily: "var(--font-title)" }}>Pontuação</span></div>}>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Score: {score} / 100</p>
      <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--blue-900)" }}>Resposta esperada</h3>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{expected || "(sem resposta cadastrada)"}</p>
      <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--blue-900)" }}>Pontos fracos</h3>
      {missing.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Boa! Você cobriu os principais termos.</p>
      ) : (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Faltou mencionar: {missing.join(", ")}</p>
      )}
    </Card>
  );
}
