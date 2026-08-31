-- MarqueeOps agency workspace schema. Apply with the Supabase CLI or SQL editor.
create extension if not exists pgcrypto;

create type public.membership_role as enum ('owner', 'manager', 'member', 'client');
create type public.client_status as enum ('lead', 'onboarding', 'active', 'at_risk', 'paused', 'former');
create type public.project_status as enum ('planned', 'in_progress', 'at_risk', 'waiting_on_client', 'complete', 'cancelled');
create type public.campaign_channel as enum ('seo', 'paid_search', 'paid_social', 'email', 'content', 'creative', 'web');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'member',
  display_name text,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 160),
  website text,
  industry text,
  status public.client_status not null default 'lead',
  account_owner_id uuid references auth.users(id) on delete set null,
  monthly_retainer_cents integer not null default 0 check (monthly_retainer_cents >= 0),
  renewal_date date,
  health_score smallint not null default 75 check (health_score between 0 and 100),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 160),
  status public.project_status not null default 'planned',
  owner_id uuid references auth.users(id) on delete set null,
  start_date date,
  due_date date,
  budget_cents integer check (budget_cents >= 0),
  progress smallint not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null check (char_length(name) between 2 and 160),
  channel public.campaign_channel not null,
  budget_cents integer check (budget_cents >= 0),
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null check (entity_type in ('client', 'project', 'campaign', 'membership')),
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index clients_organization_status_idx on public.clients (organization_id, status);
create index projects_organization_status_idx on public.projects (organization_id, status);
create index campaigns_client_idx on public.campaigns (client_id);
create index activity_logs_organization_created_idx on public.activity_logs (organization_id, created_at desc);

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.campaigns enable row level security;
alter table public.activity_logs enable row level security;

create function public.is_workspace_member(target_organization uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where organization_id = target_organization and user_id = auth.uid()
  );
$$;

create policy "members can read their organization" on public.organizations for select using (public.is_workspace_member(id));
create policy "members can read memberships" on public.memberships for select using (public.is_workspace_member(organization_id));
create policy "members can read clients" on public.clients for select using (public.is_workspace_member(organization_id));
create policy "members can read projects" on public.projects for select using (public.is_workspace_member(organization_id));
create policy "members can read campaigns" on public.campaigns for select using (public.is_workspace_member(organization_id));
create policy "members can read activity" on public.activity_logs for select using (public.is_workspace_member(organization_id));

-- Write access is intentionally server-side through the service-role API until
-- membership-specific write policies and audit triggers are added.
