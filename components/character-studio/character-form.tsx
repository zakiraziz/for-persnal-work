"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, LoaderCircle, Save, X } from "lucide-react";
import {
  CHARACTER_TYPES,
  type CharacterFieldErrors,
  type CharacterFields,
} from "@/lib/character-studio/types";
import { validateCharacterFields } from "@/lib/character-studio/validation";

type CharacterFormProps = {
  initialValue: CharacterFields;
  isEditing: boolean;
  onCancel: () => void;
  onSave: (value: CharacterFields) => Promise<void>;
};

type TextField = Exclude<keyof CharacterFields, "type">;

const fieldClassName =
  "mt-2 w-full rounded-lg border border-white/[0.09] bg-[#0c1322] px-3 py-2.5 text-[12px] leading-5 text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10";

const fields: {
  key: TextField;
  label: string;
  hint: string;
  required: boolean;
  multiline?: boolean;
  maxLength: number;
}[] = [
  {
    key: "personality",
    label: "Personality",
    hint: "How do they think, feel, and behave?",
    required: true,
    multiline: true,
    maxLength: 400,
  },
  {
    key: "appearance",
    label: "Appearance description",
    hint: "Describe the details that should stay visually consistent.",
    required: true,
    multiline: true,
    maxLength: 700,
  },
  {
    key: "clothing",
    label: "Clothing and accessories",
    hint: "Outfit, colors, materials, and signature accessories.",
    required: true,
    maxLength: 400,
  },
  {
    key: "voiceStyle",
    label: "Voice/personality style",
    hint: "Voice tone, pacing, and how the character speaks.",
    required: true,
    maxLength: 350,
  },
  {
    key: "specialFeatures",
    label: "Special features",
    hint: "Distinctive markings, props, abilities, or leave blank.",
    required: false,
    maxLength: 400,
  },
  {
    key: "role",
    label: "Character role",
    hint: "What do they do in the story?",
    required: true,
    maxLength: 250,
  },
];

export function CharacterForm({
  initialValue,
  isEditing,
  onCancel,
  onSave,
}: CharacterFormProps) {
  const [value, setValue] = useState<CharacterFields>(initialValue);
  const [errors, setErrors] = useState<CharacterFieldErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField<K extends keyof CharacterFields>(
    key: K,
    nextValue: CharacterFields[K],
  ) {
    setValue((current) => ({ ...current, [key]: nextValue }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaveError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateCharacterFields(value);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSaveError(null);

    setIsSaving(true);
    try {
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });
      await onSave(validation.value);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "The character could not be updated. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/[0.08] bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200">
            {isEditing ? "Refine your character" : "Build a new character"}
          </p>
          <h2 className="mt-1 text-[16px] font-semibold text-slate-100">
            {isEditing ? "Edit character" : "Character details"}
          </h2>
        </div>
        <button
          aria-label="Cancel and return to character library"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          disabled={isSaving}
          onClick={onCancel}
          type="button"
        >
          <X size={17} />
        </button>
      </div>

      <form className="space-y-5 p-5 sm:p-6" onSubmit={handleSubmit} noValidate>
        {saveError && (
          <div
            className="flex items-start gap-2 rounded-xl border border-rose-300/15 bg-rose-300/[0.045] px-4 py-3 text-[11px] leading-5 text-rose-200"
            role="alert"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={14} />
            <p>{saveError}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="text-[11px] font-medium text-slate-300"
              htmlFor="character-name"
            >
              Character name <span className="text-violet-300">*</span>
            </label>
            <input
              aria-invalid={Boolean(errors.name)}
              className={fieldClassName}
              id="character-name"
              maxLength={80}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. Tiko"
              value={value.name}
            />
            {errors.name && <FieldError message={errors.name} />}
          </div>
          <div>
            <label
              className="text-[11px] font-medium text-slate-300"
              htmlFor="character-type"
            >
              Character type <span className="text-violet-300">*</span>
            </label>
            <select
              aria-describedby={errors.type ? "character-type-error" : undefined}
              aria-invalid={Boolean(errors.type)}
              className={fieldClassName}
              id="character-type"
              onChange={(event) => {
                const nextType = CHARACTER_TYPES.find(
                  (type) => type === event.target.value,
                );
                if (nextType) updateField("type", nextType);
              }}
              value={value.type}
            >
              {CHARACTER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <FieldError id="character-type-error" message={errors.type} />
            )}
          </div>
        </div>

        {fields.map((field) => {
          const error = errors[field.key];
          const id = `character-${field.key}`;
          return (
            <div key={field.key}>
              <label
                className="text-[11px] font-medium text-slate-300"
                htmlFor={id}
              >
                {field.label}
                {field.required && (
                  <span className="text-violet-300"> *</span>
                )}
              </label>
              {field.multiline ? (
                <textarea
                  aria-describedby={error ? `${id}-error` : undefined}
                  aria-invalid={Boolean(error)}
                  className={`${fieldClassName} min-h-[76px] resize-y`}
                  id={id}
                  maxLength={field.maxLength}
                  onChange={(event) =>
                    updateField(field.key, event.target.value)
                  }
                  placeholder={field.hint}
                  value={value[field.key]}
                />
              ) : (
                <input
                  aria-describedby={error ? `${id}-error` : undefined}
                  aria-invalid={Boolean(error)}
                  className={fieldClassName}
                  id={id}
                  maxLength={field.maxLength}
                  onChange={(event) =>
                    updateField(field.key, event.target.value)
                  }
                  placeholder={field.hint}
                  value={value[field.key]}
                />
              )}
              {error && <FieldError id={`${id}-error`} message={error} />}
            </div>
          );
        })}

        <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
          <button
            className="rounded-lg border border-white/[0.09] px-4 py-2.5 text-[11px] font-medium text-slate-300 transition hover:bg-white/[0.04] disabled:opacity-60"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-[11px] font-semibold text-white shadow-lg shadow-violet-950/25 transition hover:from-violet-500 hover:to-violet-400 disabled:cursor-wait disabled:opacity-70"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="animate-spin" size={14} />
                Updating session…
              </>
            ) : (
              <>
                <Save size={14} />
                {isEditing ? "Update Character" : "Create Character"}
              </>
            )}
          </button>
        </div>
        <p className="text-center text-[10px] leading-4 text-slate-600">
          Changes are held in this page session only and are not saved to a
          database.
        </p>
      </form>
    </section>
  );
}

function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p
      className="mt-1.5 flex items-center gap-1 text-[10px] text-rose-300"
      id={id}
    >
      <AlertCircle size={12} />
      {message}
    </p>
  );
}
