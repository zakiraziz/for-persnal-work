import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedEmail } from "@/lib/supabase/config";

export async function requireAuthorizedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    throw new Error(`Could not verify the current session: ${error.message}`);
  }
  if (!user || !isAuthorizedEmail(user.email)) {
    redirect("/login");
  }

  return { supabase, user };
}
