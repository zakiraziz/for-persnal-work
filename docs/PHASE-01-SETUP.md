# Phase 01 setup

## Required environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SITE_URL`: the app's origin (`http://localhost:3000` locally).
- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the project's publishable/anon key. This key is safe to expose only because every table and storage object is protected by RLS.
- `AUTHORIZED_EMAIL`: the one email address permitted to register and use this app.

Do not add a service-role key to the browser or this app's environment. The app uses the signed-in user's session for database access.

## Supabase setup

1. Create a Supabase project and enable the email/password provider.
2. Apply `supabase/migrations/202611050001_initial_schema.sql` using the Supabase SQL editor or the Supabase CLI.
3. Add the same lower-case address configured as `AUTHORIZED_EMAIL` to the private database allowlist:

   ```sql
   insert into public.authorized_users (email)
   values (lower('you@example.com'))
   on conflict (email) do nothing;
   ```

4. In Supabase Auth URL configuration, set the site URL to `NEXT_PUBLIC_SITE_URL` and allow `${NEXT_PUBLIC_SITE_URL}/auth/callback`.
5. Register at `/register`. If email confirmations are enabled, confirm the email before signing in.
6. Start the application with `npm run dev`, then sign in at `/login`.

The allowlist is checked both in the Next.js request proxy and in RLS policies. New records are owned by the authenticated user. Profiles are created by a database trigger. The `private-media` bucket is private and its storage policies require user-ID-prefixed object paths.

## Persistence

Character create, edit, delete, and list operations use authenticated server actions and persist in PostgreSQL. The generated character prompt is stored with its source profile and rebuilt when profile details change.

Story drafts can be saved, reopened, updated, and deleted. The story record and its scenes are saved atomically by the `save_story` database function. AI generation remains disconnected; the editor's starter story is sample content until explicitly saved.

The remaining project and media tables are schema foundations. Media uploads, video projects, and YouTube data flows are not implemented in this phase.

## Validation and tests

- `npm run test`: local unit tests for character input validation and prompt construction.
- `npm run lint`
- `npm run build`
- `supabase test db`: database RLS integration tests in `supabase/tests/rls.test.sql` (requires the Supabase CLI and a running local Supabase stack).

Database tests require the migration to be applied. Without a configured Supabase project, the app redirects protected requests to setup/login and cannot perform authenticated database operations.
