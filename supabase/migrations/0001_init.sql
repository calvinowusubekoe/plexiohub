-- PlexioHub initial schema: quote requests, portfolio projects, FAQs.
-- Sign-ups must be disabled in Supabase Auth settings; the only user is the admin,
-- so the "authenticated" role means "the admin" in the policies below.

create extension if not exists pgcrypto;

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  services text[] not null,
  goals text,
  features text[] not null default '{}',
  service_answers jsonb not null default '{}'::jsonb,
  budget_currency text,
  budget_range text,
  timeline text,
  name text not null,
  business_name text,
  whatsapp text,
  email text,
  preferred_contact text,
  country text,
  notes text,
  ip_hash text
);
create index quote_requests_ip_recent on public.quote_requests (ip_hash, created_at);
create index quote_requests_status on public.quote_requests (status, created_at desc);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  kind text not null default 'client' check (kind in ('concept', 'client')),
  service_tags text[] not null default '{}',
  summary text not null default '',
  problem text not null default '',
  built text not null default '',
  features text[] not null default '{}',
  live_url text,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default false
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

alter table public.quote_requests enable row level security;
alter table public.projects enable row level security;
alter table public.faqs enable row level security;

-- Public (anon) can read published projects and all FAQs. Quote requests are inserted
-- server-side with the service role, so anon gets no access to them at all.
create policy "public reads published projects" on public.projects for select to anon using (published);
create policy "public reads faqs" on public.faqs for select to anon using (true);

create policy "admin manages quotes" on public.quote_requests for all to authenticated using (true) with check (true);
create policy "admin manages projects" on public.projects for all to authenticated using (true) with check (true);
create policy "admin manages faqs" on public.faqs for all to authenticated using (true) with check (true);

-- Portfolio images
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true)
on conflict (id) do nothing;
create policy "public reads project images" on storage.objects for select using (bucket_id = 'project-images');
create policy "admin uploads project images" on storage.objects for insert to authenticated with check (bucket_id = 'project-images');
create policy "admin updates project images" on storage.objects for update to authenticated using (bucket_id = 'project-images');
create policy "admin deletes project images" on storage.objects for delete to authenticated using (bucket_id = 'project-images');

-- Seed content
insert into public.projects (slug, title, kind, service_tags, summary, problem, built, features, live_url, sort_order, published)
values (
  'palette-pleasers', 'Palette Pleasers', 'concept', '{website-design}',
  'A fine-dining restaurant website with menu, testimonials and contact.',
  'Restaurants lose diners when people cannot quickly see the menu, opening hours or how to get in touch.',
  'A responsive restaurant website with a featured menu, customer testimonials, opening hours, a contact form and a newsletter signup.',
  '{"Menu showcase","Customer testimonials","Contact form","Opening hours","Newsletter signup","Dark mode"}',
  'https://palette-pleasers.netlify.app', 0, true
);

insert into public.faqs (question, answer, sort_order) values
('How much does a project cost?', 'It depends on what you need. Our projects range from about GHS 200 for small design jobs to GHS 20,000 for larger websites, online shops and automation systems. Send a quote request and we will give you a clear price before any work starts.', 0),
('How long does it take?', 'Small design jobs take a few days. Most websites take 1–3 weeks, and larger shops or automation projects 3–6 weeks. We agree a timeline with you upfront.', 1),
('How do payments work?', 'We usually take a deposit to start and the balance at launch. We accept Mobile Money and bank transfer, and international clients can pay by card or transfer.', 2),
('Do you offer support after launch?', 'Yes. Every project includes a period of free fixes after launch, and we offer ongoing support plans for updates, hosting and help whenever you need it.', 3),
('Do you work with businesses outside Ghana?', 'Yes. We are based in Ghana and work with businesses worldwide. Everything can be done remotely over WhatsApp, email and video calls.', 4),
('Can you update my existing website?', 'Yes. We can improve, fix or fully redesign an existing website. Share the link in your quote request and we will take a look.', 5);
