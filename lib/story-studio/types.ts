export const STORY_STYLES = [
  "Comedy",
  "Mystery",
  "Adventure",
  "Fantasy",
] as const;

export const STORY_DURATIONS = [
  "40 seconds",
  "1 minute",
  "3 minutes",
  "5 minutes",
] as const;

export type StoryStyle = (typeof STORY_STYLES)[number];
export type StoryDuration = (typeof STORY_DURATIONS)[number];

export type StoryBrief = {
  topic: string;
  style: StoryStyle;
  duration: StoryDuration;
  characters: string;
  language: "English";
};

export type CharacterDialogue = {
  character: string;
  line: string;
};

export type StoryScene = {
  title: string;
  description: string;
};

export type StoryDraft = {
  title: string;
  introduction: string;
  narratorScript: string;
  dialogue: CharacterDialogue[];
  scenes: StoryScene[];
  ending: string;
};

export type StoryFieldErrors = Partial<
  Record<"topic" | "characters", string>
>;
