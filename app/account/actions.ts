"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedUser } from "@/lib/auth/user";

export type ProfileActionState = {
  error?: string;
  message?: string;
};

export async function updateProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const displayName = formData.get("displayName");
  if (
    typeof displayName !== "string" ||
    !displayName.trim() ||
    displayName.trim().length > 120
  ) {
    return { error: "Enter a display name up to 120 characters." };
  }

  const { supabase, user } = await requireAuthorizedUser();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName.trim() })
    .eq("id", user.id);

  if (error) {
    return { error: `Could not update your profile: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/account");
  return { message: "Profile updated." };
}
