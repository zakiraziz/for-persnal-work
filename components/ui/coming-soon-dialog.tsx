"use client";

import { Sparkles, X } from "lucide-react";
import { useEffect } from "react";

type ComingSoonDialogProps = {
  title: string;
  onClose: () => void;
};

export function ComingSoonDialog({ title, onClose }: ComingSoonDialogProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="coming-soon-title"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#11192a] p-6 shadow-2xl shadow-black/40"
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
          onClick={onClose}
        >
          <X size={16} />
        </button>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.08]">
          <Sparkles size={17} className="text-violet-200" />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-300">
          Coming soon
        </span>
        <h2
          className="mt-2 text-lg font-semibold tracking-tight text-white"
          id="coming-soon-title"
        >
          {title}
        </h2>
        <p className="mt-2 text-[12px] leading-5 text-slate-400">
          This creative tool is part of the upcoming NoobiToon AI Studio
          experience. It isn&apos;t available in this dashboard preview yet.
        </p>
        <button
          className="mt-5 w-full rounded-lg bg-violet-500 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-violet-400"
          onClick={onClose}
        >
          Got it
        </button>
      </section>
    </div>
  );
}
