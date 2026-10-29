import { describe, expect, it } from "vitest";
import { buildCharacterPrompt } from "./prompt-template";

describe("buildCharacterPrompt", () => {
  it("includes the profile details and reusable consistency instructions", () => {
    const prompt = buildCharacterPrompt({
      name: "Tiko",
      type: "Animal",
      personality: "Curious and kind",
      appearance: "A tiny green turtle",
      clothing: "A teal scarf",
      voiceStyle: "Gentle and upbeat",
      specialFeatures: "An amber star on the shell",
      role: "A young explorer",
    });

    expect(prompt).toContain("CHARACTER REFERENCE: Tiko");
    expect(prompt).toContain("Appearance: A tiny green turtle");
    expect(prompt).toContain("Special features: An amber star on the shell");
    expect(prompt).toContain("CHARACTER CONSISTENCY INSTRUCTIONS");
    expect(prompt).toContain("Use this character reference as-is");
  });

  it("describes empty optional features without inventing details", () => {
    const prompt = buildCharacterPrompt({
      name: "Tiko",
      type: "Animal",
      personality: "Curious",
      appearance: "A turtle",
      clothing: "A scarf",
      voiceStyle: "Gentle",
      specialFeatures: "",
      role: "Explorer",
    });

    expect(prompt).toContain("Special features: None specified.");
  });
});
