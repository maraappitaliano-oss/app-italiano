import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "SERVICE_KEY ausente" }, { status: 500 });
    }
    const body = await req.json().catch(() => ({}));
    const { email, role } = body as {
      email?: string;
      role?: "admin" | "editor" | "viewer";
    };

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email e role são obrigatórios" },
        { status: 400 }
      );
    }

    // Encontrar usuário por email
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) {
      return NextResponse.json({ error: listErr.message }, { status: 400 });
    }

    const user = usersData.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user?.id) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const userId = user.id as string;
    const { error: upErr } = await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, role }, { onConflict: "user_id" });
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user_id: userId, role });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}