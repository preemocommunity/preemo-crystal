-- Fragment access keys
create table if not exists crystal_fragments (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  tier text not null check (tier in ('I', 'III', 'VII', 'XII')),
  holder_name text default '',
  holder_email text default '',
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Access log
create table if not exists crystal_access_log (
  id uuid default gen_random_uuid() primary key,
  fragment_code text not null,
  accessed_at timestamp with time zone default now()
);

-- RLS
alter table crystal_fragments enable row level security;
alter table crystal_access_log enable row level security;

create policy "Public read fragments" on crystal_fragments for select using (true);
create policy "Admin all fragments" on crystal_fragments for all using (true) with check (true);
create policy "Allow insert access log" on crystal_access_log for insert with check (true);
create policy "Admin all access log" on crystal_access_log for all using (true) with check (true);

-- Seed test fragments (replace these codes before going live)
insert into crystal_fragments (code, tier, holder_name, holder_email) values
  ('CRYSTAL-SEED-0001', 'I',   'Seed Holder',    'seed@test.com'),
  ('CRYSTAL-CORE-0001', 'III', 'Core Holder',    'core@test.com'),
  ('CRYSTAL-ARC-0001',  'VII', 'Arc Holder',     'arc@test.com'),
  ('CRYSTAL-FULL-0001', 'XII', 'Full Holder',    'full@test.com'),
  ('CRYSTAL-MARTIN-XII','XII', 'Martin Dionne',  'martin@premo.inc');
