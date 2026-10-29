import { listCharacters } from "@/lib/character-studio/service";
import { requireAuthorizedUser } from "@/lib/auth/user";
import { listSavedStories } from "@/lib/story-studio/service";
import { Dashboard } from "@/components/dashboard/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { supabase, user } = await requireAuthorizedUser();
  const [characters, stories, profileResult] = await Promise.all([
    listCharacters(supabase, user.id),
    listSavedStories(supabase, user.id),
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single(),
  ]);

  if (profileResult.error) {
    throw new Error(`Could not load your profile: ${profileResult.error.message}`);
  }

  return (
    <Dashboard
      characters={characters}
      displayName={profileResult.data.display_name}
      email={user.email ?? ""}
      stories={stories}
    />
  );
}
