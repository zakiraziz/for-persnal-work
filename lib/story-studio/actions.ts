"use server";

import { requireAuthorizedUser } from "@/lib/auth/user";
import {
  removeSavedStory,
  saveStoryRecord,
} from "@/lib/story-studio/service";
import {
  STORY_DURATIONS,
  STORY_STYLES,
  type StoryBrief,
  type StoryDraft,
} from "@/lib/story-studio/types";

type StoryMutationResult =
  | { success: true; id?: string }
  | { success: false; error: string };

export async function saveStory(
  id: string | null,
  brief: unknown,
  draft: unknown,
): Promise<StoryMutationResult> {
  const parsed = validateStory(brief, draft);
  if (!parsed) {
    return {
      success: false,
      error: "Check the story details. The title, topic, characters, and scenes must be valid.",
    };
  }
  if (id !== null && !isUuid(id)) {
    return { success: false, error: "The story identifier is invalid." };
  }

  const { supabase } = await requireAuthorizedUser();
  try {
    const savedId = await saveStoryRecord(supabase, {
      id,
      brief: parsed.brief,
      draft: parsed.draft,
    });
    return { success: true, id: savedId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Could not save this story.",
    };
  }
}

export async function deleteStory(id: string): Promise<StoryMutationResult> {
  if (!isUuid(id)) {
    return { success: false, error: "The story identifier is invalid." };
  }

  const { supabase, user } = await requireAuthorizedUser();
  try {
    await removeSavedStory(supabase, user.id, id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Could not delete this story.",
    };
  }
}

function validateStory(
  brief: unknown,
  draft: unknown,
): { brief: StoryBrief; draft: StoryDraft } | null {
  if (!isRecord(brief) || !isRecord(draft)) return null;
  const style = STORY_STYLES.find((item) => item === brief.style);
  const duration = STORY_DURATIONS.find((item) => item === brief.duration);
  const dialogue = parseDialogue(draft.dialogue);
  const scenes = parseScenes(draft.scenes);
  if (
    typeof brief.topic !== "string" ||
    brief.topic.trim().length < 8 ||
    brief.topic.length > 500 ||
    typeof brief.characters !== "string" ||
    !brief.characters.trim() ||
    brief.characters.length > 300 ||
    !style ||
    !duration ||
    brief.language !== "English" ||
    typeof draft.title !== "string" ||
    !draft.title.trim() ||
    draft.title.length > 200 ||
    typeof draft.introduction !== "string" ||
    draft.introduction.length > 10000 ||
    typeof draft.narratorScript !== "string" ||
    draft.narratorScript.length > 30000 ||
    typeof draft.ending !== "string" ||
    draft.ending.length > 10000 ||
    !dialogue ||
    !scenes
  ) {
    return null;
  }

  return {
    brief: {
      topic: brief.topic.trim(),
      style,
      duration,
      characters: brief.characters.trim(),
      language: "English",
    },
    draft: {
      title: draft.title.trim(),
      introduction: draft.introduction,
      narratorScript: draft.narratorScript,
      dialogue,
      scenes,
      ending: draft.ending,
    },
  };
}

function parseDialogue(value: unknown): StoryDraft["dialogue"] | null {
  if (!Array.isArray(value) || value.length > 200) return null;
  const dialogue: StoryDraft["dialogue"] = [];
  for (const entry of value) {
    if (
      !isRecord(entry) ||
      typeof entry.character !== "string" ||
      entry.character.length > 100 ||
      typeof entry.line !== "string" ||
      entry.line.length > 2000
    ) {
      return null;
    }
    dialogue.push({ character: entry.character, line: entry.line });
  }
  return dialogue;
}

function parseScenes(value: unknown): StoryDraft["scenes"] | null {
  if (!Array.isArray(value) || value.length > 100) return null;
  const scenes: StoryDraft["scenes"] = [];
  for (const scene of value) {
    if (
      !isRecord(scene) ||
      typeof scene.title !== "string" ||
      scene.title.length > 200 ||
      typeof scene.description !== "string" ||
      scene.description.length > 5000
    ) {
      return null;
    }
    scenes.push({ title: scene.title, description: scene.description });
  }
  return scenes;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
