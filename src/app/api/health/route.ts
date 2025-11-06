import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function GET() {
  const status: Record<string, any> = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
      GOOGLE_TTS_KEY: !!process.env.GOOGLE_TTS_KEY,
    },
    storage: { bucketExists: null, error: null },
    db: { tableExists: null, error: null },
    clientRLS: { canRead: null, error: null },
  };

  if (!supabaseAdmin) {
    status.db.error = "supabaseAdmin não inicializado (service key ausente)";
    status.storage.error = "supabaseAdmin não inicializado";
    return NextResponse.json(status, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from("audios")
      .list("", { limit: 1 });
    if (error) {
      status.storage.bucketExists = false;
      status.storage.error = error.message;
    } else {
      status.storage.bucketExists = true;
    }
  } catch (e: any) {
    status.storage.bucketExists = false;
    status.storage.error = e?.message ?? String(e);
  }

  try {
    const { error } = await supabaseAdmin
      .from("entrevista")
      .select("id", { count: "exact", head: true });
    if (error) {
      status.db.tableExists = false;
      status.db.error = error.message;
    } else {
      status.db.tableExists = true;
    }
  } catch (e: any) {
    status.db.tableExists = false;
    status.db.error = e?.message ?? String(e);
  }

  try {
    const { error } = await supabase
      .from("entrevista")
      .select("id", { count: "exact", head: true });
    status.clientRLS.canRead = !error;
    status.clientRLS.error = error?.message ?? null;
  } catch (e: any) {
    status.clientRLS.canRead = false;
    status.clientRLS.error = e?.message ?? String(e);
  }

  return NextResponse.json(status);
}