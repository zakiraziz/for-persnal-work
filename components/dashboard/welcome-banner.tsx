import { ArrowRight, Radio, Sparkles } from "lucide-react";

export function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-gradient-to-r from-[#211a3d] via-[#191b37] to-[#141c32] px-5 py-5 sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute -right-12 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[22%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-2xl gap-4">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.09] sm:flex">
            <Sparkles size={18} className="text-violet-200" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-md border border-violet-300/15 bg-violet-300/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-violet-200">
                Your studio is ready
              </span>
              <span className="hidden text-[10px] text-slate-500 sm:inline">
                A little room to create
              </span>
            </div>
            <h2 className="text-[15px] font-semibold tracking-tight text-white">
              Your next great video starts here.
            </h2>
            <p className="mt-1 max-w-xl text-[12px] leading-5 text-slate-400">
              Explore your creative workspace now. Connect your YouTube channel
              later to unlock live statistics and channel management.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/10 px-3.5 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]">
            <Radio size={14} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-300">
              Channel status
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
              Not connected <ArrowRight size={10} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
