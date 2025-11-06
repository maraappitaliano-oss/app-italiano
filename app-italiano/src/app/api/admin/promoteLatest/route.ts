import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "SERVICE_KEY ausente" }, { status: 500 });
    }
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200, page: 1 });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const users = data?.users ?? [];
    if (!users.length) {
      return NextResponse.json({ error: "Nenhum usuário encontrado" }, { status: 404 });
    }
    // escolhe pelo último login ou criação mais recente
    const sorted = users.sort((a: any, b: any) => {
      const la = new Date(a.last_sign_in_at || a.created_at || 0).getTime();
      const lb = new Date(b.last_sign_in_at || b.created_at || 0).getTime();
      return lb - la;
    });
    const user = sorted[0];
    const userId = user.id as string;
    const { error: upErr } = await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id" });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });
    return NextResponse.json({ ok: true, user_id: userId, role: "admin" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}