"use client";

import { useState } from "react";
import { Check, FileText, Plus, Trash2 } from "lucide-react";
import type { SavedStory } from "@/lib/story-studio/service";

type SavedStoryListProps = {
  activeStoryId: string | null;
  stories: SavedStory[];
  onDelete: (id: string) => Promise<void>;
  onLoad: (story: SavedStory) => void;
  onNew: () => void;
};

export function SavedStoryList({
  activeStoryId,
  stories,
  onDelete,
  onLoad,
  onNew,
}: SavedStoryListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteStory(id: string) {
    setDeletingId(id);
    try {
      await onDelete(id);
      setConfirmingId(null);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-white/[0.08] bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-100">
            Saved stories
          </h2>
          <p className="mt-1 text-[10px] text-slate-500">
            Private to your account · {stories.length} saved
          </p>
        </div>
        <button
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.09] px-2.5 py-2 text-[10px] font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          onClick={onNew}
          type="button"
        >
          <Plus size={13} />
          New draft
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-center">
          <FileText className="mx-auto text-slate-500" size={18} />
          <p className="mt-2 text-[11px] font-medium text-slate-300">
            No saved stories yet
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            Save an editable story to keep it in your account.
          </p>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {stories.map((story) => (
            <li
              className={`rounded-xl border p-3 ${
                activeStoryId === story.id
                  ? "border-violet-300/20 bg-violet-300/[0.04]"
                  : "border-white/[0.06] bg-[#0c1322]/45"
              }`}
              key={story.id}
            >
              <div className="flex items-start gap-2">
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onLoad(story)}
                  type="button"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                    <span className="truncate">{story.title}</span>
                    {activeStoryId === story.id && (
                      <Check
                        aria-label="Currently open"
                        className="shrink-0 text-violet-200"
                        size={12}
                      />
                    )}
                  </span>
                  <span className="mt-1 block text-[9px] text-slate-500">
                    Updated{" "}
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(story.updatedAt))}
                  </span>
                </button>
                <button
                  aria-label={`Delete ${story.title}`}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-rose-300/[0.06] hover:text-rose-200"
                  onClick={() => setConfirmingId(story.id)}
                  type="button"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {confirmingId === story.id && (
                <div
                  className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5"
                  role="alert"
                >
                  <span className="text-[10px] text-rose-200">
                    Delete this saved story permanently?
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md px-2 py-1 text-[9px] text-slate-400 hover:text-white"
                      disabled={deletingId === story.id}
                      onClick={() => setConfirmingId(null)}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-md bg-rose-500/80 px-2 py-1 text-[9px] font-medium text-white disabled:opacity-60"
                      disabled={deletingId === story.id}
                      onClick={() => void deleteStory(story.id)}
                      type="button"
                    >
                      {deletingId === story.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
