import type { CharacterFields } from "@/lib/character-studio/types";

export function buildCharacterPrompt(character: CharacterFields): string {
  return [
    `CHARACTER REFERENCE: ${character.name}`,
    `Character type: ${character.type}`,
    `Role: ${character.role}`,
    `Personality: ${character.personality}`,
    `Appearance: ${character.appearance}`,
    `Clothing and accessories: ${character.clothing}`,
    `Voice and personality style: ${character.voiceStyle}`,
    `Special features: ${character.specialFeatures || "None specified."}`,
    "",
    "CHARACTER CONSISTENCY INSTRUCTIONS",
    `Keep ${character.name} visually identical in every image and video shot. Preserve the same face, body proportions, colors, markings, clothing, accessories, and distinctive features described above. Do not redesign, age, recolor, or replace any identifying detail between scenes. Keep the character's personality and voice style consistent whenever they speak or act.`,
    "",
    "Use this character reference as-is when placing the character into a new story, scene, image, or video prompt. Add only the scene action, setting, and camera direction after this reference; do not alter the character design.",
  ].join("\n");
}
