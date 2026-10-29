"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Plus,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { CharacterCard } from "@/components/character-studio/character-card";
import { CharacterDetail } from "@/components/character-studio/character-detail";
import { CharacterForm } from "@/components/character-studio/character-form";
import {
  createCharacter as createCharacterAction,
  deleteCharacter as deleteCharacterAction,
  editCharacter as editCharacterAction,
} from "@/lib/character-studio/actions";
import type {
  CharacterFields,
  CharacterProfile,
  CharacterType,
} from "@/lib/character-studio/types";
import { CHARACTER_TYPES } from "@/lib/character-studio/types";

type StudioView = "library" | "create" | "detail" | "edit";
type CopyStatus = "idle" | "copying" | "copied";

const EMPTY_CHARACTER: CharacterFields = {
  name: "",
  type: "Human",
  personality: "",
  appearance: "",
  clothing: "",
  voiceStyle: "",
  specialFeatures: "",
  role: "",
};

export function CharacterStudio({
  initialCharacters,
}: {
  initialCharacters: CharacterProfile[];
}) {
  const [characters, setCharacters] = useState(initialCharacters);
  const [view, setView] = useState<StudioView>("library");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CharacterType | "All">(
    "All",
  );
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [pageError, setPageError] = useState<string | null>(null);

  const selectedCharacter = characters.find(
    (character) => character.id === selectedId,
  );
  const filteredCharacters = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return characters.filter((character) => {
      const matchesCategory =
        activeCategory === "All" || character.type === activeCategory;
      const searchableText = [
        character.name,
        character.personality,
        character.appearance,
        character.role,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [activeCategory, characters, searchQuery]);

  function showLibrary() {
    setView("library");
    setSelectedId(null);
    setPageError(null);
    setCopyStatus("idle");
  }

  function beginCreate() {
    setPageError(null);
    setCopyStatus("idle");
    setView("create");
  }

  function beginEdit() {
    setPageError(null);
    setCopyStatus("idle");
    setView("edit");
  }

  async function saveCharacter(value: CharacterFields) {
    setPageError(null);
    if (view === "edit" && selectedCharacter) {
      const result = await editCharacterAction(selectedCharacter.id, value);
      if (!result.success) throw new Error(result.error);
      setCharacters((current) =>
        current.map((character) =>
          character.id === selectedCharacter.id ? result.data : character,
        ),
      );
      setView("detail");
      return;
    }

    const result = await createCharacterAction(value);
    if (!result.success) throw new Error(result.error);
    const character: CharacterProfile = result.data;
    setCharacters((current) => [character, ...current]);
    setSelectedId(character.id);
    setView("detail");
  }

  async function deleteCharacter() {
    if (!selectedId) return;
    setPageError(null);
    try {
      const result = await deleteCharacterAction(selectedId);
      if (!result.success) {
        setPageError(result.error);
        return;
      }
      setCharacters((current) =>
        current.filter((character) => character.id !== selectedId),
      );
      showLibrary();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? `Could not delete the character: ${error.message}`
          : "Could not delete the character because of an unexpected error.",
      );
    }
  }

  async function copyPrompt(prompt: string) {
    setPageError(null);
    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("copied");
    } catch (error) {
      setCopyStatus("idle");
      setPageError(
        error instanceof Error
          ? `Could not copy the prompt: ${error.message}`
          : "Could not copy the prompt because clipboard access was denied.",
      );
    }
  }

  return (
    <div className="animate-rise-in">
      {view === "detail" && selectedCharacter ? (
        <>
          {pageError && <PageError message={pageError} />}
          <CharacterDetail
            character={selectedCharacter}
            copyStatus={copyStatus}
            onBack={showLibrary}
            onCopy={copyPrompt}
            onDelete={deleteCharacter}
            onEdit={beginEdit}
          />
        </>
      ) : view === "create" || view === "edit" ? (
        <>
          <div className="mb-5">
            <button
              className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-400 transition hover:text-white"
              onClick={() =>
                view === "edit" && selectedCharacter
                  ? setView("detail")
                  : showLibrary()
              }
              type="button"
            >
              <ArrowLeft size={14} />
              {view === "edit" ? "Back to character" : "Character library"}
            </button>
          </div>
          <CharacterForm
            initialValue={
              view === "edit" && selectedCharacter
                ? selectedCharacter
                : EMPTY_CHARACTER
            }
            isEditing={view === "edit"}
            onCancel={() =>
              view === "edit" && selectedCharacter
                ? setView("detail")
                : showLibrary()
            }
            onSave={saveCharacter}
          />
        </>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-300/[0.08]">
                  <UsersRound size={13} className="text-violet-200" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200">
                  Create &amp; grow
                </span>
              </div>
              <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-white sm:text-[28px]">
                Character Studio
              </h1>
              <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-slate-400">
                Build a cast of memorable characters and keep their details
                consistent in every story.
              </p>
            </div>
            <button
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-[11px] font-semibold text-white shadow-lg shadow-violet-950/25 transition hover:from-violet-500 hover:to-violet-400"
              onClick={beginCreate}
              type="button"
            >
              <Plus size={15} />
              Create Character
            </button>
          </div>

          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.035] px-4 py-3 text-[10px] leading-5 text-emerald-100/80">
            <Sparkles className="mt-0.5 shrink-0 text-emerald-200" size={14} />
            <p>
              <strong className="font-semibold text-emerald-100">
                Private database library.
              </strong>{" "}
              Characters are saved to your account and persist after refresh.
              Character prompts are text templates; image and video generation
              are not connected.
            </p>
          </div>

          {pageError && <PageError message={pageError} />}

          <section className="mb-5 rounded-2xl border border-white/[0.08] bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative block min-w-0 flex-1">
                <span className="sr-only">Search characters</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={15}
                />
                <input
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0c1322] py-2.5 pl-9 pr-3 text-[11px] text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/40"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, personality, or role…"
                  type="search"
                  value={searchQuery}
                />
              </label>
              <div
                aria-label="Filter by character type"
                className="thin-scrollbar flex gap-1.5 overflow-x-auto pb-0.5"
                role="group"
              >
                {(["All", ...CHARACTER_TYPES] as const).map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      aria-pressed={active}
                      className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] font-medium transition ${
                        active
                          ? "border-violet-300/20 bg-violet-300/[0.09] text-violet-100"
                          : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                      }`}
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      type="button"
                    >
                      {category === "All" ? "All types" : category}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-semibold text-slate-200">
              Character library
            </h2>
            <span className="text-[10px] text-slate-500">
              {filteredCharacters.length}{" "}
              {filteredCharacters.length === 1 ? "character" : "characters"}
            </span>
          </div>

          {filteredCharacters.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  character={character}
                  key={character.id}
                  onSelect={() => {
                    setSelectedId(character.id);
                    setCopyStatus("idle");
                    setPageError(null);
                    setView("detail");
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-surface/60 px-5 py-12 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400">
                <UsersRound size={18} />
              </span>
              <h3 className="mt-4 text-[13px] font-semibold text-slate-200">
                {characters.length === 0
                  ? "Your character library is empty"
                  : "No characters match your filters"}
              </h3>
              <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-5 text-slate-500">
                {characters.length === 0
                  ? "Create a character profile to start building your cast."
                  : "Try another search or category, or create a new character."}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {(searchQuery || activeCategory !== "All") && (
                  <button
                    className="rounded-lg border border-white/[0.09] px-3 py-2 text-[10px] text-slate-300 hover:bg-white/[0.04]"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All");
                    }}
                    type="button"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/90 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-400"
                  onClick={beginCreate}
                  type="button"
                >
                  <Plus size={13} />
                  Create Character
                </button>
              </div>
            </div>
          )}

          <p className="mt-5 text-center text-[9px] leading-4 text-slate-600">
            Characters belong to your signed-in account and are protected by
            database row-level security.
          </p>
        </>
      )}
    </div>
  );
}

function PageError({ message }: { message: string }) {
  return (
    <div
      className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-300/15 bg-rose-300/[0.045] px-4 py-3 text-[11px] leading-5 text-rose-200"
      role="alert"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={14} />
      <p>{message}</p>
    </div>
  );
}
