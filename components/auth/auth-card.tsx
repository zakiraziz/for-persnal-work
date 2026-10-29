import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
        <a className="text-sm font-semibold text-violet-200" href="/login">
          NoobiToon <span className="text-slate-400">AI Studio</span>
        </a>
        <h1 className="mt-7 text-xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
