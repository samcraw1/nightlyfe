import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { getStageMode } from "@/lib/digital-stage/mode";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Staff sign in" };
export const dynamic = "force-dynamic";

export default async function DashboardLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const target = next && /^\/dashboard\/[a-z0-9/-]*$/.test(next) ? next : "/dashboard/digital-stage";

  if (getStageMode() === "demo") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <p className="eyebrow mb-2">Demo mode</p>
        <p className="font-display text-2xl text-bone">No sign-in needed</p>
        <p className="mt-3 text-sm text-muted">Staff authentication turns on automatically once Supabase is configured.</p>
        <Link href={target} className="mt-6 inline-block rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ink">
          Open the dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6">
      <PageHeader eyebrow="Venue staff" title="Sign in" description="Use the account your venue owner created for you." />
      <LoginForm next={target} />
    </div>
  );
}
