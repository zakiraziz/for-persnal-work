"use client";

import {
  BookOpenText,
  Check,
  Clipboard,
  Clapperboard,
  LoaderCircle,
  RotateCcw,
  Save,
  ScrollText,
} from "lucide-react";
import type { StoryDraft } from "@/lib/story-studio/types";

type StoryEditorProps = {
  story: StoryDraft;
  isGenerating: boolean;
  isSaving: boolean;
  isSaved: boolean;
  copyStatus: string | null;
  onStoryChange: (story: StoryDraft) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onSave: () => void;
};

const editorClassName =
  "mt-2 w-full resize-y rounded-lg border border-white/[0.07] bg-[#0c1322]/80 px-3 py-2.5 text-[12px] leading-5 text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10";

function SectionHeading({
  icon: Icon,
  title,
  number,
}: {
  icon: typeof BookOpenText;
  title: string;
  number?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04] text-violet-300">
        <Icon size={13} />
      </span>
      <h3 className="text-[11px] font-semibold text-slate-200">{title}</h3>
      {number && (
        <span className="ml-auto text-[9px] font-medium uppercase tracking-wide text-slate-600">
          {number}
        </span>
      )}
    </div>
  );
}

export function StoryEditor({
  story,
  isGenerating,
  isSaving,
  isSaved,
  copyStatus,
  onStoryChange,
  onCopy,
  onRegenerate,
  onSave,
}: StoryEditorProps) {
  function updateStory<K extends keyof StoryDraft>(
    key: K,
    value: StoryDraft[K],
  ) {
    onStoryChange({ ...story, [key]: value });
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-surface">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-300/[0.08]">
            <ScrollText size={16} className="text-blue-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[14px] font-semibold text-slate-100">
                Story editor
              </h2>
              <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.12em] text-amber-200">
                {isSaved ? "Saved to database" : "Unsaved draft"}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              Editable draft · AI generation is not connected
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-2 text-[10px] font-medium text-emerald-100 transition hover:bg-emerald-300/[0.09] disabled:cursor-wait disabled:opacity-60 sm:flex-none"
            disabled={isSaving}
            onClick={onSave}
            type="button"
          >
            {isSaving ? (
              <LoaderCircle className="animate-spin" size={13} />
            ) : (
              <Save size={13} />
            )}
            {isSaving ? "Saving…" : isSaved ? "Save changes" : "Save story"}
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-[10px] font-medium text-slate-300 transition hover:border-white/[0.16] hover:bg-white/[0.06] disabled:cursor-wait disabled:opacity-60 sm:flex-none"
            disabled={isGenerating}
            onClick={onCopy}
            type="button"
          >
            {copyStatus ? <Check size={13} /> : <Clipboard size={13} />}
            Copy Story
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-300/15 bg-violet-300/[0.06] px-3 py-2 text-[10px] font-medium text-violet-200 transition hover:border-violet-300/25 hover:bg-violet-300/[0.1] disabled:cursor-wait disabled:opacity-60 sm:flex-none"
            disabled={isGenerating}
            onClick={onRegenerate}
            type="button"
          >
            <RotateCcw
              size={13}
              className={isGenerating ? "animate-spin" : ""}
            />
            Regenerate
          </button>
        </div>
      </div>

      <div className="border-b border-white/[0.05] bg-violet-400/[0.025] px-5 py-3 sm:px-6">
        <p className="text-[10px] leading-5 text-slate-400">
          The starter story is editable sample content. AI generation is not
          connected; saving stores your current version in your private account.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500"
            htmlFor="draft-title"
          >
            Story title
          </label>
          <input
            className="mt-2 w-full border-0 border-b border-white/[0.08] bg-transparent pb-3 text-[20px] font-semibold tracking-[-0.03em] text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 sm:text-[23px]"
            id="draft-title"
            maxLength={120}
            onChange={(event) => updateStory("title", event.target.value)}
            value={story.title}
          />
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0c1322]/60 p-4">
          <SectionHeading icon={BookOpenText} title="Short introduction" />
          <textarea
            aria-label="Short introduction"
            className={`${editorClassName} min-h-[72px]`}
            maxLength={1000}
            onChange={(event) =>
              updateStory("introduction", event.target.value)
            }
            value={story.introduction}
          />
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0c1322]/60 p-4">
          <SectionHeading icon={ScrollText} title="Narrator script" />
          <textarea
            aria-label="Narrator script"
            className={`${editorClassName} min-h-[124px]`}
            maxLength={5000}
            onChange={(event) =>
              updateStory("narratorScript", event.target.value)
            }
            value={story.narratorScript}
          />
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0c1322]/60 p-4">
          <SectionHeading icon={BookOpenText} title="Character dialogue" />
          <div className="mt-3 space-y-3">
            {story.dialogue.map((entry, index) => (
              <div
                className="grid gap-2 sm:grid-cols-[112px_minmax(0,1fr)]"
                key={`${entry.character}-${index}`}
              >
                <input
                  aria-label={`Dialogue character ${index + 1}`}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2 text-[10px] font-semibold text-violet-200 outline-none focus:border-violet-400/40"
                  maxLength={60}
                  onChange={(event) => {
                    const dialogue = [...story.dialogue];
                    dialogue[index] = {
                      ...entry,
                      character: event.target.value,
                    };
                    updateStory("dialogue", dialogue);
                  }}
                  value={entry.character}
                />
                <textarea
                  aria-label={`Dialogue line ${index + 1}`}
                  className="min-h-10 resize-y rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2 text-[11px] leading-5 text-slate-300 outline-none focus:border-violet-400/40"
                  maxLength={500}
                  onChange={(event) => {
                    const dialogue = [...story.dialogue];
                    dialogue[index] = { ...entry, line: event.target.value };
                    updateStory("dialogue", dialogue);
                  }}
                  value={entry.line}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0c1322]/60 p-4">
          <SectionHeading
            icon={Clapperboard}
            number={`${story.scenes.length} scenes`}
            title="Scene-by-scene breakdown"
          />
          <div className="mt-3 space-y-3">
            {story.scenes.map((scene, index) => (
              <article
                className="flex gap-3 rounded-lg border border-white/[0.05] bg-white/[0.015] p-3"
                key={`${scene.title}-${index}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-400/[0.09] text-[9px] font-semibold text-violet-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <input
                    aria-label={`Scene ${index + 1} title`}
                    className="w-full bg-transparent text-[11px] font-semibold text-slate-200 outline-none placeholder:text-slate-600 focus:text-white"
                    maxLength={100}
                    onChange={(event) => {
                      const scenes = [...story.scenes];
                      scenes[index] = { ...scene, title: event.target.value };
                      updateStory("scenes", scenes);
                    }}
                    value={scene.title}
                  />
                  <textarea
                    aria-label={`Scene ${index + 1} description`}
                    className="mt-1.5 min-h-12 w-full resize-y bg-transparent text-[10px] leading-5 text-slate-400 outline-none placeholder:text-slate-600 focus:text-slate-300"
                    maxLength={600}
                    onChange={(event) => {
                      const scenes = [...story.scenes];
                      scenes[index] = {
                        ...scene,
                        description: event.target.value,
                      };
                      updateStory("scenes", scenes);
                    }}
                    value={scene.description}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-300/[0.10] bg-emerald-300/[0.025] p-4">
          <SectionHeading icon={Check} title="Ending" />
          <textarea
            aria-label="Story ending"
            className={`${editorClassName} min-h-[80px] border-emerald-300/[0.08]`}
            maxLength={2000}
            onChange={(event) => updateStory("ending", event.target.value)}
            value={story.ending}
          />
        </div>
      </div>
    </section>
  );
}
