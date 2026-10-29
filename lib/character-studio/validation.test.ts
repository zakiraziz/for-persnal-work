import { describe, expect, it } from "vitest";
import { validateCharacterFields } from "./validation";

const validCharacter = {
  name: "Tiko",
  type: "Animal",
  personality: "Curious and kind",
  appearance: "A tiny green turtle",
  clothing: "A teal scarf",
  voiceStyle: "Gentle and upbeat",
  specialFeatures: "",
  role: "A young explorer",
};

describe("validateCharacterFields", () => {
  it("accepts a complete supported profile with optional special features", () => {
    expect(validateCharacterFields(validCharacter)).toEqual({
      success: true,
      value: validCharacter,
    });
  });

  it("trims text and rejects empty required fields", () => {
    const result = validateCharacterFields({
      ...validCharacter,
      name: "  Tiko ",
      appearance: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.appearance).toBeTruthy();
    }

    const trimmed = validateCharacterFields({
      ...validCharacter,
      name: "  Tiko ",
    });
    expect(trimmed.success).toBe(true);
    if (trimmed.success) expect(trimmed.value.name).toBe("Tiko");
  });

  it("rejects unsupported types and fields over their limits", () => {
    const result = validateCharacterFields({
      ...validCharacter,
      type: "Alien",
      appearance: "x".repeat(701),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.type).toBeTruthy();
      expect(result.errors.appearance).toContain("700");
    }
  });

  it("rejects non-object input", () => {
    expect(validateCharacterFields(null).success).toBe(false);
  });
});
