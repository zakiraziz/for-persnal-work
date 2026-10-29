import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { signIn } from "@/lib/auth/actions";
import { isAppConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath =
    typeof params.next === "string" &&
    params.next.startsWith("/") &&
    !params.next.startsWith("//")
      ? params.next
      : "/";

  return (
    <AuthCard
      description="Sign in to your private creator workspace."
      title="Welcome back"
    >
      {!isAppConfigured() && (
        <p
          className="mb-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5 text-xs leading-5 text-amber-100"
          role="status"
        >
          Authentication is not configured. Set the Supabase environment
          variables, run the database migration, and add your authorized email.
        </p>
      )}
      {params.unauthorized === "1" && (
        <p className="mb-4 rounded-lg border border-rose-300/15 bg-rose-300/[0.05] px-3 py-2.5 text-xs text-rose-200">
          This account is not authorized to use this application.
        </p>
      )}
      {params.recovery === "expired" && (
        <p className="mb-4 rounded-lg border border-rose-300/15 bg-rose-300/[0.05] px-3 py-2.5 text-xs text-rose-200">
          That recovery link is invalid or expired. Request a new one.
        </p>
      )}
      {params.recovery === "invalid" && (
        <p className="mb-4 rounded-lg border border-rose-300/15 bg-rose-300/[0.05] px-3 py-2.5 text-xs text-rose-200">
          The recovery link did not contain a valid authorization code.
        </p>
      )}
      <AuthForm
        action={signIn}
        fields={["email", "password", "next"]}
        nextPath={nextPath}
        submitLabel="Sign in"
      />
      <div className="mt-5 flex justify-between text-xs text-slate-400">
        <Link className="hover:text-violet-200" href="/forgot-password">
          Forgot password?
        </Link>
        <Link className="hover:text-violet-200" href="/register">
          Create account
        </Link>
      </div>
    </AuthCard>
  );
}
