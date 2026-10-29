"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getSiteUrl,
  isAuthorizedEmail,
  isAppConfigured,
} from "@/lib/supabase/config";

export type AuthActionState = {
  error?: string;
  message?: string;
};

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAppConfigured()) {
    return { error: "Application authentication is not configured." };
  }
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password", false);
  if (!email || !password || password.length > 128) {
    return { error: "Enter your email and password." };
  }
  if (!isAuthorizedEmail(email)) {
    return { error: "This account is not authorized to use this application." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Unable to sign in with those credentials." };
  }

  const nextPath = safeNextPath(formData.get("next"));
  redirect(nextPath);
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAppConfigured()) {
    return { error: "Application authentication is not configured." };
  }
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password", false);
  const displayName = readString(formData, "displayName").trim();

  if (!email || !isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!isAuthorizedEmail(email)) {
    return { error: "Registration is restricted to the authorized account." };
  }
  if (password.length < 12 || password.length > 128) {
    return { error: "Use a password between 12 and 128 characters." };
  }
  if (displayName.length > 120) {
    return { error: "Keep your display name to 120 characters or fewer." };
  }

  const supabase = await createClient();
  const siteUrl = getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=%2F`,
      data: { display_name: displayName },
    },
  });

  if (error) {
    return { error: "Unable to create the account. Check the details and try again." };
  }
  if (!data.session) {
    return {
      message: "Check your email to confirm your account, then sign in.",
    };
  }
  redirect("/");
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAppConfigured()) {
    return { error: "Application authentication is not configured." };
  }
  const email = readString(formData, "email").toLowerCase();
  if (!email || !isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (isAuthorizedEmail(email)) {
    const supabase = await createClient();
    const siteUrl = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=%2Freset-password`,
    });
    if (error) {
      return { error: `Could not send the recovery email: ${error.message}` };
    }
  }

  return {
    message: "If the address belongs to the authorized account, a recovery link has been sent.",
  };
}

export async function updatePassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAppConfigured()) {
    return { error: "Application authentication is not configured." };
  }
  const password = readString(formData, "password", false);
  const confirmation = readString(formData, "confirmation", false);
  if (password.length < 12 || password.length > 128) {
    return { error: "Use a password between 12 and 128 characters." };
  }
  if (password !== confirmation) {
    return { error: "The passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user || !isAuthorizedEmail(user.email)) {
    return { error: "Your password recovery session is invalid or has expired." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: `Could not update the password: ${error.message}` };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Could not sign out: ${error.message}`);
  }
  redirect("/login");
}

function readString(formData: FormData, key: string, trim = true) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return trim ? value.trim() : value;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function safeNextPath(value: FormDataEntryValue | null) {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
  ) {
    return value;
  }
  return "/";
}
