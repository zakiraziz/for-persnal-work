import {
  CHARACTER_TYPES,
  type CharacterFieldErrors,
  type CharacterFields,
} from "./types";

const fieldLimits = {
  name: 80,
  personality: 400,
  appearance: 700,
  clothing: 400,
  voiceStyle: 350,
  specialFeatures: 400,
  role: 250,
} as const;

type TextField = keyof typeof fieldLimits;

const textFields: TextField[] = [
  "name",
  "personality",
  "appearance",
  "clothing",
  "voiceStyle",
  "specialFeatures",
  "role",
];

const fieldLabels: Record<TextField, string> = {
  name: "character name",
  personality: "personality",
  appearance: "appearance description",
  clothing: "clothing and accessories",
  voiceStyle: "voice/personality style",
  specialFeatures: "special features",
  role: "character role",
};

export type CharacterValidationResult =
  | { success: true; value: CharacterFields }
  | { success: false; errors: CharacterFieldErrors };

export function validateCharacterFields(
  input: unknown,
): CharacterValidationResult {
  const errors: CharacterFieldErrors = {};
  if (typeof input !== "object" || input === null) {
    return { success: false, errors: { name: "Enter a character name." } };
  }

  const candidate = input as Record<string, unknown>;
  const characterType = CHARACTER_TYPES.find(
    (type) => type === candidate.type,
  );
  if (!characterType) {
    errors.type = "Choose a valid character type.";
  }

  for (const field of textFields) {
    const value = candidate[field];
    if (typeof value !== "string") {
      errors[field] = "Enter a valid value.";
      continue;
    }

    if (field !== "specialFeatures" && !value.trim()) {
      errors[field] = `Add ${fieldLabels[field]}.`;
    } else if (value.length > fieldLimits[field]) {
      errors[field] =
        `Keep this field to ${fieldLimits[field]} characters or fewer.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const text = (field: TextField) => {
    const value = candidate[field];
    if (typeof value !== "string") {
      throw new Error(`Character field "${field}" failed validation.`);
    }
    return value.trim();
  };

  if (!characterType) {
    return {
      success: false,
      errors: { type: "Choose a valid character type." },
    };
  }

  return {
    success: true,
    value: {
      name: text("name"),
      type: characterType,
      personality: text("personality"),
      appearance: text("appearance"),
      clothing: text("clothing"),
      voiceStyle: text("voiceStyle"),
      specialFeatures: text("specialFeatures"),
      role: text("role"),
    },
  };
}
