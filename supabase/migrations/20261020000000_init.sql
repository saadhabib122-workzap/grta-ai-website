-- GRTA website: initial schema.
-- The website writes with the service role from server routes only.
-- Row-level security is on everywhere, with no public policies, so the
-- anon key can read or write nothing. Admin reads go through server code.

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- Demo, waitlist and partner requests
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text not null,
  size        text,
  role        text check (role in ('hr', 'project', 'partner', 'other')),
  message     text,
  mode        text not null default 'demo' check (mode in ('demo', 'waitlist', 'partner')),
  source      text,
  consent     boolean not null default false,
  status      text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed'))
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Anonymous Lab sessions (opt-in only)
create table if not exists public.lab_sessions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  tool        text not null check (tool in ('brief', 'translate', 'team', 'hiit', 'network')),
  input       text not null,
  output      jsonb not null,
  engine      text not null check (engine in ('ai', 'local'))
);

-- Two-minute pulse ratings
create table if not exists public.pulses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  tool        text not null,
  answers     smallint[] not null check (array_length(answers, 1) = 5),
  seconds     integer not null
);

-- Living Constellation: moderated, public problem nodes (phase 2)
create table if not exists public.constellation_nodes (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  session_id   uuid references public.lab_sessions (id) on delete set null,
  label        text not null,
  competencies text[] not null default '{}',
  status       text not null default 'pending' check (status in ('pending', 'approved', 'hidden'))
);

-- Challenge Exchange (phase 2)
create table if not exists public.partner_orgs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  country     text,
  kind        text check (kind in ('university', 'research', 'company', 'hub'))
);

create table if not exists public.challenges (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  org_id       uuid references public.partner_orgs (id) on delete cascade,
  title        text not null,
  body         text not null,
  competencies text[] not null default '{}',
  embedding    vector(1024),
  status       text not null default 'pending' check (status in ('pending', 'approved', 'hidden'))
);

create table if not exists public.challenge_matches (
  a_id   uuid references public.challenges (id) on delete cascade,
  b_id   uuid references public.challenges (id) on delete cascade,
  score  real not null,
  reason text,
  primary key (a_id, b_id)
);

-- Competency taxonomy with embeddings for semantic matching (phase 2)
create table if not exists public.competencies (
  id         text primary key,
  parent     text,
  name       text not null,
  embedding  vector(1024)
);

alter table public.leads               enable row level security;
alter table public.lab_sessions        enable row level security;
alter table public.pulses              enable row level security;
alter table public.constellation_nodes enable row level security;
alter table public.partner_orgs        enable row level security;
alter table public.challenges          enable row level security;
alter table public.challenge_matches   enable row level security;
alter table public.competencies        enable row level security;

-- Public, read-only views of moderated content
create policy "approved nodes are public" on public.constellation_nodes
  for select using (status = 'approved');
create policy "approved challenges are public" on public.challenges
  for select using (status = 'approved');
create policy "competencies are public" on public.competencies
  for select using (true);
