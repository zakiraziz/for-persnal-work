create extension if not exists pgtap with schema extensions;

begin;

select plan(12);

insert into public.authorized_users (email)
values
  ('noobitoon-rls-owner@example.test'),
  ('noobitoon-rls-second@example.test');

insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data
)
values
  (
    'e34dd53a-2de6-4d34-a185-634799335117',
    'authenticated',
    'authenticated',
    'noobitoon-rls-owner@example.test',
    'test-hash',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  ),
  (
    'a228fd35-c95c-48af-aad9-b53ef8e2cbd5',
    'authenticated',
    'authenticated',
    'noobitoon-rls-second@example.test',
    'test-hash',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  ),
  (
    '8c90a89d-9e1d-4f04-912e-23d2b4a1fdb9',
    'authenticated',
    'authenticated',
    'noobitoon-rls-unlisted@example.test',
    'test-hash',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  );

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"e34dd53a-2de6-4d34-a185-634799335117","role":"authenticated","email":"noobitoon-rls-owner@example.test"}',
  true
);
select set_config('request.jwt.claim.sub', 'e34dd53a-2de6-4d34-a185-634799335117', true);
select lives_ok(
  $$insert into public.characters (
    owner_id, name, character_type, personality, appearance, clothing,
    voice_style, special_features, role, prompt
  ) values (
    auth.uid(), 'Owner character', 'Animal', 'Curious', 'Green turtle',
    'Blue scarf', 'Gentle', '', 'Explorer', 'Character prompt'
  )$$,
  'authorized owner can create a character'
);
select is(
  (select count(*) from public.characters),
  1::bigint,
  'owner can read their own character'
);
select lives_ok(
  $$update public.characters set name = 'Updated owner character' where owner_id = auth.uid()$$,
  'owner can update their own character'
);
select is(
  (select name from public.characters),
  'Updated owner character',
  'owner update is persisted'
);
select lives_ok(
  $$delete from public.characters where owner_id = auth.uid()$$,
  'owner can delete their own character'
);
select is(
  (select count(*) from public.characters),
  0::bigint,
  'owner deletion is persisted'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"a228fd35-c95c-48af-aad9-b53ef8e2cbd5","role":"authenticated","email":"noobitoon-rls-second@example.test"}',
  true
);
select set_config('request.jwt.claim.sub', 'a228fd35-c95c-48af-aad9-b53ef8e2cbd5', true);
select is(
  (select count(*) from public.characters),
  0::bigint,
  'a different authorized user cannot read the owner character'
);
select throws_ok(
  $$insert into public.characters (
    owner_id, name, character_type, personality, appearance, clothing,
    voice_style, special_features, role, prompt
  ) values (
    'e34dd53a-2de6-4d34-a185-634799335117', 'Cross-owner character',
    'Animal', 'Curious', 'Green turtle', 'Blue scarf', 'Gentle', '',
    'Explorer', 'Character prompt'
  )$$,
  '42501',
  null,
  'a user cannot create a record for another owner'
);
select lives_ok(
  $$insert into public.characters (
    owner_id, name, character_type, personality, appearance, clothing,
    voice_style, special_features, role, prompt
  ) values (
    auth.uid(), 'Second character', 'Robot', 'Helpful', 'Small robot',
    'Tool belt', 'Clear', '', 'Assistant', 'Character prompt'
  )$$,
  'second authorized user can create their own character'
);
select is(
  (select count(*) from public.characters),
  1::bigint,
  'second user only reads their own character'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"8c90a89d-9e1d-4f04-912e-23d2b4a1fdb9","role":"authenticated","email":"noobitoon-rls-unlisted@example.test"}',
  true
);
select set_config('request.jwt.claim.sub', '8c90a89d-9e1d-4f04-912e-23d2b4a1fdb9', true);
select is(
  (select count(*) from public.characters),
  0::bigint,
  'an authenticated but unlisted account cannot read characters'
);
select throws_ok(
  $$insert into public.characters (
    owner_id, name, character_type, personality, appearance, clothing,
    voice_style, special_features, role, prompt
  ) values (
    auth.uid(), 'Unlisted character', 'Animal', 'Curious', 'Green turtle',
    'Blue scarf', 'Gentle', '', 'Explorer', 'Character prompt'
  )$$,
  '42501',
  null,
  'an authenticated but unlisted account cannot create characters'
);

select * from finish();
rollback;
