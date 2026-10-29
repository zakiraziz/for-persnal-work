"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/lib/auth/actions";

type AuthAction = (
  state: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

type AuthFormProps = {
  action: AuthAction;
  fields: ("displayName" | "email" | "password" | "confirmation" | "next")[];
  initialState?: AuthActionState;
  submitLabel: string;
  nextPath?: string;
};

const fieldMetadata = {
  displayName: { label: "Display name", type: "text", autoComplete: "name" },
  email: { label: "Email address", type: "email", autoComplete: "email" },
  password: {
    label: "Password",
    type: "password",
    autoComplete: "current-password",
  },
  confirmation: {
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
  },
  next: { label: "", type: "hidden", autoComplete: "off" },
} as const;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0c1322] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-violet-400/50";

export function AuthForm({
  action,
  fields,
  initialState = {},
  submitLabel,
  nextPath,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {fields.map((field) => {
        const metadata = fieldMetadata[field];
        if (field === "next") {
          return (
            <input
              key={field}
              name="next"
              type="hidden"
              value={nextPath ?? "/"}
            />
          );
        }

        return (
          <label
            className="block text-xs font-medium text-slate-300"
            htmlFor={`auth-${field}`}
            key={field}
          >
            {metadata.label}
            <input
              autoComplete={
                field === "password" &&
                fields.some(
                  (currentField) =>
                    currentField === "displayName" ||
                    currentField === "confirmation",
                )
                  ? "new-password"
                  : metadata.autoComplete
              }
              className={inputClass}
              id={`auth-${field}`}
              maxLength={field === "displayName" ? 120 : undefined}
              minLength={field === "password" || field === "confirmation" ? 12 : undefined}
              name={field}
              required
              type={metadata.type}
            />
          </label>
        );
      })}

      {state.error && (
        <p
          aria-live="assertive"
          className="rounded-lg border border-rose-300/15 bg-rose-300/[0.05] px-3 py-2.5 text-xs leading-5 text-rose-200"
          role="alert"
        >
          {state.error}
        </p>
      )}
      {state.message && (
        <p
          aria-live="polite"
          className="rounded-lg border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-2.5 text-xs leading-5 text-emerald-200"
          role="status"
        >
          {state.message}
        </p>
      )}

      <button
        className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Please wait…" : submitLabel}
      </button>
    </form>
  );
}
