import { ArrowLeft, Sparkles } from "lucide-react";

type ComingSoonProps = {
  page: string;
};

export function ComingSoon({ page }: ComingSoonProps) {
  return (
    <section className="flex min-h-[62vh] flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-300/[0.08]">
        <Sparkles size={23} className="text-violet-200" />
      </div>
      <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.15em] text-violet-200">
        Coming soon
      </span>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
        {page}
      </h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        We&apos;re making room for this part of your creator workflow. It&apos;s not
        available just yet, but it&apos;s on the way.
      </p>
      <p className="mt-2 text-xs text-slate-600">
        No channel connection or backend features are active in this demo.
      </p>
    </section>
  );
}
