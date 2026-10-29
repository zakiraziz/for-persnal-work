import "server-only";
import {
  STORY_DURATIONS,
  STORY_STYLES,
  type CharacterDialogue,
  type StoryBrief,
  type StoryDraft,
  type StoryScene,
} from "@/lib/story-studio/types";
import type { Database } from "@/lib/supabase/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SavedStory = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  brief: StoryBrief;
  draft: StoryDraft;
};

function parseDialogue(value: unknown): CharacterDialogue[] {
  if (!Array.isArray(value)) {
    throw new Error("A saved story contains invalid dialogue data.");
  }
  return value.map((entry) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof entry.character !== "string" ||
      typeof entry.line !== "string"
    ) {
      throw new Error("A saved story contains invalid dialogue data.");
    }
    return { character: entry.character, line: entry.line };
  });
}

function toStoryScene(row: {
  title: string;
  description: string;
}): StoryScene {
  return { title: row.title, description: row.description };
}

export async function listSavedStories(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<SavedStory[]> {
  const { data: stories, error: storyError } = await supabase
    .from("stories")
    .select(
      "id,title,topic,style,duration,characters,language,introduction,narrator_script,dialogue,ending,created_at,updated_at",
    )
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (storyError) {
    throw new Error(`Could not load saved stories: ${storyError.message}`);
  }

  const { data: scenes, error: sceneError } = await supabase
    .from("story_scenes")
    .select("story_id,position,title,description")
    .eq("owner_id", userId)
    .order("position", { ascending: true })
    .limit(1000);

  if (sceneError) {
    throw new Error(`Could not load saved story scenes: ${sceneError.message}`);
  }

  const scenesByStory = new Map<string, StoryScene[]>();
  for (const scene of scenes) {
    const list = scenesByStory.get(scene.story_id) ?? [];
    list.push(toStoryScene(scene));
    scenesByStory.set(scene.story_id, list);
  }

  return stories.map((row) => {
    const style = STORY_STYLES.find((item) => item === row.style);
    const duration = STORY_DURATIONS.find((item) => item === row.duration);
    if (!style || !duration || row.language !== "English") {
      throw new Error(`Saved story "${row.title}" has unsupported brief data.`);
    }

    return {
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      brief: {
        topic: row.topic,
        style,
        duration,
        characters: row.characters,
        language: "English",
      },
      draft: {
        title: row.title,
        introduction: row.introduction,
        narratorScript: row.narrator_script,
        dialogue: parseDialogue(row.dialogue),
        scenes: scenesByStory.get(row.id) ?? [],
        ending: row.ending,
      },
    };
  });
}

export async function saveStoryRecord(
  supabase: SupabaseClient<Database>,
  input: {
    id: string | null;
    brief: StoryBrief;
    draft: StoryDraft;
  },
) {
  const { data, error } = await supabase.rpc("save_story", {
    p_story_id: input.id,
    p_title: input.draft.title.trim(),
    p_topic: input.brief.topic.trim(),
    p_style: input.brief.style,
    p_duration: input.brief.duration,
    p_characters: input.brief.characters.trim(),
    p_language: input.brief.language,
    p_introduction: input.draft.introduction,
    p_narrator_script: input.draft.narratorScript,
    p_dialogue: input.draft.dialogue,
    p_ending: input.draft.ending,
    p_scenes: input.draft.scenes.map((scene, position) => ({
      position,
      title: scene.title,
      description: scene.description,
    })),
  });

  if (error) {
    throw new Error(`Could not save story: ${error.message}`);
  }
  return data;
}

export async function removeSavedStory(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
) {
  const { data, error } = await supabase
    .from("stories")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Could not delete story: ${error.message}`);
  }
  if (!data) {
    throw new Error("Story not found or you do not have permission to delete it.");
  }
}
