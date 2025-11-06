import { supabase } from "./supabaseClient";

export type UserRole = "admin" | "editor" | "viewer" | null;

export async function getSession() {
  if (!supabase || !(supabase as any).auth) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getUserRole(): Promise<UserRole> {
  if (!supabase || !(supabase as any).auth) return "admin";
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return "admin";
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single();
    if (!error && data?.role) {
      return data.role as UserRole;
    }
  } catch {}
  return "admin";
}

export async function signOut() {
  if (!supabase || !(supabase as any).auth) return;
  await supabase.auth.signOut();
}
