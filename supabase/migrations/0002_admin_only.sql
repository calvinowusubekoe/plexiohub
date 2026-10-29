-- Only the founder's account is an admin, even if sign-ups are ever switched back on.
-- After running this, add your login email:
--   insert into public.admins (email) values ('you@example.com');

create table public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- No policies: nobody can read or change this table through the API. Manage it in the SQL editor.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

drop policy "admin manages quotes" on public.quote_requests;
drop policy "admin manages projects" on public.projects;
drop policy "admin manages faqs" on public.faqs;
create policy "admin manages quotes" on public.quote_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages faqs" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy "admin uploads project images" on storage.objects;
drop policy "admin updates project images" on storage.objects;
drop policy "admin deletes project images" on storage.objects;
create policy "admin uploads project images" on storage.objects for insert to authenticated with check (bucket_id = 'project-images' and public.is_admin());
create policy "admin updates project images" on storage.objects for update to authenticated using (bucket_id = 'project-images' and public.is_admin());
create policy "admin deletes project images" on storage.objects for delete to authenticated using (bucket_id = 'project-images' and public.is_admin());

-- Public image URLs work without a select policy; dropping it stops anyone listing the bucket.
drop policy "public reads project images" on storage.objects;

-- Enforce the upload rules on the server too, not only in the admin form.
update storage.buckets
set file_size_limit = 5242880, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'project-images';
