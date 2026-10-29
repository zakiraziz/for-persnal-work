"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { StoryBriefForm } from "@/components/story-studio/story-brief-form";
import { StoryEditor } from "@/components/story-studio/story-editor";
import { SavedStoryList } from "@/components/story-studio/saved-story-list";
import { DEMO_STORY } from "@/lib/story-studio/demo-story";
import {
  deleteStory as deleteStoryAction,
  saveStory as saveStoryAction,
} from "@/lib/story-studio/actions";
import {
  generateStory,
  StoryGenerationUnavailableError,
} from "@/lib/story-studio/generation";
import type {
  StoryBrief,
  StoryDraft,
  StoryFieldErrors,
} from "@/lib/story-studio/types";
import type { SavedStory } from "@/lib/story-studio/service";

const INITIAL_BRIEF: StoryBrief = {
  topic: "",
  style: "Adventure",
  duration: "1 minute",
  characters: "",
  language: "English",
};

type Feedback = {
  tone: "error" | "success";
  text: string;
};

function validateBrief(brief: StoryBrief): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const topic = brief.topic.trim();
  const characters = brief.characters.trim();

  if (!topic) {
    errors.topic = "Add a story topic or idea to continue.";
  } else if (topic.length < 8) {
    errors.topic = "Add a little more detail (at least 8 characters).";
  }

  if (!characters) {
    errors.characters = "Add at least one main character.";
  }

  return errors;
}

function formatStory(story: StoryDraft): string {
  const dialogue = story.dialogue
    .map((entry) => `${entry.character}: ${entry.line}`)
    .join("\n");
  const scenes = story.scenes
    .map(
      (scene, index) =>
        `Scene ${index + 1}: ${scene.title}\n${scene.description}`,
    )
    .join("\n\n");

  return [
    story.title,
    `Introduction\n${story.introduction}`,
    `Narrator script\n${story.narratorScript}`,
    `Character dialogue\n${dialogue}`,
    `Scene-by-scene breakdown\n${scenes}`,
    `Ending\n${story.ending}`,
  ].join("\n\n");
}

export function StoryStudio({
  initialStories,
}: {
  initialStories: SavedStory[];
}) {
  const [brief, setBrief] = useState<StoryBrief>(INITIAL_BRIEF);
  const [fieldErrors, setFieldErrors] = useState<StoryFieldErrors>({});
  const [story, setStory] = useState<StoryDraft>(DEMO_STORY);
  const [savedStories, setSavedStories] = useState(initialStories);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  function updateBrief<K extends keyof StoryBrief>(
    key: K,
    value: StoryBrief[K],
  ) {
    setBrief((current) => ({ ...current, [key]: value }));
    setFeedback(null);
    setCopyStatus(null);
    if (key === "topic" || key === "characters") {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function handleGenerate() {
    if (isGenerating) return;

    setFeedback(null);
    setCopyStatus(null);
    const errors = validateBrief(brief);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFeedback({
        tone: "error",
        text: "Check the highlighted fields before requesting a story.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedStory = await generateStory(brief);
      setStory(generatedStory);
      setFeedback({
        tone: "success",
        text: "Your story is ready.",
      });
    } catch (error) {
      const message =
        error instanceof StoryGenerationUnavailableError
          ? error.message
          : error instanceof Error
            ? `Story generation failed: ${error.message}`
            : "Story generation failed because of an unexpected error.";
      setFeedback({ tone: "error", text: message });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    setFeedback(null);
    setCopyStatus(null);
    try {
      await navigator.clipboard.writeText(formatStory(story));
      setCopyStatus("Copied story text. AI was not used.");
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "clipboard access was denied";
      setFeedback({
        tone: "error",
        text: `Could not copy the example story: ${reason}`,
      });
    }
  }

  function handleStoryChange(nextStory: StoryDraft) {
    setStory(nextStory);
    setCopyStatus(null);
    setFeedback(null);
  }

  async function handleSave() {
    if (isSaving) return;
    setFeedback(null);
    setCopyStatus(null);
    const errors = validateBrief(brief);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFeedback({
        tone: "error",
        text: "Add a valid topic and at least one character before saving.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveStoryAction(activeStoryId, brief, story);
      if (!result.success || !result.id) {
        setFeedback({
          tone: "error",
          text: result.success ? "The database did not return a story ID." : result.error,
        });
        return;
      }

      const now = new Date().toISOString();
      const previous = savedStories.find(
        (savedStory) => savedStory.id === result.id,
      );
      const savedStory: SavedStory = {
        id: result.id,
        title: story.title.trim(),
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
        brief: { ...brief, topic: brief.topic.trim(), characters: brief.characters.trim() },
        draft: story,
      };
      setActiveStoryId(result.id);
      setSavedStories((current) => [
        savedStory,
        ...current.filter((item) => item.id !== result.id),
      ]);
      setFeedback({ tone: "success", text: "Story saved to your account." });
    } catch (error) {
      setFeedback({
        tone: "error",
        text:
          error instanceof Error
            ? `Could not save the story: ${error.message}`
            : "Could not save the story because of an unexpected error.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSavedStory(id: string) {
    setFeedback(null);
    try {
      const result = await deleteStoryAction(id);
      if (!result.success) {
        setFeedback({ tone: "error", text: result.error });
        return;
      }
      setSavedStories((current) => current.filter((item) => item.id !== id));
      if (activeStoryId === id) setActiveStoryId(null);
      setFeedback({ tone: "success", text: "Saved story deleted." });
    } catch (error) {
      setFeedback({
        tone: "error",
        text:
          error instanceof Error
            ? `Could not delete the story: ${error.message}`
            : "Could not delete the story because of an unexpected error.",
      });
    }
  }

  function handleLoadSavedStory(savedStory: SavedStory) {
    setBrief(savedStory.brief);
    setStory(savedStory.draft);
    setActiveStoryId(savedStory.id);
    setFeedback(null);
    setCopyStatus(null);
    setFieldErrors({});
  }

  function handleNewDraft() {
    setBrief(INITIAL_BRIEF);
    setStory(DEMO_STORY);
    setActiveStoryId(null);
    setFeedback(null);
    setCopyStatus(null);
    setFieldErrors({});
  }

  return (
    <div className="animate-rise-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-300/[0.08]">
              <Sparkles size={13} className="text-violet-200" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200">
              Create &amp; grow
            </span>
          </div>
          <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-white sm:text-[28px]">
            Story Studio
          </h1>
          <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-slate-400">
            Shape a story idea into a script, dialogue, and a scene-by-scene
            outline.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.05] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.11em] text-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          Demo mode · AI not connected
        </span>
      </div>

      {feedback && (
        <div
          aria-live={feedback.tone === "error" ? "assertive" : "polite"}
          className={`mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[11px] leading-5 ${
            feedback.tone === "error"
              ? "border-rose-300/15 bg-rose-300/[0.045] text-rose-200"
              : "border-emerald-300/15 bg-emerald-300/[0.045] text-emerald-200"
          }`}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          {feedback.tone === "error" ? (
            <AlertCircle className="mt-0.5 shrink-0" size={14} />
          ) : (
            <CheckCircle2 className="mt-0.5 shrink-0" size={14} />
          )}
          <p>{feedback.text}</p>
        </div>
      )}

      {copyStatus && (
        <div
          aria-live="polite"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.045] px-4 py-3 text-[11px] leading-5 text-emerald-200"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 shrink-0" size={14} />
          <p>{copyStatus}</p>
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(290px,0.72fr)_minmax(0,1.55fr)]">
        <div className="xl:sticky xl:top-[96px]">
          <StoryBriefForm
            brief={brief}
            errors={fieldErrors}
            isGenerating={isGenerating}
            onBriefChange={updateBrief}
            onSubmit={handleGenerate}
          />
          <SavedStoryList
            activeStoryId={activeStoryId}
            onDelete={handleDeleteSavedStory}
            onLoad={handleLoadSavedStory}
            onNew={handleNewDraft}
            stories={savedStories}
          />
        </div>
        <StoryEditor
          copyStatus={copyStatus}
          isGenerating={isGenerating}
          isSaved={activeStoryId !== null}
          isSaving={isSaving}
          onCopy={handleCopy}
          onRegenerate={handleGenerate}
          onSave={handleSave}
          onStoryChange={handleStoryChange}
          story={story}
        />
      </div>
    </div>
  );
}
