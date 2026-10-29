import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { requestPasswordReset } from "@/lib/auth/actions";
import { isAppConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      description="We will send a recovery link if this is the authorized account."
      title="Reset your password"
    >
      {!isAppConfigured() && (
        <p className="mb-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5 text-xs leading-5 text-amber-100">
          Authentication is not configured yet. Add the required environment
          variables before requesting recovery.
        </p>
      )}
      <AuthForm
        action={requestPasswordReset}
        fields={["email"]}
        submitLabel="Send recovery link"
      />
      <p className="mt-5 text-center text-xs text-slate-400">
        <Link className="text-violet-200 hover:text-violet-100" href="/login">
          Return to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
