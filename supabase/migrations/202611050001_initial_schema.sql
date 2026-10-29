create extension if not exists pgcrypto with schema extensions;

create table public.authorized_users (
  email text primary key
    check (email = lower(btrim(email)) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  created_at timestamptz not null default now()
);

alter table public.authorized_users enable row level security;

create or replace function public.is_authorized_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.authorized_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_authorized_user() from public, anon;
grant execute on function public.is_authorized_user() to authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  avatar_url text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  character_type text not null check (character_type in ('Human', 'Animal', 'Robot', 'Vegetable', 'Fantasy', 'Other')),
  personality text not null check (char_length(btrim(personality)) between 1 and 400),
  appearance text not null check (char_length(btrim(appearance)) between 1 and 700),
  clothing text not null check (char_length(btrim(clothing)) between 1 and 400),
  voice_style text not null check (char_length(btrim(voice_style)) between 1 and 350),
  special_features text not null default '' check (char_length(btrim(special_features)) <= 400),
  role text not null check (char_length(btrim(role)) between 1 and 250),
  prompt text not null check (char_length(prompt) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  topic text not null check (char_length(btrim(topic)) between 8 and 500),
  style text not null check (style in ('Comedy', 'Mystery', 'Adventure', 'Fantasy')),
  duration text not null check (duration in ('40 seconds', '1 minute', '3 minutes', '5 minutes')),
  characters text not null check (char_length(btrim(characters)) between 1 and 300),
  language text not null default 'English' check (language = 'English'),
  introduction text not null default '' check (char_length(introduction) <= 10000),
  narrator_script text not null default '' check (char_length(narrator_script) <= 30000),
  dialogue jsonb not null default '[]'::jsonb check (jsonb_typeof(dialogue) = 'array'),
  ending text not null default '' check (char_length(ending) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.story_scenes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  position integer not null check (position >= 0),
  title text not null default '' check (char_length(title) <= 200),
  description text not null default '' check (char_length(description) <= 5000),
  created_at timestamptz not null default now(),
  unique (story_id, position)
);

create table public.content_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  project_type text not null check (project_type in ('video', 'short', 'thumbnail', 'other')),
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'complete', 'published')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  bucket_id text not null default 'private-media',
  object_path text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bucket_id, object_path),
  check (bucket_id = 'private-media'),
  check (object_path ~ ('^' || owner_id::text || '/.+'))
);

create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  key text not null check (char_length(key) between 1 and 100),
  value jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, key)
);

create index characters_owner_created_idx on public.characters (owner_id, created_at desc);
create index stories_owner_updated_idx on public.stories (owner_id, updated_at desc);
create index story_scenes_owner_story_idx on public.story_scenes (owner_id, story_id, position);
create index content_projects_owner_updated_idx on public.content_projects (owner_id, updated_at desc);
create index media_assets_owner_created_idx on public.media_assets (owner_id, created_at desc);
create index app_settings_owner_key_idx on public.app_settings (owner_id, key);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger characters_set_updated_at
before update on public.characters
for each row execute function public.set_updated_at();

create trigger stories_set_updated_at
before update on public.stories
for each row execute function public.set_updated_at();

create trigger content_projects_set_updated_at
before update on public.content_projects
for each row execute function public.set_updated_at();

create trigger app_settings_set_updated_at
before update on public.app_settings
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.stories enable row level security;
alter table public.story_scenes enable row level security;
alter table public.content_projects enable row level security;
alter table public.media_assets enable row level security;
alter table public.app_settings enable row level security;

create policy "Authorized users can read their profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()) and (select public.is_authorized_user()));

create policy "Authorized users can update their profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()) and (select public.is_authorized_user()))
with check (id = (select auth.uid()) and (select public.is_authorized_user()));

create policy "Authorized users can manage their characters"
on public.characters for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_authorized_user()))
with check (owner_id = (select auth.uid()) and (select public.is_authorized_user()));

create policy "Authorized users can manage their stories"
on public.stories for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_authorized_user()))
with check (owner_id = (select auth.uid()) and (select public.is_authorized_user()));

create policy "Authorized users can manage their story scenes"
on public.story_scenes for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_authorized_user()))
with check (
  owner_id = (select auth.uid())
  and (select public.is_authorized_user())
  and exists (
    select 1
    from public.stories
    where stories.id = story_scenes.story_id
      and stories.owner_id = (select auth.uid())
  )
);

create policy "Authorized users can manage their content projects"
on public.content_projects for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_authorized_user()))
with check (owner_id = (select auth.uid()) and (select public.is_authorized_user()));

create policy "Authorized users can manage their media records"
on public.media_assets for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_authorized_user()))
with check (owner_id = (select auth.uid()) and (select public.is_authorized_user()));

create policy "Authorized users can manage their settings"
on public.app_settings for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_authorized_user()))
with check (owner_id = (select auth.uid()) and (select public.is_authorized_user()));

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.stories to authenticated;
grant select, insert, update, delete on public.story_scenes to authenticated;
grant select, insert, update, delete on public.content_projects to authenticated;
grant select, insert, update, delete on public.media_assets to authenticated;
grant select, insert, update, delete on public.app_settings to authenticated;

insert into storage.buckets (id, name, public)
values ('private-media', 'private-media', false)
on conflict (id) do update set public = false;

create policy "Authorized users can read their private media"
on storage.objects for select to authenticated
using (
  bucket_id = 'private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_authorized_user())
);

create policy "Authorized users can upload their private media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_authorized_user())
);

create policy "Authorized users can update their private media"
on storage.objects for update to authenticated
using (
  bucket_id = 'private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_authorized_user())
)
with check (
  bucket_id = 'private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_authorized_user())
);

create policy "Authorized users can delete their private media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_authorized_user())
);

create or replace function public.save_story(
  p_story_id uuid,
  p_title text,
  p_topic text,
  p_style text,
  p_duration text,
  p_characters text,
  p_language text,
  p_introduction text,
  p_narrator_script text,
  p_dialogue jsonb,
  p_ending text,
  p_scenes jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_story_id uuid;
begin
  if auth.uid() is null or not public.is_authorized_user() then
    raise exception 'Not authorized';
  end if;

  if p_story_id is null then
    insert into public.stories (
      owner_id, title, topic, style, duration, characters, language,
      introduction, narrator_script, dialogue, ending
    )
    values (
      auth.uid(), p_title, p_topic, p_style, p_duration, p_characters,
      p_language, p_introduction, p_narrator_script, p_dialogue, p_ending
    )
    returning id into v_story_id;
  else
    update public.stories
    set title = p_title,
        topic = p_topic,
        style = p_style,
        duration = p_duration,
        characters = p_characters,
        language = p_language,
        introduction = p_introduction,
        narrator_script = p_narrator_script,
        dialogue = p_dialogue,
        ending = p_ending
    where id = p_story_id and owner_id = auth.uid()
    returning id into v_story_id;

    if v_story_id is null then
      raise exception 'Story not found';
    end if;

    delete from public.story_scenes
    where story_id = v_story_id and owner_id = auth.uid();
  end if;

  if jsonb_typeof(coalesce(p_scenes, '[]'::jsonb)) <> 'array' then
    raise exception 'Scenes must be an array';
  end if;

  insert into public.story_scenes (owner_id, story_id, position, title, description)
  select
    auth.uid(),
    v_story_id,
    scene.position,
    scene.title,
    scene.description
  from jsonb_to_recordset(coalesce(p_scenes, '[]'::jsonb))
    as scene(position integer, title text, description text);

  return v_story_id;
end;
$$;

revoke all on function public.save_story(uuid, text, text, text, text, text, text, text, text, jsonb, text, jsonb) from public, anon;
grant execute on function public.save_story(uuid, text, text, text, text, text, text, text, text, jsonb, text, jsonb) to authenticated;
