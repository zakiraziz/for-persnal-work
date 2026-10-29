"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Clipboard,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { CharacterProfile } from "@/lib/character-studio/types";

type CharacterDetailProps = {
  character: CharacterProfile;
  onBack: () => void;
  onCopy: (prompt: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onEdit: () => void;
  copyStatus: "idle" | "copying" | "copied";
};

const profileFields: {
  key: keyof Pick<
    CharacterProfile,
    | "personality"
    | "appearance"
    | "clothing"
    | "voiceStyle"
    | "specialFeatures"
    | "role"
  >;
  label: string;
}[] = [
  { key: "personality", label: "Personality" },
  { key: "appearance", label: "Appearance description" },
  { key: "clothing", label: "Clothing and accessories" },
  { key: "voiceStyle", label: "Voice/personality style" },
  { key: "specialFeatures", label: "Special features" },
  { key: "role", label: "Character role" },
];

export function CharacterDetail({
  character,
  onBack,
  onCopy,
  onDelete,
  onEdit,
  copyStatus,
}: CharacterDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const prompt = character.prompt;

  return (
    <div className="mx-auto max-w-5xl animate-rise-in">
      <button
        className="mb-5 inline-flex items-center gap-2 text-[11px] font-medium text-slate-400 transition hover:text-white"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={14} />
        Character library
      </button>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface">
        <div className="relative flex flex-col gap-5 overflow-hidden border-b border-white/[0.07] bg-gradient-to-r from-violet-500/[0.10] via-blue-400/[0.04] to-transparent p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/[0.05]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] border border-white/[0.12] bg-[#0c1322]/80 text-[36px] shadow-lg">
              {character.type === "Animal"
                ? "🐢"
                : character.type === "Robot"
                  ? "🤖"
                  : character.type === "Human"
                    ? "🧑"
                    : character.type === "Vegetable"
                      ? "🥕"
                      : character.type === "Fantasy"
                        ? "🪄"
                        : "✨"}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide text-violet-200">
                  {character.type}
                </span>
                <span className="rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[9px] text-slate-400">
                  Saved to database
                </span>
              </div>
              <h2 className="mt-2 truncate text-[22px] font-semibold tracking-[-0.03em] text-white sm:text-[26px]">
                {character.name}
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">
                Created{" "}
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                }).format(new Date(character.createdAt))}
              </p>
            </div>
          </div>
          <div className="relative flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-[10px] font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              onClick={onEdit}
              type="button"
            >
              <Pencil size={13} />
              Edit
            </button>
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-300/15 bg-rose-300/[0.04] px-3 py-2 text-[10px] font-medium text-rose-200 transition hover:bg-rose-300/[0.09]"
              onClick={() => setConfirmDelete((current) => !current)}
              type="button"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>

        {confirmDelete && (
          <div
            className="flex flex-col gap-3 border-b border-rose-300/10 bg-rose-300/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
            role="alert"
          >
            <p className="text-[11px] leading-5 text-rose-100">
              Permanently delete <strong>{character.name}</strong> from your
              character library? This cannot be undone.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                className="rounded-lg border border-white/[0.1] px-3 py-2 text-[10px] text-slate-300 hover:bg-white/[0.05]"
                disabled={isDeleting}
                onClick={() => setConfirmDelete(false)}
                type="button"
              >
                Keep character
              </button>
              <button
                className="rounded-lg bg-rose-500/80 px-3 py-2 text-[10px] font-semibold text-white hover:bg-rose-500 disabled:cursor-wait disabled:opacity-60"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await onDelete();
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                type="button"
              >
                {isDeleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] sm:p-7">
          <section aria-labelledby="profile-heading">
            <div className="mb-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-200">
                Character profile
              </p>
              <h3
                className="mt-1 text-[14px] font-semibold text-slate-100"
                id="profile-heading"
              >
                The details that define {character.name}
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {profileFields.map(({ key, label }) => (
                <div
                  className="rounded-xl border border-white/[0.06] bg-[#0c1322]/65 p-3.5"
                  key={key}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-[11px] leading-5 text-slate-300">
                    {character[key] || "Not specified"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="min-w-0" aria-labelledby="consistency-heading">
            <div className="rounded-2xl border border-emerald-300/[0.13] bg-emerald-300/[0.035] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-300/[0.12] bg-emerald-300/[0.07] text-emerald-200">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                    Reusable character reference
                  </p>
                  <h3
                    className="mt-1 text-[14px] font-semibold text-slate-100"
                    id="consistency-heading"
                  >
                    Character Consistency
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-slate-400">
                Keep these exact character details with every future story,
                image, and video prompt to maintain the same design and
                personality.
              </p>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.07] bg-[#090d18]/65">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
                  <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
                    Character prompt template
                  </span>
                  <span className="text-[8px] text-slate-600">
                    Reusable · text only
                  </span>
                </div>
                <pre className="thin-scrollbar max-h-[360px] overflow-auto whitespace-pre-wrap break-words p-3 text-[10px] leading-5 text-slate-400">
                  {prompt}
                </pre>
              </div>

              <button
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-300/[0.16] bg-emerald-300/[0.06] px-3 py-2.5 text-[10px] font-semibold text-emerald-100 transition hover:bg-emerald-300/[0.1] disabled:cursor-wait disabled:opacity-60"
                disabled={copyStatus === "copying"}
                onClick={() => void onCopy(prompt)}
                type="button"
              >
                {copyStatus === "copied" ? (
                  <Check size={13} />
                ) : (
                  <Clipboard size={13} />
                )}
                {copyStatus === "copying"
                  ? "Copying prompt…"
                  : copyStatus === "copied"
                    ? "Prompt copied"
                    : "Copy Character Prompt"}
              </button>
              <p className="mt-2 text-center text-[9px] leading-4 text-slate-600">
                Template text only. No image or video generation is connected.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
