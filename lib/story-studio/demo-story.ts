import type { StoryDraft } from "@/lib/story-studio/types";

export const DEMO_STORY: StoryDraft = {
  title: "The Moon’s Missing Button",
  introduction:
    "On the quietest night of the year, a tiny light went missing from the sky. A curious mouse and a very nervous firefly set off to find it.",
  narratorScript:
    "When the moon noticed a button-shaped gap in its coat of stars, it asked the only two creatures still awake for help. Milo packed a crumb for the journey. Dot packed three emergency flashlights, just in case. Together, they followed a trail of silver sparkles over the sleepy rooftops.",
  dialogue: [
    {
      character: "Milo",
      line: "If we find the button, do you think the moon will give us a reward?",
    },
    {
      character: "Dot",
      line: "I hope so. I’ve always wanted a very small trophy.",
    },
  ],
  scenes: [
    {
      title: "A gap in the sky",
      description:
        "Milo spots a loose silver thread dangling from the moon. Dot lights the way with a nervous blink.",
    },
    {
      title: "Across the rooftops",
      description:
        "The friends follow sparkling clues past chimneys, sleepy birds, and one very surprised cat.",
    },
    {
      title: "A little glow",
      description:
        "They discover the missing button tucked beneath a cloud, where it has been warming a family of lost star-moths.",
    },
  ],
  ending:
    "The moon sewed its button back on—and let the star-moths keep the soft cloud as their new home. Milo and Dot headed back just before sunrise, with no trophy at all. But every night after that, one tiny star blinked hello.",
};
