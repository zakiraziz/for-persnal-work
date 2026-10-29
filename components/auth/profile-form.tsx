"use client";

import { useActionState } from "react";
import { signOut } from "@/lib/auth/actions";
import { updateProfile } from "@/app/account/actions";

export function ProfileForm({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, {});

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-surface p-5 sm:p-7">
      <h2 className="text-sm font-semibold text-slate-100">Profile details</h2>
      <p className="mt-1 text-xs text-slate-500">
        This information is stored in your private profile.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <label
          className="block text-xs font-medium text-slate-300"
          htmlFor="profile-email"
        >
          Authorized email
          <input
            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0c1322] px-3 py-2.5 text-sm text-slate-400"
            id="profile-email"
            readOnly
            value={email}
          />
        </label>
        <label
          className="block text-xs font-medium text-slate-300"
          htmlFor="profile-name"
        >
          Display name
          <input
            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0c1322] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-violet-400/50"
            defaultValue={displayName}
            id="profile-name"
            maxLength={120}
            name="displayName"
            required
          />
        </label>
        {state.error && (
          <p className="text-xs text-rose-200" role="alert">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="text-xs text-emerald-200" role="status">
            {state.message}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
      <form action={signOut} className="mt-5 border-t border-white/[0.07] pt-5">
        <button
          className="rounded-lg border border-rose-300/15 px-4 py-2.5 text-xs font-medium text-rose-200 hover:bg-rose-300/[0.05]"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </section>
  );
}
