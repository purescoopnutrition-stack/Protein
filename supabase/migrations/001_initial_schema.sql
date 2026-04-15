-- ═══════════════════════════════════════════════════════════════════════════
-- PureScoop Nutrition — Full Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ──────────────────────────
-- 0. Extensions
-- ──────────────────────────
create extension if not exists "uuid-ossp";

-- ──────────────────────────
-- 1. Profiles (extends auth.users)
-- ──────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────────────
-- 2. Categories
-- ──────────────────────────
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image_url text,
  description text,
  position integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 3. Brands
-- ──────────────────────────
create table if not exists public.brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo_url text,
  description text,
  position integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 4. Products
-- ──────────────────────────
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  sku text,
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  stock integer default 0,
  is_featured boolean default false,
  is_bestseller boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────
-- 5. Product Images
-- ──────────────────────────
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  position integer default 0,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 6. Product Variants
-- ──────────────────────────
create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(10,2),
  compare_price numeric(10,2),
  stock integer default 0,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 7. Product Flavours
-- ──────────────────────────
create table if not exists public.product_flavours (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 8. Product Sizes
-- ──────────────────────────
create table if not exists public.product_sizes (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 9. Orders
-- ──────────────────────────
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  pincode text not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) default 0,
  shipping numeric(10,2) default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────
-- 10. Order Items
-- ──────────────────────────
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  variant_name text,
  flavour text,
  size text,
  quantity integer not null default 1,
  price numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 11. Coupons
-- ──────────────────────────
create table if not exists public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  type text not null default 'percentage'
    check (type in ('percentage','fixed')),
  value numeric(10,2) not null default 0,
  min_order numeric(10,2) default 0,
  max_discount numeric(10,2),
  usage_limit integer,
  used_count integer default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 12. Reviews
-- ──────────────────────────
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null,
  email text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 13. Banners
-- ──────────────────────────
create table if not exists public.banners (
  id uuid primary key default uuid_generate_v4(),
  title text,
  subtitle text,
  image_url text not null,
  cta_text text,
  cta_link text,
  position integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ──────────────────────────
-- 14. Settings (key-value store)
-- ──────────────────────────
create table if not exists public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Default settings
insert into public.settings (key, value) values
  ('whatsapp_number', '919876543210'),
  ('shipping_charges', '50'),
  ('free_shipping_threshold', '999'),
  ('announcement_text', '🔥 Free shipping on orders above ₹999! Use code PURE10 for 10% off')
on conflict (key) do nothing;

-- ──────────────────────────
-- 15. Row Level Security
-- ──────────────────────────

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_flavours enable row level security;
alter table public.product_sizes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.banners enable row level security;
alter table public.settings enable row level security;

-- PROFILES
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admin full access profiles" on public.profiles for all using (public.is_admin());

-- CATEGORIES (public read, admin write)
create policy "Public read categories" on public.categories for select using (true);
create policy "Admin manage categories" on public.categories for all using (public.is_admin());

-- BRANDS (public read, admin write)
create policy "Public read brands" on public.brands for select using (true);
create policy "Admin manage brands" on public.brands for all using (public.is_admin());

-- PRODUCTS (public read active, admin write)
create policy "Public read active products" on public.products for select using (true);
create policy "Admin manage products" on public.products for all using (public.is_admin());

-- PRODUCT_IMAGES (public read, admin write)
create policy "Public read product images" on public.product_images for select using (true);
create policy "Admin manage product images" on public.product_images for all using (public.is_admin());

-- PRODUCT_VARIANTS (public read, admin write)
create policy "Public read product variants" on public.product_variants for select using (true);
create policy "Admin manage product variants" on public.product_variants for all using (public.is_admin());

-- PRODUCT_FLAVOURS (public read, admin write)
create policy "Public read product flavours" on public.product_flavours for select using (true);
create policy "Admin manage product flavours" on public.product_flavours for all using (public.is_admin());

-- PRODUCT_SIZES (public read, admin write)
create policy "Public read product sizes" on public.product_sizes for select using (true);
create policy "Admin manage product sizes" on public.product_sizes for all using (public.is_admin());

-- ORDERS (anyone can insert, admin full access)
create policy "Anyone can create orders" on public.orders for insert with check (true);
create policy "Admin manage orders" on public.orders for all using (public.is_admin());

-- ORDER_ITEMS (anyone can insert, admin full access)
create policy "Anyone can create order items" on public.order_items for insert with check (true);
create policy "Admin manage order items" on public.order_items for all using (public.is_admin());

-- COUPONS (public read active, admin write)
create policy "Public read active coupons" on public.coupons for select using (is_active = true);
create policy "Admin manage coupons" on public.coupons for all using (public.is_admin());

-- REVIEWS (anyone can insert, public read approved, admin full)
create policy "Anyone can submit reviews" on public.reviews for insert with check (true);
create policy "Public read approved reviews" on public.reviews for select using (is_approved = true or public.is_admin());
create policy "Admin manage reviews" on public.reviews for all using (public.is_admin());

-- BANNERS (public read active, admin write)
create policy "Public read active banners" on public.banners for select using (is_active = true or public.is_admin());
create policy "Admin manage banners" on public.banners for all using (public.is_admin());

-- SETTINGS (public read, admin write)
create policy "Public read settings" on public.settings for select using (true);
create policy "Admin manage settings" on public.settings for all using (public.is_admin());

-- ──────────────────────────
-- 16. Storage Buckets
-- ──────────────────────────
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('brand-logos', 'brand-logos', true),
  ('category-images', 'category-images', true),
  ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

-- Storage policies: public read, authenticated upload/delete
create policy "Public read product images bucket" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

create policy "Public read brand logos bucket" on storage.objects
  for select using (bucket_id = 'brand-logos');
create policy "Admin upload brand logos" on storage.objects
  for insert with check (bucket_id = 'brand-logos' and public.is_admin());
create policy "Admin delete brand logos" on storage.objects
  for delete using (bucket_id = 'brand-logos' and public.is_admin());

create policy "Public read category images bucket" on storage.objects
  for select using (bucket_id = 'category-images');
create policy "Admin upload category images" on storage.objects
  for insert with check (bucket_id = 'category-images' and public.is_admin());
create policy "Admin delete category images" on storage.objects
  for delete using (bucket_id = 'category-images' and public.is_admin());

create policy "Public read banner images bucket" on storage.objects
  for select using (bucket_id = 'banner-images');
create policy "Admin upload banner images" on storage.objects
  for insert with check (bucket_id = 'banner-images' and public.is_admin());
create policy "Admin delete banner images" on storage.objects
  for delete using (bucket_id = 'banner-images' and public.is_admin());

-- ──────────────────────────
-- 17. Indexes for performance
-- ──────────────────────────
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_brand on public.products(brand_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_featured on public.products(is_featured) where is_featured = true;
create index if not exists idx_products_bestseller on public.products(is_bestseller) where is_bestseller = true;
create index if not exists idx_products_active on public.products(is_active) where is_active = true;
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_approved on public.reviews(is_approved) where is_approved = true;

-- Full text search on products
alter table public.products add column if not exists fts tsvector
  generated always as (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(short_description,''))) stored;
create index if not exists idx_products_fts on public.products using gin(fts);

-- ──────────────────────────
-- 18. Updated_at trigger
-- ──────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at before update on public.products
  for each row execute function public.update_updated_at();
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.update_updated_at();
create trigger trg_settings_updated_at before update on public.settings
  for each row execute function public.update_updated_at();
