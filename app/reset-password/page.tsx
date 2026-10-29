import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { updatePassword } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      description="Choose a new password for your account."
      title="Set a new password"
    >
      <AuthForm
        action={updatePassword}
        fields={["password", "confirmation"]}
        submitLabel="Update password"
      />
      <p className="mt-5 text-center text-xs text-slate-400">
        <Link className="text-violet-200 hover:text-violet-100" href="/login">
          Return to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
