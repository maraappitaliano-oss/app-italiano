"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const session = await getSession();
      router.replace(session ? "/dashboard" : "/login");
    })();
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-ice-white)" }}>
      <p className="text-sm" style={{ color: "var(--color-navy-italy)" }}>Carregando...</p>
    </div>
  );
}