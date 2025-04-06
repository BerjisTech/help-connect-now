
-- Create a bucket for storing avatar images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Allow public access to read avatar files
create policy "Public Access" 
on storage.objects 
for select 
to public
using (bucket_id = 'avatars');

-- Allow authenticated users to upload their avatars 
create policy "Users can upload their own avatars" 
on storage.objects 
for insert 
to authenticated 
with check (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their avatars
create policy "Users can update their own avatars" 
on storage.objects 
for update
to authenticated 
using (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
