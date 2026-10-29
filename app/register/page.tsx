import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { signUp } from "@/lib/auth/actions";
import { isAppConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <AuthCard
      description="Create an account for the authorized personal workspace."
      title="Create your account"
    >
      {!isAppConfigured() && (
        <p className="mb-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5 text-xs leading-5 text-amber-100">
          Supabase is not configured yet. Add the required environment variables
          before registering.
        </p>
      )}
      <AuthForm
        action={signUp}
        fields={["displayName", "email", "password"]}
        submitLabel="Register"
      />
      <p className="mt-5 text-center text-xs text-slate-400">
        Already registered?{" "}
        <Link className="text-violet-200 hover:text-violet-100" href="/login">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
