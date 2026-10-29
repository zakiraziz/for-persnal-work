export const CHARACTER_TYPES = [
  "Human",
  "Animal",
  "Robot",
  "Vegetable",
  "Fantasy",
  "Other",
] as const;

export type CharacterType = (typeof CHARACTER_TYPES)[number];

export type CharacterFields = {
  name: string;
  type: CharacterType;
  personality: string;
  appearance: string;
  clothing: string;
  voiceStyle: string;
  specialFeatures: string;
  role: string;
};

export type CharacterProfile = CharacterFields & {
  id: string;
  createdAt: string;
  prompt: string;
};

export type CharacterFieldErrors = Partial<
  Record<
    | "type"
    | "name"
    | "personality"
    | "appearance"
    | "clothing"
    | "voiceStyle"
    | "specialFeatures"
    | "role",
    string
  >
>;
