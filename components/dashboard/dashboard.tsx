"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ComingSoon } from "@/components/dashboard/placeholder";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { Statistics } from "@/components/dashboard/statistics";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { RecentContent } from "@/components/dashboard/recent-content";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";
import { StoryStudio } from "@/components/story-studio/story-studio";
import { CharacterStudio } from "@/components/character-studio/character-studio";
import type { CharacterProfile } from "@/lib/character-studio/types";
import type { SavedStory } from "@/lib/story-studio/service";

export function Dashboard({
  characters,
  displayName,
  email,
  stories,
}: {
  characters: CharacterProfile[];
  displayName: string;
  email: string;
  stories: SavedStory[];
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  const [comingSoonTitle, setComingSoonTitle] = useState<string | null>(null);

  function navigate(page: string) {
    if (page === "Settings") {
      router.push("/account");
      return;
    }
    setActivePage(page);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        activePage={activePage}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
      />
      <div className="min-h-screen lg:pl-[264px]">
        <Topbar
          activePage={activePage}
          displayName={displayName}
          email={email}
          onMenuClick={() => setMenuOpen(true)}
        />
        <main className="mx-auto max-w-[1500px] px-5 pb-12 pt-7 sm:px-8 sm:pt-9 xl:px-10">
          {activePage === "Overview" ? (
            <div className="animate-rise-in">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-[23px] font-semibold tracking-[-0.035em] text-white sm:text-[27px]">
                    Good to see you, {displayName || "Creator"}{" "}
                    <span aria-hidden="true">✦</span>
                  </h1>
                  <p className="mt-1.5 text-[13px] text-slate-400">
                    Here&apos;s what&apos;s happening in your studio today.
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Demo workspace <span className="mx-1.5 text-slate-700">·</span>
                  No channel connected
                </p>
              </div>
              <div className="space-y-6">
                <WelcomeBanner />
                <Statistics />
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(350px,0.95fr)]">
                  <ViewsChart />
                  <QuickActions
                    onAction={(action) => {
                      if (action === "Write a Story") {
                        navigate("Story Studio");
                      } else {
                        setComingSoonTitle(action);
                      }
                    }}
                  />
                </div>
                <RecentContent />
              </div>
            </div>
          ) : activePage === "Story Studio" ? (
            <StoryStudio initialStories={stories} />
          ) : activePage === "Character Studio" ? (
            <CharacterStudio initialCharacters={characters} />
          ) : (
            <ComingSoon page={activePage} />
          )}
        </main>
      </div>
      {comingSoonTitle && (
        <ComingSoonDialog
          title={comingSoonTitle}
          onClose={() => setComingSoonTitle(null)}
        />
      )}
    </div>
  );
}
