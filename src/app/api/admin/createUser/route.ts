import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "SERVICE_KEY ausente" }, { status: 500 });
    }
    const body = await req.json().catch(() => ({}));
    const { email, password, role } = body as {
      email?: string;
      password?: string;
      role?: "admin" | "editor" | "viewer";
    };
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const userId = data.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Usuário criado sem id" }, { status: 400 });
    }
    const { error: upErr } = await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, role: role ?? "viewer" }, { onConflict: "user_id" });
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, user_id: userId });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}