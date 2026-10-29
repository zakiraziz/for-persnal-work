import {
  ArrowUpRight,
  Clapperboard,
  Image,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { quickActions } from "@/lib/dashboard-data";

const actionIcons: Record<(typeof quickActions)[number]["icon"], LucideIcon> = {
  story: Sparkles,
  thumbnail: Image,
  video: Clapperboard,
  ideas: Lightbulb,
};

const actionColors = {
  violet: "bg-violet-400/10 text-violet-300 ring-violet-300/10",
  blue: "bg-blue-400/10 text-blue-300 ring-blue-300/10",
  orange: "bg-orange-400/10 text-orange-300 ring-orange-300/10",
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/10",
};

type QuickActionsProps = {
  onAction: (action: string) => void;
};

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-surface p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-slate-100">Quick actions</h2>
          <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-slate-500">
            Coming soon
          </span>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">
          A few ways to get your next idea moving.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {quickActions.map((action) => {
          const Icon = actionIcons[action.icon];
          return (
            <button
              key={action.title}
              className="group relative min-h-[112px] rounded-xl border border-white/[0.06] bg-[#0d1424] p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#131d31]"
              onClick={() => onAction(action.title)}
            >
              <div className={`mb-3 flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${actionColors[action.color]}`}>
                <Icon size={14} />
              </div>
              <p className="text-[10px] font-semibold text-slate-200 sm:text-[11px]">
                {action.title}
              </p>
              <p className="mt-1 text-[9px] leading-4 text-slate-500">
                {action.description}
              </p>
              <ArrowUpRight
                size={12}
                className="absolute right-2.5 top-2.5 text-slate-700 transition group-hover:text-slate-300"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
