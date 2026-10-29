"use client";

import { Bell, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/lib/auth/actions";

type TopbarProps = {
  onMenuClick: () => void;
  activePage: string;
  displayName: string;
  email: string;
};

export function Topbar({
  onMenuClick,
  activePage,
  displayName,
  email,
}: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#090d18]/85 px-5 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/[0.06] lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-100 sm:text-[15px]">
            {activePage === "Overview" ? "Creator Dashboard" : activePage}
          </p>
          <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">
            Your creative workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          <span className="text-[11px] font-medium text-amber-200/90">
            Not connected
          </span>
        </div>
        <div className="relative">
          <button
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="relative rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileOpen(false);
            }}
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400 ring-2 ring-[#090d18]" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-white/10 bg-[#121a2b] p-4 shadow-2xl">
              <p className="text-sm font-medium text-white">You&apos;re all caught up</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                New creator updates will appear here.
              </p>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-white/[0.05]"
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotificationsOpen(false);
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-600 text-[11px] font-semibold text-white ring-2 ring-white/[0.08]">
              {displayName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("") || "NT"}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-36 truncate text-[11px] font-medium text-slate-200">
                {displayName || "Creator"}
              </span>
              <span className="block max-w-36 truncate text-[10px] text-slate-500">
                {email}
              </span>
            </span>
            <ChevronDown size={14} className="hidden text-slate-500 sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 z-30 w-52 rounded-xl border border-white/10 bg-[#121a2b] p-2 shadow-2xl">
              <div className="border-b border-white/[0.07] px-3 py-2">
                <p className="truncate text-xs font-medium text-white">
                  {displayName || "Creator account"}
                </p>
                <p className="mt-1 truncate text-[10px] text-slate-500">
                  {email}
                </p>
              </div>
              <Link
                className="block rounded-lg px-3 py-2.5 text-[11px] text-slate-300 hover:bg-white/[0.05] hover:text-white"
                href="/account"
                onClick={() => setProfileOpen(false)}
              >
                Manage profile
              </Link>
              <form action={signOut}>
                <button
                  className="w-full rounded-lg px-3 py-2.5 text-left text-[11px] text-rose-200 hover:bg-rose-300/[0.05]"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
