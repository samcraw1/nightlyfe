"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { getBrowserSupabase } from "@/lib/supabase/client";

/** Email + password sign-in against Supabase Auth (production mode only). */
export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setError("Email or password is not right.");
      setBusy(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-4 rounded-3xl p-6">
      <label className="block">
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">Email</span>
        <input name="email" type="email" autoComplete="email" required className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone focus:border-gold/50 focus:outline-none" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone focus:border-gold/50 focus:outline-none" />
      </label>
      {error ? <p role="alert" className="text-sm text-blood">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
