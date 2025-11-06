"use client";
import React, { useEffect, useState } from "react";
import { Play, Edit, Trash2 } from "lucide-react";
import { supabase, type Entrevista } from "@/lib/supabaseClient";

type Props = {
  reloadSignal?: number;
};

export default function ListaDomande({ reloadSignal }: Props) {
  const [items, setItems] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Entrevista>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  async function load() {
    setLoading(true);
    const base = supabase.from("entrevista").select("*");
    const query = filterCategoria
      ? base.eq("categoria", filterCategoria)
      : base;
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (error) {
      console.error(error);
    }
    const list = data ?? [];
    setItems(list);
    // derivar categorias únicas dos itens carregados
    const cats = Array.from(
      new Set((list.map((i) => i.categoria || "") || []).filter((c) => c))
    ).sort((a, b) => a.localeCompare(b));
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadSignal]);

  function startEdit(item: Entrevista) {
    setEditingId(item.id);
    setEditForm({ ...item });
  }

  async function saveEdit() {
    if (editingId == null) return;
    const updatePayload = {
      domanda_it: editForm.domanda_it ?? "",
      domanda_pt: editForm.domanda_pt ?? "",
      risposta_it: editForm.risposta_it ?? "",
      risposta_pt: editForm.risposta_pt ?? "",
      categoria: (editForm as any).categoria ?? null,
    };
    const { error } = await supabase
      .from("entrevista")
      .update(updatePayload)
      .eq("id", editingId);
    if (!error) {
      setEditingId(null);
      setEditForm({});
      await load();
    }
  }

  async function remove(id: number) {
    const { error } = await supabase.from("entrevista").delete().eq("id", id);
    if (!error) {
      await load();
    }
  }

  function play(url: string, id: number) {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const a = new Audio(url);
      audioRef.current = a;
      setPlayingId(id);
      a.onended = () => {
        setPlayingId((curr) => (curr === id ? null : curr));
        audioRef.current = null;
      };
      a.play().catch(() => {
        setPlayingId(null);
      });
    } catch (e) {
      setPlayingId(null);
    }
  }


  return (
    <div className="mt-8 w-full max-w-3xl">
      <h2 className="mb-2 text-xl font-semibold" style={{ color: "var(--color-navy-italy)", fontFamily: "var(--font-title)" }}>Frases</h2>
      <div className="mb-4 flex flex-col gap-2 rounded-xl border p-3 shadow-md" style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <label className="block">
            <span className="text-sm font-medium">Filtrar por categoria</span>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="mt-2 block w-full rounded-lg border p-2 text-sm"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => {
              setFilterCategoria("");
              load();
            }}
            className="mt-2 rounded-lg px-3 py-2 md:mt-8 text-sm"
            style={{ backgroundColor: "var(--color-soft-gray)", color: "#0a0a0a" }}
          >
            Limpar filtro
          </button>
        </div>
      </div>
      {loading && (
        <p className="text-sm text-zinc-600">Carregando registros...</p>
      )}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl p-3 shadow-md border"
            style={{ background: "#fff", borderColor: "var(--color-soft-gray)" }}
          >
            {editingId === item.id ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs">Domanda (IT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2 text-sm"
                      value={editForm.domanda_it ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, domanda_it: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Domanda (PT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2 text-sm"
                      value={editForm.domanda_pt ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, domanda_pt: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Risposta (IT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2 text-sm"
                      value={editForm.risposta_it ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, risposta_it: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Risposta (PT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2 text-sm"
                      value={editForm.risposta_pt ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, risposta_pt: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Título/Categoria</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2 text-sm"
                      value={(editForm as any).categoria ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, categoria: e.target.value } as any)
                      }
                    />
                  </label>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-white text-sm"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="rounded-lg bg-zinc-300 px-3 py-2 text-zinc-900 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    {item.categoria && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-700 w-fit">
                        {item.categoria}
                      </span>
                    )}
                    <p className="text-sm text-zinc-900">{item.domanda_it}</p>
                    <p className="text-sm text-zinc-700">{item.risposta_it}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.audio_domanda_url && (
                      <button
                        aria-label="Ouvir pergunta"
                        title="Ouvir pergunta"
                        onClick={() => play(item.audio_domanda_url!, item.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center border`} 
                        style={{ borderColor: "var(--color-soft-gray)", backgroundColor: playingId === item.id ? "var(--color-green-italy)" : "#fff", color: playingId === item.id ? "#fff" : "#0a0a0a" }}
                      >
                        <Play size={18} />
                      </button>
                    )}
                    {item.audio_risposta_url && (
                      <button
                        aria-label="Ouvir resposta"
                        title="Ouvir resposta"
                        onClick={() => play(item.audio_risposta_url!, item.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center border`}
                        style={{ borderColor: "var(--color-soft-gray)", backgroundColor: playingId === item.id ? "var(--color-green-italy)" : "#fff", color: playingId === item.id ? "#fff" : "#0a0a0a" }}
                      >
                        <Play size={18} />
                      </button>
                    )}
                    <button
                      aria-label="Editar"
                      title="Editar"
                      onClick={() => startEdit(item)}
                      className="h-8 w-8 rounded-full flex items-center justify-center border"
                      style={{ borderColor: "var(--color-soft-gray)", backgroundColor: "#fff", color: "var(--color-navy-italy)" }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      aria-label="Excluir"
                      title="Excluir"
                      onClick={() => remove(item.id)}
                      className="h-8 w-8 rounded-full flex items-center justify-center border"
                      style={{ borderColor: "var(--color-soft-gray)", backgroundColor: "#fff", color: "var(--color-red-italy)" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-600">Nenhum registro encontrado.</p>
        )}
      </div>
    </div>
  );
}