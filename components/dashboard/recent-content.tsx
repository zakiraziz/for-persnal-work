import { Play } from "lucide-react";
import { recentProjects } from "@/lib/dashboard-data";

const artwork: Record<string, string> = {
  cloud:
    "radial-gradient(circle at 50% 49%, #f9d79c 0 12%, transparent 13%), linear-gradient(135deg,#3b3175,#9a74b9 52%,#f4b77a)",
  habits:
    "radial-gradient(circle at 50% 47%, #f3cb8b 0 15%, transparent 16%), linear-gradient(135deg,#162d4d,#3277a1 52%,#83c6b8)",
  cat:
    "radial-gradient(circle at 50% 52%, #ffcb82 0 14%, transparent 15%), linear-gradient(135deg,#35315f,#8d5d83 55%,#e49c73)",
};

export function RecentContent() {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-slate-100">Recent content</h2>
            <span className="rounded border border-violet-300/15 bg-violet-300/[0.07] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-violet-200">
              Demo projects
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            A snapshot of your latest video projects.
          </p>
        </div>
        <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] text-slate-500">
          {recentProjects.length} projects
        </span>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {recentProjects.map((project) => (
          <article
            key={project.title}
            className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.015] sm:gap-4 sm:px-5"
          >
            <div
              role="img"
              aria-label={`Illustrated thumbnail placeholder for ${project.title}`}
              className="relative h-12 w-[76px] shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-[52px] sm:w-[86px]"
              style={{ background: artwork[project.art] }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              <div className="absolute bottom-1 left-1.5 text-[7px] font-semibold tracking-[0.16em] text-white/85">
                NOOBITOON
              </div>
              <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/35">
                <Play size={9} fill="white" className="ml-0.5 text-white" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-slate-200 sm:text-xs">
                {project.title}
              </p>
              <p className="mt-1 text-[9px] text-slate-500">{project.type}</p>
            </div>
            <div className="hidden min-w-[68px] text-right sm:block">
              <p className="text-[11px] text-slate-300">{project.views}</p>
              <p className="mt-1 text-[9px] text-slate-600">views</p>
            </div>
            <div className="hidden min-w-[110px] text-right md:block">
              <p className="text-[10px] text-slate-400">{project.date}</p>
            </div>
            <div className="ml-auto flex min-w-[74px] justify-end">
              <span
                className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                  project.status === "Published"
                    ? "border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
                    : "border border-amber-400/15 bg-amber-400/[0.06] text-amber-200"
                }`}
              >
                {project.status}
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="border-t border-white/[0.06] px-4 py-2.5 text-[9px] text-slate-600 sm:px-5">
        All project names, view counts and statuses shown above are sample data.
      </div>
    </section>
  );
}
