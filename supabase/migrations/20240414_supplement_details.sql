-- Add supplement-specific fields to products table
alter table public.products add column if not exists weight text;
alter table public.products add column if not exists servings integer;
alter table public.products add column if not exists protein_per_serving text;
alter table public.products add column if not exists carbs_per_serving text;
alter table public.products add column if not exists fat_per_serving text;
alter table public.products add column if not exists energy_per_serving text;
alter table public.products add column if not exists ingredients text;
alter table public.products add column if not exists usage_instructions text;
alter table public.products add column if not exists advanced_details jsonb default '{}'::jsonb;

-- Ensure the admin user exists in profiles with is_admin = true
-- This is just for safety, the actual auth user creation happens in Supabase Dashboard or Signup
update public.profiles set is_admin = true where email = 'purescoop@admin.com';
