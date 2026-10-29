"use client";

import {
  BarChart3,
  CalendarDays,
  Clapperboard,
  FileText,
  Image,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { navigationItems } from "@/lib/dashboard-data";

const icons: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  story: Sparkles,
  characters: UsersRound,
  thumbnail: Image,
  video: Clapperboard,
  seo: FileText,
  planner: CalendarDays,
  analytics: BarChart3,
  comments: MessageCircle,
  settings: Settings,
};

type SidebarProps = {
  activePage: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
};

export function Sidebar({
  activePage,
  isOpen,
  onClose,
  onNavigate,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-white/[0.07] bg-sidebar px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/40">
              <span className="text-sm font-black tracking-tight text-white">N</span>
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-sidebar bg-cyan-300" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-5 text-white">
                NoobiToon
              </p>
              <p className="text-[11px] leading-4 text-slate-500">AI Studio</p>
            </div>
          </div>
          <button
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Workspace
        </div>
        <nav className="space-y-1">
          {navigationItems.slice(0, 1).map((item) => {
            const Icon = icons[item.icon];
            const active = activePage === item.label;
            return (
              <button
                key={item.label}
                aria-current={active ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${
                  active
                    ? "bg-violet-500/15 font-medium text-violet-200 ring-1 ring-inset ring-violet-400/15"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                }`}
                onClick={() => onNavigate(item.label)}
              >
                <Icon size={17} className={active ? "text-violet-300" : ""} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Create &amp; grow
        </div>
        <nav className="space-y-1">
          {navigationItems.slice(1).map((item) => {
            const Icon = icons[item.icon];
            const active = activePage === item.label;
            return (
              <button
                key={item.label}
                aria-current={active ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${
                  active
                    ? "bg-violet-500/15 font-medium text-violet-200 ring-1 ring-inset ring-violet-400/15"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                }`}
                onClick={() => onNavigate(item.label)}
              >
                <Icon size={17} className={active ? "text-violet-300" : ""} />
                {item.label}
                {item.label === "Story Studio" && (
                  <span className="ml-auto rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Preferences
        </div>
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${
            activePage === "Settings"
              ? "bg-violet-500/15 font-medium text-violet-200"
              : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
          }`}
          onClick={() => onNavigate("Settings")}
        >
          <Settings size={17} />
          Settings
        </button>

        <div className="mt-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span className="text-[11px] font-medium text-slate-300">
              Channel not connected
            </span>
          </div>
          <p className="text-[11px] leading-5 text-slate-500">
            Connect your channel later to see live creator insights.
          </p>
        </div>
      </aside>
    </>
  );
}
