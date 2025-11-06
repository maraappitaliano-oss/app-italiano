"use client";
import React, { useEffect, useState } from "react";
import { supabase, type Entrevista } from "@/lib/supabaseClient";

type Props = {
  reloadSignal?: number;
};

export default function ListaDomande({ reloadSignal }: Props) {
  const [items, setItems] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Entrevista>>({});

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("entrevista")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    }
    setItems(data ?? []);
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

  return (
    <div className="mt-8 w-full max-w-3xl">
      <h2 className="mb-2 text-xl font-semibold">Lista CRUD</h2>
      {loading && (
        <p className="text-sm text-zinc-600">Carregando registros...</p>
      )}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-white p-4 shadow-md border"
          >
            {editingId === item.id ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs">Domanda (IT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2"
                      value={editForm.domanda_it ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, domanda_it: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Domanda (PT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2"
                      value={editForm.domanda_pt ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, domanda_pt: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Risposta (IT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2"
                      value={editForm.risposta_it ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, risposta_it: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs">Risposta (PT)</span>
                    <input
                      className="mt-1 w-full rounded-lg border p-2"
                      value={editForm.risposta_pt ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, risposta_pt: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-white"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="rounded-lg bg-zinc-300 px-3 py-2 text-zinc-900"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p className="text-sm">
                    <span className="font-medium">Domanda IT:</span> {item.domanda_it}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Domanda PT:</span> {item.domanda_pt}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Risposta IT:</span> {item.risposta_it}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Risposta PT:</span> {item.risposta_pt}
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.audio_domanda_url && (
                    <audio controls src={item.audio_domanda_url} />
                  )}
                  {item.audio_risposta_url && (
                    <audio controls src={item.audio_risposta_url} />
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-white"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-white"
                  >
                    🗑️ Excluir
                  </button>
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