-- Auto-promote purescoop@admin.com to admin status on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    (new.email = 'purescoop@admin.com') -- Automatically set to true if it matches admin email
  );
  return new;
end;
$$ language plpgsql security definer;

-- If the user already exists, update their admin status
update public.profiles 
set is_admin = true 
where email = 'purescoop@admin.com';
