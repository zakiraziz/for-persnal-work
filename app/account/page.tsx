import Link from "next/link";
import { ProfileForm } from "@/components/auth/profile-form";
import { requireAuthorizedUser } from "@/lib/auth/user";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { supabase, user } = await requireAuthorizedUser();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(`Could not load your profile: ${error.message}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10 sm:px-8">
      <Link
        className="text-xs font-medium text-slate-400 hover:text-white"
        href="/"
      >
        ← Back to studio
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">Account settings</h1>
      <p className="mt-2 text-sm text-slate-400">
        Manage the profile associated with your authorized NoobiToon account.
      </p>
      <div className="mt-6">
        <ProfileForm
          displayName={profile.display_name}
          email={user.email ?? ""}
        />
      </div>
    </main>
  );
}
