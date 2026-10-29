import type { StoryBrief, StoryDraft } from "@/lib/story-studio/types";

export class StoryGenerationUnavailableError extends Error {
  constructor() {
    super(
      "Story generation is not connected in demo mode. No AI story was generated.",
    );
    this.name = "StoryGenerationUnavailableError";
  }
}

export async function generateStory(
  _brief: StoryBrief,
): Promise<StoryDraft> {
  throw new StoryGenerationUnavailableError();
}
