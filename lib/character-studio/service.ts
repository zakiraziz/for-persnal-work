import "server-only";
import { buildCharacterPrompt } from "@/lib/character-studio/prompt-template";
import type {
  CharacterFields,
  CharacterProfile,
} from "@/lib/character-studio/types";
import type { Database } from "@/lib/supabase/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

type CharacterRow = {
  id: string;
  name: string;
  character_type: CharacterFields["type"];
  personality: string;
  appearance: string;
  clothing: string;
  voice_style: string;
  special_features: string;
  role: string;
  prompt: string;
  created_at: string;
};

function toProfile(row: CharacterRow): CharacterProfile {
  const fields: CharacterFields = {
    name: row.name,
    type: row.character_type,
    personality: row.personality,
    appearance: row.appearance,
    clothing: row.clothing,
    voiceStyle: row.voice_style,
    specialFeatures: row.special_features,
    role: row.role,
  };

  return {
    ...fields,
    id: row.id,
    createdAt: row.created_at,
    prompt: row.prompt,
  };
}

export async function listCharacters(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("characters")
    .select(
      "id,name,character_type,personality,appearance,clothing,voice_style,special_features,role,prompt,created_at",
    )
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load characters: ${error.message}`);
  }

  return data.map((row) => toProfile(row));
}

export async function insertCharacter(
  supabase: SupabaseClient<Database>,
  userId: string,
  fields: CharacterFields,
) {
  const { data, error } = await supabase
    .from("characters")
    .insert({
      owner_id: userId,
      name: fields.name,
      character_type: fields.type,
      personality: fields.personality,
      appearance: fields.appearance,
      clothing: fields.clothing,
      voice_style: fields.voiceStyle,
      special_features: fields.specialFeatures,
      role: fields.role,
      prompt: buildCharacterPrompt(fields),
    })
    .select(
      "id,name,character_type,personality,appearance,clothing,voice_style,special_features,role,prompt,created_at",
    )
    .single();

  if (error) {
    throw new Error(`Could not save character: ${error.message}`);
  }

  return toProfile(data);
}

export async function updateCharacter(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
  fields: CharacterFields,
) {
  const { data, error } = await supabase
    .from("characters")
    .update({
      name: fields.name,
      character_type: fields.type,
      personality: fields.personality,
      appearance: fields.appearance,
      clothing: fields.clothing,
      voice_style: fields.voiceStyle,
      special_features: fields.specialFeatures,
      role: fields.role,
      prompt: buildCharacterPrompt(fields),
    })
    .eq("id", id)
    .eq("owner_id", userId)
    .select(
      "id,name,character_type,personality,appearance,clothing,voice_style,special_features,role,prompt,created_at",
    )
    .maybeSingle();

  if (error) {
    throw new Error(`Could not update character: ${error.message}`);
  }
  if (!data) {
    throw new Error("Character not found or you do not have permission to edit it.");
  }

  return toProfile(data);
}

export async function removeCharacter(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
) {
  const { data, error } = await supabase
    .from("characters")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Could not delete character: ${error.message}`);
  }
  if (!data) {
    throw new Error("Character not found or you do not have permission to delete it.");
  }
}
