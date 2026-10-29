export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, key };
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) return false;
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" ||
      (parsedUrl.protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(parsedUrl.hostname))
    );
  } catch {
    return false;
  }
}

export function isAppConfigured() {
  if (!isSupabaseConfigured() || !process.env.AUTHORIZED_EMAIL?.trim()) {
    return false;
  }
  try {
    getSiteUrl();
    return true;
  } catch {
    return false;
  }
}

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) {
    throw new Error("Set NEXT_PUBLIC_SITE_URL to the application origin.");
  }
  const parsedUrl = new URL(siteUrl);
  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(
    parsedUrl.hostname,
  );
  if (parsedUrl.protocol !== "https:" && !(parsedUrl.protocol === "http:" && isLoopback)) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must use HTTPS, except for a local development origin.",
    );
  }
  return parsedUrl.origin;
}

export function isAuthorizedEmail(email: string | undefined) {
  const authorizedEmail = process.env.AUTHORIZED_EMAIL?.trim().toLowerCase();
  return Boolean(
    authorizedEmail && email?.trim().toLowerCase() === authorizedEmail,
  );
}
