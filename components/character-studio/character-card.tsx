import { ArrowUpRight, Sparkles } from "lucide-react";
import type { CharacterProfile } from "@/lib/character-studio/types";

const characterEmoji: Record<CharacterProfile["type"], string> = {
  Human: "🧑",
  Animal: "🐢",
  Robot: "🤖",
  Vegetable: "🥕",
  Fantasy: "🪄",
  Other: "✨",
};

const characterTone: Record<CharacterProfile["type"], string> = {
  Human: "from-blue-500/20 to-cyan-400/5",
  Animal: "from-emerald-500/20 to-lime-400/5",
  Robot: "from-sky-500/20 to-indigo-400/5",
  Vegetable: "from-lime-500/20 to-green-400/5",
  Fantasy: "from-fuchsia-500/20 to-violet-400/5",
  Other: "from-amber-500/20 to-orange-400/5",
};

type CharacterCardProps = {
  character: CharacterProfile;
  onSelect: () => void;
};

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  const createdDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(character.createdAt));

  return (
    <button
      className="group min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-surface text-left transition hover:-translate-y-0.5 hover:border-violet-300/20 hover:shadow-xl hover:shadow-black/10 focus-visible:outline-violet-300"
      onClick={onSelect}
      type="button"
    >
      <div
        className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${characterTone[character.type]}`}
      >
        <div className="absolute -right-7 -top-10 h-32 w-32 rounded-full border border-white/[0.06]" />
        <div className="absolute -bottom-16 -left-7 h-36 w-36 rounded-full border border-white/[0.06]" />
        <span
          aria-hidden="true"
          className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-white/[0.12] bg-[#101729]/75 text-[35px] shadow-xl backdrop-blur"
        >
          {characterEmoji[character.type]}
        </span>
        <span className="absolute left-3 top-3 rounded-full border border-white/[0.12] bg-[#090d18]/50 px-2.5 py-1 text-[9px] font-medium text-slate-200 backdrop-blur">
          {character.type}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-white/[0.1] bg-[#090d18]/45 px-2 py-1 text-[8px] uppercase tracking-wide text-slate-300 backdrop-blur">
          Saved
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-[14px] font-semibold text-slate-100">
            {character.name}
          </h3>
          <ArrowUpRight
            className="mt-0.5 shrink-0 text-slate-600 transition group-hover:text-violet-200"
            size={15}
          />
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-[11px] leading-5 text-slate-400">
          {character.personality}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
          <span className="flex items-center gap-1.5 text-[9px] text-slate-500">
            <Sparkles size={11} className="text-violet-300/80" />
            {character.role}
          </span>
          <time
            className="shrink-0 text-[9px] text-slate-600"
            dateTime={character.createdAt}
          >
            {createdDate}
          </time>
        </div>
      </div>
    </button>
  );
}
