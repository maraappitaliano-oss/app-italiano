import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "SERVICE_KEY ausente" }, { status: 500 });
    }
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ error: "Parâmetro user_id é obrigatório" }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("user_id", user_id)
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ role: data?.role ?? null });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}