"use server";

import { requireAuthorizedUser } from "@/lib/auth/user";
import {
  insertCharacter,
  removeCharacter,
  updateCharacter,
} from "@/lib/character-studio/service";
import { validateCharacterFields } from "@/lib/character-studio/validation";

export type CharacterActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createCharacter(
  input: unknown,
): Promise<CharacterActionResult<Awaited<ReturnType<typeof insertCharacter>>>> {
  const validation = validateCharacterFields(input);
  if (!validation.success) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError ?? "Check the character details." };
  }

  const { supabase, user } = await requireAuthorizedUser();
  try {
    const character = await insertCharacter(
      supabase,
      user.id,
      validation.value,
    );
    return { success: true, data: character };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not save this character.",
    };
  }
}

export async function editCharacter(
  id: string,
  input: unknown,
): Promise<CharacterActionResult<Awaited<ReturnType<typeof updateCharacter>>>> {
  const validation = validateCharacterFields(input);
  if (!validation.success) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError ?? "Check the character details." };
  }
  if (!isUuid(id)) {
    return { success: false, error: "The character identifier is invalid." };
  }

  const { supabase, user } = await requireAuthorizedUser();
  try {
    const character = await updateCharacter(
      supabase,
      user.id,
      id,
      validation.value,
    );
    return { success: true, data: character };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not update this character.",
    };
  }
}

export async function deleteCharacter(
  id: string,
): Promise<CharacterActionResult> {
  if (!isUuid(id)) {
    return { success: false, error: "The character identifier is invalid." };
  }

  const { supabase, user } = await requireAuthorizedUser();
  try {
    await removeCharacter(supabase, user.id, id);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not delete this character.",
    };
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
