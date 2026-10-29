"use client";

import { AlertCircle, LoaderCircle, Sparkles } from "lucide-react";
import {
  STORY_DURATIONS,
  STORY_STYLES,
  type StoryBrief,
  type StoryFieldErrors,
} from "@/lib/story-studio/types";

type StoryBriefFormProps = {
  brief: StoryBrief;
  errors: StoryFieldErrors;
  isGenerating: boolean;
  onBriefChange: <K extends keyof StoryBrief>(
    key: K,
    value: StoryBrief[K],
  ) => void;
  onSubmit: () => void;
};

const fieldClassName =
  "mt-2 w-full rounded-lg border border-white/[0.09] bg-[#0c1322] px-3 py-2.5 text-[12px] text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10";

export function StoryBriefForm({
  brief,
  errors,
  isGenerating,
  onBriefChange,
  onSubmit,
}: StoryBriefFormProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.08]">
          <Sparkles size={16} className="text-violet-200" />
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-slate-100">
            Story brief
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Shape the idea you want to bring to life.
          </p>
        </div>
      </div>

      <form
        className="space-y-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label
            className="text-[11px] font-medium text-slate-300"
            htmlFor="story-topic"
          >
            Story topic or idea <span className="text-violet-300">*</span>
          </label>
          <textarea
            aria-describedby={errors.topic ? "story-topic-error" : undefined}
            aria-invalid={Boolean(errors.topic)}
            autoComplete="off"
            className={`${fieldClassName} min-h-[88px] resize-y`}
            id="story-topic"
            maxLength={500}
            onChange={(event) => onBriefChange("topic", event.target.value)}
            placeholder="What should happen in your story?"
            value={brief.topic}
          />
          {errors.topic && (
            <p
              className="mt-1.5 flex items-center gap-1 text-[10px] text-rose-300"
              id="story-topic-error"
            >
              <AlertCircle size={12} />
              {errors.topic}
            </p>
          )}
          <p className="mt-1 text-right text-[9px] text-slate-600">
            {brief.topic.length}/500
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="text-[11px] font-medium text-slate-300"
              htmlFor="story-style"
            >
              Story style
            </label>
            <select
              className={fieldClassName}
              id="story-style"
              onChange={(event) =>
                onBriefChange(
                  "style",
                  event.target.value as StoryBrief["style"],
                )
              }
              value={brief.style}
            >
              {STORY_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[11px] font-medium text-slate-300"
              htmlFor="story-duration"
            >
              Duration
            </label>
            <select
              className={fieldClassName}
              id="story-duration"
              onChange={(event) =>
                onBriefChange(
                  "duration",
                  event.target.value as StoryBrief["duration"],
                )
              }
              value={brief.duration}
            >
              {STORY_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            className="text-[11px] font-medium text-slate-300"
            htmlFor="story-characters"
          >
            Main characters <span className="text-violet-300">*</span>
          </label>
          <textarea
            aria-describedby={
              errors.characters ? "story-characters-error" : "story-characters-hint"
            }
            aria-invalid={Boolean(errors.characters)}
            className={`${fieldClassName} min-h-[68px] resize-y`}
            id="story-characters"
            maxLength={300}
            onChange={(event) =>
              onBriefChange("characters", event.target.value)
            }
            placeholder="Names and a few words about each character"
            value={brief.characters}
          />
          {errors.characters ? (
            <p
              className="mt-1.5 flex items-center gap-1 text-[10px] text-rose-300"
              id="story-characters-error"
            >
              <AlertCircle size={12} />
              {errors.characters}
            </p>
          ) : (
            <p
              className="mt-1.5 text-[10px] leading-4 text-slate-600"
              id="story-characters-hint"
            >
              Separate characters with commas or describe them in a sentence.
            </p>
          )}
        </div>

        <div>
          <label
            className="text-[11px] font-medium text-slate-300"
            htmlFor="story-language"
          >
            Language
          </label>
          <select
            className={fieldClassName}
            id="story-language"
            onChange={() => onBriefChange("language", "English")}
            value={brief.language}
          >
            <option value="English">English</option>
          </select>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-[12px] font-semibold text-white shadow-lg shadow-violet-950/25 transition hover:from-violet-500 hover:to-violet-400 disabled:cursor-wait disabled:opacity-70"
          disabled={isGenerating}
          type="submit"
        >
          {isGenerating ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              Preparing request…
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Generate Story
            </>
          )}
        </button>
        <p className="text-center text-[10px] leading-4 text-slate-600">
          Demo mode · Generation is unavailable until an AI service is
          connected.
        </p>
      </form>
    </section>
  );
}
