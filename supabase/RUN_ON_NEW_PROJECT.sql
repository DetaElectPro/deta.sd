-- ===================================================================
-- RUN THIS ONCE in Dashboard > SQL Editor > New query > paste > Run.
-- Creates schema (21 tables + RLS + buckets + ar/en seed) then all site data.
-- Idempotent: safe to re-run. Expect final row: BOOTSTRAP + SEED OK.
-- ===================================================================
-- ===================================================================
-- BOOTSTRAP: rebuild full schema on a FRESH Supabase project
-- Generated from src/integrations/supabase/types.ts (source of truth).
-- Run ONCE in Dashboard > SQL Editor, BEFORE the other migration files:
--   1) this file
--   2) supabase_complete_migration.sql
--   3) supabase/migrations/complete_order_form_migration.sql
--   4) supabase/migrations/add_image_path_to_articles.sql
-- All statements are idempotent (IF NOT EXISTS) â€” safe to re-run.
-- ===================================================================

-- Extensions -----------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper: updated_at trigger -------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper used by RLS policies (matches generated types) ----------------
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT auth.uid()::text;
$$;

-- Base tables (no dependencies) ----------------------------------------

CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_rtl BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_local BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_local BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  image_path TEXT,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS background_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  file_path TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size_bytes INTEGER,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dependent tables ------------------------------------------------------

CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  state_ar TEXT NOT NULL,
  state_en TEXT NOT NULL,
  is_capital BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  port_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  image_url TEXT,
  price NUMERIC,
  price_per_unit NUMERIC,
  min_order_quantity INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  export_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  company_name TEXT,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  port_id UUID REFERENCES ports(id) ON DELETE SET NULL,
  delivery_method_id UUID REFERENCES delivery_methods(id) ON DELETE SET NULL,
  language_code TEXT REFERENCES languages(code) ON DELETE SET NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  total_amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC,
  total_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS article_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE (article_id, language_code)
);

CREATE TABLE IF NOT EXISTS product_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE (product_id, language_code)
);

CREATE TABLE IF NOT EXISTS category_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE (category_id, language_code)
);

CREATE TABLE IF NOT EXISTS site_setting_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE (setting_key, language_code)
);

-- updated_at triggers ----------------------------------------------------
DROP TRIGGER IF EXISTS trg_articles_updated_at ON articles;
CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS --------------------------------------------------------------------
-- Content catalog: public read, writes for signed-in users (admin flows).
-- Guest flows (order checkout, tracking, page views): anon insert+select.

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_setting_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'languages','countries','delivery_methods','units','categories',
    'category_translations','articles','article_translations','products',
    'product_translations','cities','ports','background_images',
    'site_settings','site_setting_translations','media'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read" ON %I', t);
    EXECUTE format('CREATE POLICY "Public read" ON %I FOR SELECT USING (true)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated write" ON %I', t);
    EXECUTE format('CREATE POLICY "Authenticated write" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;

  FOREACH t IN ARRAY ARRAY['orders','order_items','order_messages','page_views'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Guest insert" ON %I', t);
    EXECUTE format('CREATE POLICY "Guest insert" ON %I FOR INSERT WITH CHECK (true)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Guest read" ON %I', t);
    EXECUTE format('CREATE POLICY "Guest read" ON %I FOR SELECT USING (true)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated write" ON %I', t);
    EXECUTE format('CREATE POLICY "Authenticated write" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;

  DROP POLICY IF EXISTS "Public read" ON profiles;
  CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Authenticated write" ON profiles;
  CREATE POLICY "Authenticated write" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
END
$$;

-- Storage buckets ----------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('background-images', 'background-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read" ON storage.objects;
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated write" ON storage.objects;
CREATE POLICY "Authenticated write" ON storage.objects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed data ------------------------------------------------------------------
INSERT INTO languages (code, name, native_name, is_default, is_rtl)
VALUES
  ('ar', 'Arabic', 'ط§ظ„ط¹ط±ط¨ظٹط©', true, true),
  ('en', 'English', 'English', false, false)
ON CONFLICT (code) DO NOTHING;

SELECT 'bootstrap OK' AS status;

-- ===================================================================
-- SEED: real company data (all tables) - assembled from _parts/
-- Run AFTER 0_bootstrap_schema.sql in Dashboard > SQL Editor.
-- Image URLs assume files uploaded to Storage (see plan).
-- Idempotent: safe to re-run.
-- ===================================================================
-- ============================================
-- 01_lookups.sql â€” ط¨ظٹط§ظ†ط§طھ ط§ظ„ط£ط³ط§ط³: ظˆط­ط¯ط§طھطŒ ط·ط±ظ‚ ط§ظ„طھط³ظ„ظٹظ…طŒ ط¯ظˆظ„طŒ ظ…ط¯ظ†طŒ ظ…ظˆط§ظ†ط¦طŒ ظپط¦ط§طھ
-- ط¬ط¯ط§ظˆظ„ lookups + categories â€” ط¢ظ…ظ† ظ„ظ„طھظƒط±ط§ط± (idempotent)
-- ظٹظپطھط±ط¶ ط£ظ† bootstrap ط£ظ†ط´ط£ ط§ظ„ط¬ط¯ط§ظˆظ„ ط§ظ„ظ€ 21 + RLS ظ…ط³ط¨ظ‚ط§ظ‹
-- ط§ظ„طھط±طھظٹط¨: units â†’ delivery_methods â†’ countries â†’ cities â†’ ports â†’ categories â†’ category_translations
-- ============================================

-- ---------- 1) units: ظˆط­ط¯ط§طھ ط§ظ„ظ‚ظٹط§ط³ (5) ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظˆط­ط¯ط§طھ ط­ط³ط¨ ط§ظ„ظƒظˆط¯ â€” طھط¬ط§ظ‡ظ„ ط§ظ„ظ…ظˆط¬ظˆط¯
INSERT INTO units (code, name_ar, name_en) VALUES
  ('MT', 'ط·ظ†', 'Metric Ton'),
  ('KG', 'ظƒظٹظ„ظˆط؛ط±ط§ظ…', 'Kilogram'),
  ('BAG25', 'ط´ظˆط§ظ„ 25 ظƒط؛', '25kg Bag'),
  ('BAG50', 'ط´ظˆط§ظ„ 50 ظƒط؛', '50kg Bag'),
  ('CTN20', 'ط­ط§ظˆظٹط© 20 ظ‚ط¯ظ…', '20ft Container')
ON CONFLICT (code) DO NOTHING;

-- ---------- 2) delivery_methods: ط·ط±ظ‚ ط§ظ„طھط³ظ„ظٹظ… (5) ----------
-- ط¥ط¯ط®ط§ظ„ ط·ط±ظ‚ ط§ظ„طھط³ظ„ظٹظ… ط­ط³ط¨ ط§ظ„ظƒظˆط¯ â€” طھط¬ط§ظ‡ظ„ ط§ظ„ظ…ظˆط¬ظˆط¯
INSERT INTO delivery_methods (code, name_ar, name_en) VALUES
  ('EXW', 'طھط³ظ„ظٹظ… ظ…طµظ†ط¹', 'Ex-Works'),
  ('FOB', 'طھط³ظ„ظٹظ… ط¸ظ‡ط± ط§ظ„ط³ظپظٹظ†ط©', 'Free on Board'),
  ('CFR', 'ط§ظ„طھظƒظ„ظپط© ظˆط§ظ„ط´ط­ظ†', 'Cost and Freight'),
  ('CIF', 'ط§ظ„طھظƒظ„ظپط© ظˆط§ظ„طھط£ظ…ظٹظ† ظˆط§ظ„ط´ط­ظ†', 'Cost Insurance Freight'),
  ('AIR', 'ط´ط­ظ† ط¬ظˆظٹ', 'Air Freight')
ON CONFLICT (code) DO NOTHING;

-- ---------- 3) countries: ط§ظ„ط¯ظˆظ„ (9) ----------
-- ط§ظ„ط³ظˆط¯ط§ظ† ط¯ظˆظ„ط© ظ…ط­ظ„ظٹط© is_local=true â€” طھط¬ط§ظ‡ظ„ ط§ظ„ظ…ظˆط¬ظˆط¯ ط­ط³ط¨ ط§ظ„ظƒظˆط¯
INSERT INTO countries (code, name_ar, name_en, is_local) VALUES
  ('SD', 'ط§ظ„ط³ظˆط¯ط§ظ†', 'Sudan', true),
  ('EG', 'ظ…طµط±', 'Egypt', false),
  ('SA', 'ط§ظ„ط³ط¹ظˆط¯ظٹط©', 'Saudi Arabia', false),
  ('AE', 'ط§ظ„ط¥ظ…ط§ط±ط§طھ', 'UAE', false),
  ('CN', 'ط§ظ„طµظٹظ†', 'China', false),
  ('TR', 'طھط±ظƒظٹط§', 'Turkey', false),
  ('IN', 'ط§ظ„ظ‡ظ†ط¯', 'India', false),
  ('JO', 'ط§ظ„ط£ط±ط¯ظ†', 'Jordan', false),
  ('DE', 'ط£ظ„ظ…ط§ظ†ظٹط§', 'Germany', false)
ON CONFLICT (code) DO NOTHING;

-- ---------- 4) cities: ط§ظ„ظ…ط¯ظ† (12) ----------
-- ط¥ط¯ط®ط§ظ„ ط¬ظ…ط§ط¹ظٹ â€” ظ„ط§ ظٹط¯ط®ظ„ ط´ظٹط¦ط§ظ‹ ط¥ط°ط§ ظƒط§ظ† ط§ظ„ط¬ط¯ظˆظ„ ط؛ظٹط± ظپط§ط±ط؛
INSERT INTO cities (country_id, name_ar, name_en, state_ar, state_en, is_capital)
SELECT * FROM (VALUES
  ((SELECT id FROM countries WHERE code = 'SD'), 'ط§ظ„ط®ط±ط·ظˆظ…', 'Khartoum', 'ظˆظ„ط§ظٹط© ط§ظ„ط®ط±ط·ظˆظ…', 'Khartoum State', true),
  ((SELECT id FROM countries WHERE code = 'SD'), 'ط£ظ… ط¯ط±ظ…ط§ظ†', 'Omdurman', 'ظˆظ„ط§ظٹط© ط§ظ„ط®ط±ط·ظˆظ…', 'Khartoum State', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'ط¨ظˆط±طھط³ظˆط¯ط§ظ†', 'Port Sudan', 'ط§ظ„ط¨ط­ط± ط§ظ„ط£ط­ظ…ط±', 'Red Sea', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'ط§ظ„ط£ط¨ظٹط¶', 'El Obeid', 'ط´ظ…ط§ظ„ ظƒط±ط¯ظپط§ظ†', 'North Kordofan', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'ظˆط¯ ظ…ط¯ظ†ظٹ', 'Wad Medani', 'ط§ظ„ط¬ط²ظٹط±ط©', 'Gezira', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'ط§ظ„ظ‚ط¶ط§ط±ظپ', 'Gedaref', 'ط§ظ„ظ‚ط¶ط§ط±ظپ', 'Gedaref', false),
  ((SELECT id FROM countries WHERE code = 'EG'), 'ط§ظ„ظ‚ط§ظ‡ط±ط©', 'Cairo', 'ط§ظ„ظ‚ط§ظ‡ط±ط©', 'Cairo', false),
  ((SELECT id FROM countries WHERE code = 'SA'), 'ط¬ط¯ط©', 'Jeddah', 'ظ…ظƒط©', 'Makkah', false),
  ((SELECT id FROM countries WHERE code = 'AE'), 'ط¯ط¨ظٹ', 'Dubai', 'ط¯ط¨ظٹ', 'Dubai', false),
  ((SELECT id FROM countries WHERE code = 'CN'), 'ظ‚ظˆط§ظ†ط؛طھط´ظˆ', 'Guangzhou', 'ظ‚ظˆط§ظ†ط؛ط¯ظˆظ†ط؛', 'Guangdong', false),
  ((SELECT id FROM countries WHERE code = 'TR'), 'ط¥ط³ط·ظ†ط¨ظˆظ„', 'Istanbul', 'ط¥ط³ط·ظ†ط¨ظˆظ„', 'Istanbul', false),
  ((SELECT id FROM countries WHERE code = 'IN'), 'ظ…ظˆظ…ط¨ط§ظٹ', 'Mumbai', 'ظ…ط§ظ‡ط§ط±ط§ط´طھط±ط§', 'Maharashtra', false)
) AS s(country_id, name_ar, name_en, state_ar, state_en, is_capital)
WHERE NOT EXISTS (SELECT 1 FROM cities);

-- ---------- 5) ports: ط§ظ„ظ…ظˆط§ظ†ط¦ (5) ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظˆط§ظ†ط¦ ط­ط³ط¨ ط§ظ„ظƒظˆط¯ â€” طھط¬ط§ظ‡ظ„ ط§ظ„ظ…ظˆط¬ظˆط¯
INSERT INTO ports (country_id, code, name_ar, name_en, port_type, is_active) VALUES
  ((SELECT id FROM countries WHERE code = 'SD'), 'PZU', 'ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†', 'Port Sudan', 'sea', true),
  ((SELECT id FROM countries WHERE code = 'SD'), 'SWK', 'ظ…ظٹظ†ط§ط، ط³ظˆط§ظƒظ†', 'Suakin Seaport', 'sea', true),
  ((SELECT id FROM countries WHERE code = 'SD'), 'KRT', 'ط§ظ„ظ…ظٹظ†ط§ط، ط§ظ„ط¬ط§ظپ ط¨ط§ظ„ط®ط±ط·ظˆظ…', 'Khartoum Dry Port', 'dry', true),
  ((SELECT id FROM countries WHERE code = 'AE'), 'JEA', 'ظ…ظٹظ†ط§ط، ط¬ط¨ظ„ ط¹ظ„ظٹ', 'Jebel Ali Port', 'sea', true),
  ((SELECT id FROM countries WHERE code = 'SA'), 'JED', 'ظ…ظٹظ†ط§ط، ط¬ط¯ط© ط§ظ„ط¥ط³ظ„ط§ظ…ظٹ', 'Jeddah Islamic Port', 'sea', true)
ON CONFLICT (code) DO NOTHING;

-- ---------- 6) categories: ط§ظ„ظپط¦ط§طھ (4) ط¨ظ…ط¹ط±ظپط§طھ ط«ط§ط¨طھط© ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظپط¦ط©: oil-seeds â€” ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط²ظٹطھظٹط©
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000001', 'oil-seeds', 'ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط²ظٹطھظٹط©', 'ط­ط¨ظˆط¨ ط²ظٹطھظٹط© ط³ظˆط¯ط§ظ†ظٹط© ظپط§ط®ط±ط© ظ…ط«ظ„ ط§ظ„ط³ظ…ط³ظ… ظˆط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط¨ظ…ظˆط§طµظپط§طھ طھطµط¯ظٹط±ظٹط© ظ…ط¹طھظ…ط¯ط©.', '#2D5016'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000001');

-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظپط¦ط©: gums â€” ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000002', 'gums', 'ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ', 'طµظ…ط؛ ط¹ط±ط¨ظٹ ط³ظˆط¯ط§ظ†ظٹ ط£طµظٹظ„ ظ…ظ† ظƒط±ط¯ظپط§ظ† ط¨ط£ظ†ظˆط§ط¹ ط§ظ„ظ‡ط´ط§ط¨ ظˆط§ظ„ط·ظ„ط­ ط¨ط¬ظˆط¯ط© ط¹ط§ظ„ظ…ظٹط© ظ„ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط© ظˆط§ظ„ط¯ظˆط§ط¦ظٹط©.', '#D4AF37'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000002');

-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظپط¦ط©: oils â€” ط§ظ„ط²ظٹظˆطھ ط§ظ„ط؛ط°ط§ط¦ظٹط©
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000003', 'oils', 'ط§ظ„ط²ظٹظˆطھ ط§ظ„ط؛ط°ط§ط¦ظٹط©', 'ط²ظٹظˆطھ ط؛ط°ط§ط¦ظٹط© ظ†ظ‚ظٹط© ظ…ط¹طµظˆط±ط© ظ…ظ† ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¨ط¬ظˆط¯ط© ط¹ط§ظ„ظٹط© ظˆظ…ظ†ط§ط³ط¨ط© ظ„ظ„ط§ط³طھظ‡ظ„ط§ظƒ ظˆط§ظ„طھطµط¯ظٹط±.', '#4A7C59'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000003');

-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظپط¦ط©: grains â€” ط§ظ„ط­ط¨ظˆط¨ ظˆط§ظ„ط¨ظ‚ظˆظ„ظٹط§طھ
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000004', 'grains', 'ط§ظ„ط­ط¨ظˆط¨ ظˆط§ظ„ط¨ظ‚ظˆظ„ظٹط§طھ', 'ط­ط¨ظˆط¨ ظˆط¨ظ‚ظˆظ„ظٹط§طھ ط³ظˆط¯ط§ظ†ظٹط© ظ…طھظ†ظˆط¹ط© ط¨ط¬ظˆط¯ط© طھطµط¯ظٹط±ظٹط© ظ…ظˆط«ظˆظ‚ط© ظˆظ…ظ†ط§ط³ط¨ط© ظ„ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.', '#8B4513'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000004');

-- ---------- 7) category_translations: طھط±ط¬ظ…ط§طھ ط§ظ„ظپط¦ط§طھ (8 = 4 أ— ط¹ط±ط¨ظٹ+ط¥ظ†ط¬ظ„ظٹط²ظٹ) ----------
-- طھط±ط¬ظ…ط§طھ ط§ظ„ظپط¦ط§طھ ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ â€” طھط¬ط§ظ‡ظ„ ط§ظ„ظ…ظˆط¬ظˆط¯ ط­ط³ط¨ (category_id, language_code)
INSERT INTO category_translations (category_id, language_code, name, slug, description) VALUES
  ('10000000-0000-4000-8000-000000000001', 'ar', 'ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط²ظٹطھظٹط©', 'oil-seeds', 'ط­ط¨ظˆط¨ ط²ظٹطھظٹط© ط³ظˆط¯ط§ظ†ظٹط© ظپط§ط®ط±ط© ظ…ط«ظ„ ط§ظ„ط³ظ…ط³ظ… ظˆط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظˆط²ظ‡ط±ط© ط§ظ„ط´ظ…ط³طŒ ط¨ظ…ظˆط§طµظپط§طھ طھطµط¯ظٹط±ظٹط© ظ…ط¹طھظ…ط¯ط© ظˆظ†ظ‚ط§ظˆط© ط¹ط§ظ„ظٹط©.'),
  ('10000000-0000-4000-8000-000000000001', 'en', 'Oil Seeds', 'oil-seeds', 'Premium Sudanese oil seeds such as sesame, groundnuts and sunflower, with certified export specifications and high purity.'),
  ('10000000-0000-4000-8000-000000000002', 'ar', 'ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ', 'gums', 'طµظ…ط؛ ط¹ط±ط¨ظٹ ط³ظˆط¯ط§ظ†ظٹ ط£طµظٹظ„ ظ…ظ† ظƒط±ط¯ظپط§ظ† ط¨ط£ظ†ظˆط§ط¹ ط§ظ„ظ‡ط´ط§ط¨ ظˆط§ظ„ط·ظ„ط­طŒ ظ…ظ†ظ‚ظ‰ ط¨ط¹ظ†ط§ظٹط© ظˆط°ظˆ ط°ظˆط¨ط§ظ†ظٹط© ظ…ظ…طھط§ط²ط© ظ„ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط© ظˆط§ظ„ط¯ظˆط§ط¦ظٹط©.'),
  ('10000000-0000-4000-8000-000000000002', 'en', 'Gum Arabic', 'gums', 'Authentic Sudanese gum arabic from Kordofan, Hashab and Talha grades, carefully cleaned with excellent solubility for food and pharmaceutical industries.'),
  ('10000000-0000-4000-8000-000000000003', 'ar', 'ط§ظ„ط²ظٹظˆطھ ط§ظ„ط؛ط°ط§ط¦ظٹط©', 'oils', 'ط²ظٹظˆطھ ط؛ط°ط§ط¦ظٹط© ظ†ظ‚ظٹط© ظ…ط¹طµظˆط±ط© ظ…ظ† ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¨ط¬ظˆط¯ط© ط¹ط§ظ„ظٹط©طŒ ظ…ظ†ط§ط³ط¨ط© ظ„ظ„ط§ط³طھظ‡ظ„ط§ظƒ ط§ظ„ظ…ط­ظ„ظٹ ظˆط§ظ„طھطµط¯ظٹط± ظ„ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.'),
  ('10000000-0000-4000-8000-000000000003', 'en', 'Edible Oils', 'oils', 'Pure edible oils pressed from Sudanese seeds with high quality, suitable for consumption and export to global markets.'),
  ('10000000-0000-4000-8000-000000000004', 'ar', 'ط§ظ„ط­ط¨ظˆط¨ ظˆط§ظ„ط¨ظ‚ظˆظ„ظٹط§طھ', 'grains', 'ط­ط¨ظˆط¨ ظˆط¨ظ‚ظˆظ„ظٹط§طھ ط³ظˆط¯ط§ظ†ظٹط© ظ…طھظ†ظˆط¹ط© ط¨ط¬ظˆط¯ط© طھطµط¯ظٹط±ظٹط© ظ…ظˆط«ظˆظ‚ط©طŒ ظ…ظ†ط§ط³ط¨ط© ظ„ظ„ظ…ط·ط§ط­ظ† ظˆظ…طµط§ظ†ط¹ ط§ظ„ط£ط؛ط°ظٹط© ظˆط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.'),
  ('10000000-0000-4000-8000-000000000004', 'en', 'Grains & Legumes', 'grains', 'Diverse Sudanese grains and legumes with reliable export quality, suitable for mills, food factories and global markets.')
ON CONFLICT (category_id, language_code) DO NOTHING;
 -- ============================================
-- 02_products_a.sql â€” ظ…ظ†طھط¬ط§طھ ط§ظ„ط²ظٹظˆطھ ظˆط§ظ„طµظ…ط؛ (6 ظ…ظ†طھط¬ط§طھ)
-- ط¬ط¯ظˆظ„ products + product_translations â€” ط¢ظ…ظ† ظ„ظ„طھظƒط±ط§ط± (idempotent)
-- ط§ظ„ط£ط³ط¹ط§ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†
-- ============================================

-- ---------- 1) ط³ظ…ط³ظ… ط·ط¨ظٹط¹ظٹ ظپط§ط®ط± (ط§ظ„ظ‚ط¶ط§ط±ظپ) ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظ†طھط¬: sesame-natural-gadaref
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-natural-gadaref.jpg',
  1620, 1620, 19, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000001');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ†طھط¬: ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000001', 'ar', 'ط³ظ…ط³ظ… ط·ط¨ظٹط¹ظٹ ظپط§ط®ط± (ط§ظ„ظ‚ط¶ط§ط±ظپ)', 'ط³ظ…ط³ظ… ط·ط¨ظٹط¹ظٹ ظپط§ط®ط± ظ…ظ† ط§ظ„ظ‚ط¶ط§ط±ظپطŒ ط§ظ„ط³ظˆط¯ط§ظ†طŒ ط¨ط¯ط±ط¬ط© ظ†ظ‚ط§ظˆط© 99/1 ظˆط±ط·ظˆط¨ط© ط£ظ‚ظ„ ظ…ظ† 6% ظˆظ†ط³ط¨ط© ط²ظٹطھ ط¹ط§ظ„ظٹط©طŒ ظ…ط«ط§ظ„ظٹ ظ„ظ„ط¹طµط± ظˆط¥ظ†طھط§ط¬ ط§ظ„ط·ط­ظٹظ†ط©. ظ…ط¹ط¨ط£ ظپظٹ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25/50 ظƒط؛طŒ ظˆظ…ظ†ط§ط³ط¨ ظ„ظ„طھطµط¯ظٹط± ط¨ظƒظ…ظٹط§طھ ط§ظ„ط­ط§ظˆظٹط§طھ. ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† - ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'sesame-natural-gadaref'),
('20000000-0000-4000-8000-000000000001', 'en', 'Premium Natural Sesame (Gedaref)', 'Premium natural sesame from Gedaref, Sudan, with 99/1 purity, below 6% moisture and high oil content, ideal for pressing and tahini production. Packed in 25/50kg PP bags, suitable for container export. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'sesame-natural-gadaref')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 2) ط³ظ…ط³ظ… ظ…ظ‚ط´ظˆط± ظ…ظ…طھط§ط² ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظ†طھط¬: sesame-hulled-premium
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000001',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-premium.jpg',
  1150, 1150, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000002');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ†طھط¬: ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000002', 'ar', 'ط³ظ…ط³ظ… ظ…ظ‚ط´ظˆط± ظ…ظ…طھط§ط² 99.95%', 'ط³ظ…ط³ظ… ظ…ظ‚ط´ظˆط± ظ…ظ…طھط§ط² ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† ط¨ظ†ط³ط¨ط© ظ†ظ‚ط§ظˆط© 99.95% ظˆط±ط·ظˆط¨ط© ط£ظ‚ظ„ ظ…ظ† 5%طŒ ظ…ط«ط§ظ„ظٹ ظ„طµظ†ط§ط¹ط© ط§ظ„ط·ط­ظٹظ†ط© ظˆط§ظ„ط­ظ„ط§ظˆط© ظˆط§ظ„ظ…ط®ط§ط¨ط². ظ…ط¹ط¨ط£ ظپظٹ ط£ظƒظٹط§ط³ PP ط؛ط°ط§ط¦ظٹط© ط¨ظˆط²ظ† 25/50 ظƒط؛ ط¨ط¬ظˆط¯ط© طھطµط¯ظٹط±ظٹط©. ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† - ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'sesame-hulled-premium'),
('20000000-0000-4000-8000-000000000002', 'en', 'Premium Hulled Sesame 99.95%', 'Premium hulled sesame from Sudan with 99.95% purity and below 5% moisture, ideal for tahini, halawa and bakery. Packed in food-grade 25/50kg PP bags with export quality. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'sesame-hulled-premium')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 3) ط³ظ…ط³ظ… ظ…ظ‚ط´ظˆط± ظ‚ظٹط§ط³ظٹ ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظ†طھط¬: sesame-hulled-standard
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000001',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-standard.jpg',
  930, 930, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000003');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ†طھط¬: ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000003', 'ar', 'ط³ظ…ط³ظ… ظ…ظ‚ط´ظˆط± ظ‚ظٹط§ط³ظٹ', 'ط³ظ…ط³ظ… ظ…ظ‚ط´ظˆط± ظ‚ظٹط§ط³ظٹ ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† ط¨ظ…ظˆط§طµظپط§طھ طھطµط¯ظٹط±ظٹط© ظ…ط³طھظ‚ط±ط© ظˆط±ط·ظˆط¨ط© ظ…ظ†ط®ظپط¶ط©طŒ ظ…ظ†ط§ط³ط¨ ظ„ظ„ظ…ط·ط§ط­ظ† ظˆظ…طµط§ظ†ط¹ ط§ظ„ط£ط؛ط°ظٹط©. ظ…ط¹ط¨ط£ ظپظٹ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25/50 ظƒط؛. ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† - ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'sesame-hulled-standard'),
('20000000-0000-4000-8000-000000000003', 'en', 'Standard Hulled Sesame', 'Standard hulled sesame from Sudan with stable export specs and low moisture, suitable for mills and food factories. Packed in 25/50kg PP bags. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'sesame-hulled-standard')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 4) طµظ…ط؛ ظ‡ط´ط§ط¨ ظ…ظ†ظ‚ظ‰ ظٹط¯ظˆظٹط§ظ‹ ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظ†طھط¬: gum-hashab-handpicked
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000002',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-hashab-handpicked.jpg',
  3200, 3200, 19, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000004');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ†طھط¬: ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000004', 'ar', 'طµظ…ط؛ ظ‡ط´ط§ط¨ ظ…ظ†ظ‚ظ‰ ظٹط¯ظˆظٹط§ظ‹', 'طµظ…ط؛ ظ‡ط´ط§ط¨ (ط£ظƒط§ط³ظٹط§ ط³ظ†ط؛ط§ظ„) ظ…ظ† ظƒط±ط¯ظپط§ظ†طŒ ط§ظ„ط³ظˆط¯ط§ظ†طŒ ظ…ظ†ظ‚ظ‰ ظٹط¯ظˆظٹط§ظ‹ ط¨ط¯ط±ط¬ط© ظ†ظ‚ط§ظˆط© ط¹ط§ظ„ظٹط© ظˆط°ظˆط¨ط§ظ†ظٹط© ظ…ظ…طھط§ط²ط© ظ„ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط© ظˆط§ظ„ط¯ظˆط§ط¦ظٹط©. ظ…ط¹ط¨ط£ ظپظٹ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25/50 ظƒط؛. ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† - ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'gum-hashab-handpicked'),
('20000000-0000-4000-8000-000000000004', 'en', 'Hand-Picked Hashab Gum Arabic', 'Hand-picked Hashab gum arabic (Acacia Senegal) from Kordofan, Sudan, with high purity and excellent solubility for food and pharmaceutical industries. Packed in 25/50kg PP bags. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'gum-hashab-handpicked')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 5) طµظ…ط؛ ط·ظ„ط­ ط³ظˆط¯ط§ظ†ظٹ ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظ†طھط¬: gum-talha
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000005',
  '10000000-0000-4000-8000-000000000002',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-talha.jpg',
  2600, 2600, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000005');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ†طھط¬: ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000005', 'ar', 'طµظ…ط؛ ط·ظ„ط­ ط³ظˆط¯ط§ظ†ظٹ', 'طµظ…ط؛ ط·ظ„ط­ ط³ظˆط¯ط§ظ†ظٹ (ط£ظƒط§ط³ظٹط§ ط³ظٹط§ظ„) ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ†طŒ ظ…ظ†ط§ط³ط¨ ظ„طھط·ط¨ظٹظ‚ط§طھ ط§ظ„ط£ط؛ط°ظٹط© ظˆط§ظ„ط£ط¹ظ„ط§ظپ ظˆط§ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ظƒظٹظ…ظٹط§ط¦ظٹط© ط¨ظ…ظˆط§طµظپط§طھ طھطµط¯ظٹط±ظٹط© ظ…ظˆط«ظˆظ‚ط©. ظ…ط¹ط¨ط£ ظپظٹ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25/50 ظƒط؛. ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† - ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'gum-talha'),
('20000000-0000-4000-8000-000000000005', 'en', 'Talha Gum Arabic', 'Sudanese Talha gum arabic (Acacia Seyal) from Sudan, suitable for food, feed and industrial applications with reliable export specs. Packed in 25/50kg PP bags. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'gum-talha')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 6) طµظ…ط؛ ط¹ط±ط¨ظٹ ط¨ظˆط¯ط±ط© ظ…ط¬ظپظپط© ط¨ط§ظ„ط±ط°ط§ط° ----------
-- ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ظ†طھط¬: gum-powder-spray-dried
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000002',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-powder-spray-dried.jpg',
  4200, 4200, 5, true, false, true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000006');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ†طھط¬: ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000006', 'ar', 'طµظ…ط؛ ط¹ط±ط¨ظٹ ط¨ظˆط¯ط±ط© ظ…ط¬ظپظپط© ط¨ط§ظ„ط±ط°ط§ط°', 'ط¨ظˆط¯ط±ط© طµظ…ط؛ ط¹ط±ط¨ظٹ ظ…ط¬ظپظپط© ط¨ط§ظ„ط±ط°ط§ط° ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† ط¨ط¯ط±ط¬ط© mesh ظ†ط§ط¹ظ…ط© ظˆط°ظˆط¨ط§ظ†ظٹط© ظپظˆط±ظٹط©طŒ ظ…ط®طµطµط© ظ„ظ„ظ…ط´ط±ظˆط¨ط§طھ ظˆط§ظ„ط­ظ„ظˆظٹط§طھ ظˆظ…ظ†طھط¬ط§طھ ط§ظ„ط£ظ„ط¨ط§ظ†. ظ…ط¹ط¨ط£ط© ظپظٹ ط£ظƒظٹط§ط³ 25 ظƒط؛ ظ…ط¹ ط¨ط·ط§ظ†ط© ط؛ط°ط§ط¦ظٹط©. ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† - ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'gum-powder-spray-dried'),
('20000000-0000-4000-8000-000000000006', 'en', 'Spray-Dried Gum Arabic Powder', 'Spray-dried gum arabic powder from Sudan with fine mesh and instant solubility, for beverages, confectionery and dairy. Packed in 25kg bags with food-grade liner. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'gum-powder-spray-dried')
ON CONFLICT (product_id, language_code) DO NOTHING;
 -- 03_products_b.sql
-- ط§ظ„ط¬ط²ط، ط§ظ„ط«ط§ظ†ظٹ ظ…ظ† ط§ظ„ظ…ظ†طھط¬ط§طھ (6 ظ…ظ†طھط¬ط§طھ: 7..12) â€” ط¢ظ…ظ† ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط´ط؛ظٹظ„
-- ط§ظ„ط¹ظ…ظ„ط©: ط¯ظˆظ„ط§ط± ط£ظ…ط±ظٹظƒظٹ ظ„ظ„ط·ظ† ط§ظ„ظ…طھط±ظٹ FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†
-- ط§ظ„ظˆط­ط¯ط©: MT â€” ط§ظ„ظپط¦ط§طھ ظˆط§ظ„ظˆط­ط¯ط§طھ ط«ط§ط¨طھط© ظ…ط³ط¨ظ‚ط§

-- 7) ظپظˆظ„ ط³ظˆط¯ط§ظ†ظٹ ط­ط¨ 80/90 â€” ط¨ط°ظˆط± ط²ظٹطھظٹط©
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-kernels-8090.jpg', 1350, 1350, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000007');

-- 8) ظپظˆظ„ ط³ظˆط¯ط§ظ†ظٹ ط¨ظ‚ط´ط±ظ‡ â€” ط¨ط°ظˆط± ط²ظٹطھظٹط©
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-inshell.jpg', 980, 980, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000008');

-- 9) ظƒط±ظƒط¯ظٹظ‡ ط³ظˆط¯ط§ظ†ظٹ ظ…ط¬ظپظپ â€” ط­ط¨ظˆط¨
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000004', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/hibiscus-whole.jpg', 2200, 2200, 10, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000009');

-- 10) ط°ط±ط© ظپطھط±ظٹطھط© ط³ظˆط¯ط§ظ†ظٹط© â€” ط­ط¨ظˆط¨
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000004', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sorghum-feterita.jpg', 430, 430, 20, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000010');

-- 11) ط­ط¨ ط¨ط·ظٹط® (ظ„ط¨) â€” ط­ط¨ظˆط¨
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000004', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/watermelon-seeds.jpg', 2400, 2400, 10, true, false, true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000011');

-- 12) ط²ظٹطھ ط³ظ…ط³ظ… ظ…ط¹طµظˆط± ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ â€” ط²ظٹظˆطھ
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000003', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-oil-cold-pressed.jpg', 3400, 3400, 5, true, true, true, false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000012');

-- ط§ظ„طھط±ط¬ظ…ط§طھ (ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظ„ظƒظ„ ظ…ظ†طھط¬) â€” طھط¬ط§ظ‡ظ„ ط§ظ„ظ…ظˆط¬ظˆط¯ ظ…ط³ط¨ظ‚ط§

-- 7) peanut-kernels-8090
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000007', 'ar', 'ظپظˆظ„ ط³ظˆط¯ط§ظ†ظٹ ط­ط¨ 80/90', 'ظپظˆظ„ ط³ظˆط¯ط§ظ†ظٹ ط­ط¨ ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ†ط´ط£ ط¨ط¹ظٹط§ط± 80/90 ط­ط¨ط© ط¨ط§ظ„ط£ظˆظ†طµط©طŒ ظ…ط¬ظپظپ ظˆظ…ظپط±ط² ط¨ط¹ظ†ط§ظٹط© ظ„ظ†ط³ط¨ط© ظƒط³ط± ظ…ظ†ط®ظپط¶ط© ظˆط¬ظˆط¯ط© طھطµط¯ظٹط± ط¹ط§ظ„ظٹط©. ظ…طھظˆظپط± ظ„ظ„طھطµط¯ظٹط± ط¨طھط¹ط¨ط¦ط© 25/50 ظƒط¬ظ…طŒ ط¨ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ 1350 ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'peanut-kernels-8090'),
('20000000-0000-4000-8000-000000000007', 'en', 'Groundnut Kernels 80/90', 'Sudanese-origin groundnut kernels, count 80/90 per ounce, carefully dried and sorted for low breakage and high export quality. Available for export in 25/50 kg bags at an indicative price of USD 1350 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'peanut-kernels-8090')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 8) peanut-inshell
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000008', 'ar', 'ظپظˆظ„ ط³ظˆط¯ط§ظ†ظٹ ط¨ظ‚ط´ط±ظ‡', 'ظپظˆظ„ ط³ظˆط¯ط§ظ†ظٹ ط³ظˆط¯ط§ظ†ظٹ ط¨ظ‚ط´ط±ظ‡ ط¨ط¬ظˆط¯ط© طھطµط¯ظٹط±طŒ ط­ط¨ط§طھ ظ…ظ…طھظ„ط¦ط© ظˆظ…ط¬ظپظپط© ط¬ظٹط¯ط§ ظ…ط¹ ظپط±ط² ط¯ظ‚ظٹظ‚ ظ„ظ„ط£ط­ط¬ط§ظ…. ظ…طھظˆظپط± ظ„ظ„طھطµط¯ظٹط± ط¨طھط¹ط¨ط¦ط© ط´ط§ط¦ط¹ط© 30 ظƒط¬ظ…طŒ ط¨ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ 980 ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'peanut-inshell'),
('20000000-0000-4000-8000-000000000008', 'en', 'In-Shell Groundnuts', 'Sudanese in-shell groundnuts of export quality, well-dried full pods with careful size grading. Available for export in standard 30 kg packing at an indicative price of USD 980 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'peanut-inshell')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 9) hibiscus-whole
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000009', 'ar', 'ظƒط±ظƒط¯ظٹظ‡ ط³ظˆط¯ط§ظ†ظٹ ظ…ط¬ظپظپ', 'ظƒط±ظƒط¯ظٹظ‡ ط³ظˆط¯ط§ظ†ظٹ ظ…ط¬ظپظپ ظƒط§ظ…ظ„ ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ط¨ظ„ظˆظ† ط£ط­ظ…ط± ط؛ط§ظ…ظ‚ ظˆط­ظ…ظˆط¶ط© ط·ط¨ظٹط¹ظٹط© ظ…ظ…ظٹط²ط©طŒ ظ…ظ†ط¸ظپ ظˆظ…ظپط±ط² ظ„ظ„طھطµط¯ظٹط± ط§ظ„ط؛ط°ط§ط¦ظٹ. ظ…طھظˆظپط± ظ„ظ„طھطµط¯ظٹط± ط¨طھط¹ط¨ط¦ط© 25/50 ظƒط¬ظ…طŒ ط¨ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ 2200 ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'hibiscus-whole'),
('20000000-0000-4000-8000-000000000009', 'en', 'Dried Sudanese Hibiscus', 'Whole dried Sudanese hibiscus of premium quality with deep red color and distinctive natural acidity, cleaned and sorted for food export. Available for export in 25/50 kg bags at an indicative price of USD 2200 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'hibiscus-whole')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 10) sorghum-feterita
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000010', 'ar', 'ط°ط±ط© ظپطھط±ظٹطھط© ط³ظˆط¯ط§ظ†ظٹط©', 'ط°ط±ط© ظپطھط±ظٹطھط© ط³ظˆط¯ط§ظ†ظٹط© ط¨ط¬ظˆط¯ط© طھطµط¯ظٹط± ظ„ظ„ط£ط¹ظ„ط§ظپ ظˆط§ظ„ط§ط³طھظ‡ظ„ط§ظƒ ط§ظ„ط؛ط°ط§ط¦ظٹطŒ ظ†ط¸ظٹظپط© ظˆط¬ط§ظپط© ط¨ط±ط·ظˆط¨ط© ظ…ظ†ط§ط³ط¨ط© ظ„ظ„ط´ط­ظ† ط§ظ„ط·ظˆظٹظ„. ظ…طھظˆظپط±ط© ظ„ظ„طھطµط¯ظٹط± ط³ط§ط¦ط¨ ط£ظˆ ط¨طھط¹ط¨ط¦ط© 50 ظƒط¬ظ…طŒ ط¨ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ 430 ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'sorghum-feterita'),
('20000000-0000-4000-8000-000000000010', 'en', 'Sudanese Feterita Sorghum', 'Sudanese Feterita sorghum of export quality for feed and food use, cleaned and dried to safe moisture for long shipment. Available for export in bulk or 50 kg bags at an indicative price of USD 430 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'sorghum-feterita')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 11) watermelon-seeds
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000011', 'ar', 'ط­ط¨ ط¨ط·ظٹط® (ظ„ط¨)', 'ظ„ط¨ ط­ط¨ ط¨ط·ظٹط® ط³ظˆط¯ط§ظ†ظٹ ظ…ط¬ظپظپ ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ظ„ظ„طھط³ط§ظ„ظٹ ظˆط§ظ„طھط­ظ…ظٹطµطŒ ط­ط¨ط§طھ ظƒط¨ظٹط±ط© ظˆظ†ط¸ظٹظپط© ط¨ظپط±ط² ط¯ظ‚ظٹظ‚. ظ…طھظˆظپط± ظ„ظ„طھطµط¯ظٹط± ط¨طھط¹ط¨ط¦ط© 25/50 ظƒط¬ظ…طŒ ط¨ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ 2400 ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'watermelon-seeds'),
('20000000-0000-4000-8000-000000000011', 'en', 'Watermelon Seeds', 'High-quality dried Sudanese watermelon seeds for snacking and roasting, large clean kernels with precise sorting. Available for export in 25/50 kg bags at an indicative price of USD 2400 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'watermelon-seeds')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 12) sesame-oil-cold-pressed
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000012', 'ar', 'ط²ظٹطھ ط³ظ…ط³ظ… ظ…ط¹طµظˆط± ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯', 'ط²ظٹطھ ط³ظ…ط³ظ… ط³ظˆط¯ط§ظ†ظٹ ظ…ط¹طµظˆط± ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ ظ…ظ† ط³ظ…ط³ظ… ط£ط¨ظٹط¶ ظپط§ط®ط±طŒ ط¨ظ†ظƒظ‡ط© ط·ط¨ظٹط¹ظٹط© ط؛ظ†ظٹط© ظ…ظ†ط§ط³ط¨ ظ„ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط؛ط°ط§ط¦ظٹط© ظˆط§ظ„طھط¬ط²ط¦ط©. ظ…طھظˆظپط± ظ„ظ„طھطµط¯ظٹط± ط¨طھط¹ط¨ط¦ط© ط؛ط°ط§ط¦ظٹط© ظ…طھظ†ظˆط¹ط©طŒ ط¨ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ 3400 ط¯ظˆظ„ط§ط± ظ„ظ„ط·ظ† FOB ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط³ط¹ط± ط§ط³طھط±ط´ط§ط¯ظٹ ظٹط«ط¨طھ ط¨ط¹ط±ط¶ ط±ط³ظ…ظٹ.', 'sesame-oil-cold-pressed'),
('20000000-0000-4000-8000-000000000012', 'en', 'Cold-Pressed Sesame Oil', 'Sudanese cold-pressed sesame oil from premium white sesame, rich natural flavor suitable for food and retail markets. Available for export in assorted food-grade packing at an indicative price of USD 3400 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'sesame-oil-cold-pressed')
ON CONFLICT (product_id, language_code) DO NOTHING;
 -- =============================================================
-- ط§ظ„ط¬ط²ط، 04 (ط£): ط§ظ„ظ…ظ‚ط§ظ„ط§طھ â€” ط§ظ„ط¯ظپط¹ط© ط§ظ„ط£ظˆظ„ظ‰ (5 ظ…ظ‚ط§ظ„ط§طھ)
-- ط§ظ„ظ…ظ„ظپ: supabase/migrations/_parts/04_articles_a.sql
-- ط§ظ„ظˆطµظپ: ط¥ط¯ط®ط§ظ„ 5 ظ…ظ‚ط§ظ„ط§طھ ط¨ظ…ط¹ط±ظپط§طھ UUID ط«ط§ط¨طھط© + طھط±ط¬ظ…طھظٹظ† (ar/en) ظ„ظƒظ„ ظ…ظ‚ط§ظ„
-- ظ…ظ„ط§ط­ط¸ط§طھ:
-- - ط§ظ„ظ…ظ„ظپ ط¢ظ…ظ† ظ„ظ„طھظƒط±ط§ط± (idempotent): ط§ظ„ظ…ظ‚ط§ظ„ط§طھ ظ…ط­ظ…ظٹط© ط¨ط´ط±ط· NOT EXISTS
--   ظˆط§ظ„طھط±ط¬ظ…ط§طھ ظ…ط­ظ…ظٹط© ط¨ط´ط±ط· ON CONFLICT DO NOTHING
-- - ط¹ظ†ظˆط§ظ† ط§ظ„ط¬ط¯ظˆظ„ ط§ظ„ط£ط³ط§ط³ظٹ (articles.title) ط¨ط§ظ„ظ„ط؛ط© ط§ظ„ط¹ط±ط¨ظٹط©
-- - ط§ظ„ظ„ط؛طھط§ظ† ar ظˆ en ظ…ظˆط¬ظˆط¯طھط§ظ† ظ…ط³ط¨ظ‚ط§ظ‹ ظپظٹ ط¬ط¯ظˆظ„ ط§ظ„ظ„ط؛ط§طھ
-- - ظ…ط³ط§ط± ط§ظ„طµظˆط±: bucket ط¹ط§ظ… (media) طھط­طھ articles/<slug>.jpg
-- =============================================================

-- -------------------------------------------------------------
-- ط§ظ„ظ…ظ‚ط§ظ„ 1: ظ…ظˆط³ظ… ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ 2026
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000001'::uuid,
  'ظ…ظˆط³ظ… ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ 2026: ط¬ظˆط¯ط© ط¹ط§ظ„ظٹط© ظˆط¬ط§ظ‡ط²ظٹط© ظ„ظ„طھطµط¯ظٹط±',
  'sesame-harvest-2026',
  'ط§ظ†ط·ظ„ظ‚ ظ…ظˆط³ظ… ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ ط¨ظ…ط­طµظˆظ„ ظˆظپظٹط± ظˆط¬ظˆط¯ط© ط§ط³طھط«ظ†ط§ط¦ظٹط©طŒ ظ…ط¹ ط¬ط§ظ‡ط²ظٹط© ظƒط§ظ…ظ„ط© ظ„ظ„طھظ†ط¸ظٹظپ ظˆط§ظ„ظپط±ط² ظˆط§ظ„طھط¹ط¨ط¦ط© ظˆط§ظ„طھطµط¯ظٹط± ط¥ظ„ظ‰ ط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.',
  'ط¨ط¯ط£ ظ…ط²ط§ط±ط¹ظˆ ط§ظ„ظ‚ط¶ط§ط±ظپ ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ط£ط¨ظٹط¶ ظˆط§ظ„ط£ط­ظ…ط± ظˆط³ط· ظ…ط¤ط´ط±ط§طھ ط¥ظٹط¬ط§ط¨ظٹط© ط¹ظ„ظ‰ ط§ظ„ط¥ظ†طھط§ط¬ظٹط© ظˆط§ظ„ط¬ظˆط¯ط©طŒ ط¨ظپط¶ظ„ ط§ظ„ط£ظ…ط·ط§ط± ط§ظ„ظ…ظ†طھط¸ظ…ط© ظˆط§ظ„ظ…طھط§ط¨ط¹ط© ط§ظ„ط­ظ‚ظ„ظٹط© ط§ظ„ط¬ظٹط¯ط© ط®ظ„ط§ظ„ ط§ظ„ظ…ظˆط³ظ… ط§ظ„ط²ط±ط§ط¹ظٹ.

طھط®ط¶ط¹ ط§ظ„ظ…ط­ط§طµظٹظ„ ط¨ط¹ط¯ ط§ظ„ط­طµط§ط¯ ظ„ط¹ظ…ظ„ظٹط§طھ ط§ظ„طھط¬ظپظٹظپ ظˆط§ظ„طھظ†ط¸ظٹظپ ظˆط§ظ„ظپط±ط² ط§ظ„ط¢ظ„ظٹ ظ„ط¶ظ…ط§ظ† ظ†ظ‚ط§ط، ط¹ط§ظ„ ظٹطµظ„ ط¥ظ„ظ‰ 99/1طŒ ظ…ط¹ ظپط­طµ ط¯ظ‚ظٹظ‚ ظ„ظ†ط³ط¨ط© ط§ظ„ط±ط·ظˆط¨ط© ظˆط§ظ„ط´ظˆط§ط¦ط¨ ظ‚ط¨ظ„ ط§ظ„طھط®ط²ظٹظ† ظپظٹ ظ…ط®ط§ط²ظ† ظ…ط¬ظ‡ط²ط© ظˆط¬ظٹط¯ط© ط§ظ„طھظ‡ظˆظٹط©.

ط¬ظ‡ط²طھ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¯ظپط¹ط§طھ طھطµط¯ظٹط±ظٹط© ط¨ظ…ظˆط§طµظپط§طھ طھظ†ط§ط³ط¨ ط£ط³ظˆط§ظ‚ ط§ظ„ط®ظ„ظٹط¬ ظˆط¢ط³ظٹط§طŒ ظ…ط¹ ط®ظٹط§ط±ط§طھ طھط¹ط¨ط¦ط© ظ…طھظ†ظˆط¹ط© ظ…ظ† ط£ظƒظٹط§ط³ ط§ظ„ط¨ظˆظ„ظٹ ط¨ط±ظˆط¨ظ„ظٹظ† ط¥ظ„ظ‰ ط§ظ„طھط¹ط¨ط¦ط© ط§ظ„ظ…ط®طµطµط© ط­ط³ط¨ ط·ظ„ط¨ ط§ظ„ظ…ط´طھط±ظٹطŒ ظˆظپط­طµ ط¬ظˆط¯ط© ظ…ط¹طھظ…ط¯ ظ‚ط¨ظ„ ط§ظ„ط´ط­ظ†.

ظ†ظ†طµط­ ط§ظ„ظ…ط´طھط±ظٹظ† ط¨طھط«ط¨ظٹطھ ط§ط­طھظٹط§ط¬ط§طھظ‡ظ… ظ…ط¨ظƒط±ط§ ط®ظ„ط§ظ„ ط°ط±ظˆط© ط§ظ„ظ…ظˆط³ظ… ظ„ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط£ظپط¶ظ„ ط§ظ„ط£ط³ط¹ط§ط± ظˆط¶ظ…ط§ظ† ط§ط³طھظ…ط±ط§ط±ظٹط© ط§ظ„ط¥ظ…ط¯ط§ط¯ ط­طھظ‰ ظ†ظ‡ط§ظٹط© ط§ظ„ط¹ط§ظ….',
  'ظ…. ظ…ط­ظ…ط¯ ط§ظ„ظپط§طھط­ ط¹ط¨ط¯ ط§ظ„ظ„ظ‡',
  'ط­طµط§ط¯ ظˆظ…ط­ط§طµظٹظ„',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sesame-harvest-2026.jpg',
  'articles/sesame-harvest-2026.jpg',
  true,
  '2026-09-10 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000001'::uuid);

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 1: ط§ظ„ط¹ط±ط¨ظٹط© (ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ط³ط¬ظ„ ط§ظ„ط£ط³ط§ط³ظٹ)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000001'::uuid,
  'ar',
  'ظ…ظˆط³ظ… ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ 2026: ط¬ظˆط¯ط© ط¹ط§ظ„ظٹط© ظˆط¬ط§ظ‡ط²ظٹط© ظ„ظ„طھطµط¯ظٹط±',
  'ط§ظ†ط·ظ„ظ‚ ظ…ظˆط³ظ… ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ ط¨ظ…ط­طµظˆظ„ ظˆظپظٹط± ظˆط¬ظˆط¯ط© ط§ط³طھط«ظ†ط§ط¦ظٹط©طŒ ظ…ط¹ ط¬ط§ظ‡ط²ظٹط© ظƒط§ظ…ظ„ط© ظ„ظ„طھظ†ط¸ظٹظپ ظˆط§ظ„ظپط±ط² ظˆط§ظ„طھط¹ط¨ط¦ط© ظˆط§ظ„طھطµط¯ظٹط± ط¥ظ„ظ‰ ط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.',
  'ط¨ط¯ط£ ظ…ط²ط§ط±ط¹ظˆ ط§ظ„ظ‚ط¶ط§ط±ظپ ط­طµط§ط¯ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ط£ط¨ظٹط¶ ظˆط§ظ„ط£ط­ظ…ط± ظˆط³ط· ظ…ط¤ط´ط±ط§طھ ط¥ظٹط¬ط§ط¨ظٹط© ط¹ظ„ظ‰ ط§ظ„ط¥ظ†طھط§ط¬ظٹط© ظˆط§ظ„ط¬ظˆط¯ط©طŒ ط¨ظپط¶ظ„ ط§ظ„ط£ظ…ط·ط§ط± ط§ظ„ظ…ظ†طھط¸ظ…ط© ظˆط§ظ„ظ…طھط§ط¨ط¹ط© ط§ظ„ط­ظ‚ظ„ظٹط© ط§ظ„ط¬ظٹط¯ط© ط®ظ„ط§ظ„ ط§ظ„ظ…ظˆط³ظ… ط§ظ„ط²ط±ط§ط¹ظٹ.

طھط®ط¶ط¹ ط§ظ„ظ…ط­ط§طµظٹظ„ ط¨ط¹ط¯ ط§ظ„ط­طµط§ط¯ ظ„ط¹ظ…ظ„ظٹط§طھ ط§ظ„طھط¬ظپظٹظپ ظˆط§ظ„طھظ†ط¸ظٹظپ ظˆط§ظ„ظپط±ط² ط§ظ„ط¢ظ„ظٹ ظ„ط¶ظ…ط§ظ† ظ†ظ‚ط§ط، ط¹ط§ظ„ ظٹطµظ„ ط¥ظ„ظ‰ 99/1طŒ ظ…ط¹ ظپط­طµ ط¯ظ‚ظٹظ‚ ظ„ظ†ط³ط¨ط© ط§ظ„ط±ط·ظˆط¨ط© ظˆط§ظ„ط´ظˆط§ط¦ط¨ ظ‚ط¨ظ„ ط§ظ„طھط®ط²ظٹظ† ظپظٹ ظ…ط®ط§ط²ظ† ظ…ط¬ظ‡ط²ط© ظˆط¬ظٹط¯ط© ط§ظ„طھظ‡ظˆظٹط©.

ط¬ظ‡ط²طھ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¯ظپط¹ط§طھ طھطµط¯ظٹط±ظٹط© ط¨ظ…ظˆط§طµظپط§طھ طھظ†ط§ط³ط¨ ط£ط³ظˆط§ظ‚ ط§ظ„ط®ظ„ظٹط¬ ظˆط¢ط³ظٹط§طŒ ظ…ط¹ ط®ظٹط§ط±ط§طھ طھط¹ط¨ط¦ط© ظ…طھظ†ظˆط¹ط© ظ…ظ† ط£ظƒظٹط§ط³ ط§ظ„ط¨ظˆظ„ظٹ ط¨ط±ظˆط¨ظ„ظٹظ† ط¥ظ„ظ‰ ط§ظ„طھط¹ط¨ط¦ط© ط§ظ„ظ…ط®طµطµط© ط­ط³ط¨ ط·ظ„ط¨ ط§ظ„ظ…ط´طھط±ظٹطŒ ظˆظپط­طµ ط¬ظˆط¯ط© ظ…ط¹طھظ…ط¯ ظ‚ط¨ظ„ ط§ظ„ط´ط­ظ†.

ظ†ظ†طµط­ ط§ظ„ظ…ط´طھط±ظٹظ† ط¨طھط«ط¨ظٹطھ ط§ط­طھظٹط§ط¬ط§طھظ‡ظ… ظ…ط¨ظƒط±ط§ ط®ظ„ط§ظ„ ط°ط±ظˆط© ط§ظ„ظ…ظˆط³ظ… ظ„ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط£ظپط¶ظ„ ط§ظ„ط£ط³ط¹ط§ط± ظˆط¶ظ…ط§ظ† ط§ط³طھظ…ط±ط§ط±ظٹط© ط§ظ„ط¥ظ…ط¯ط§ط¯ ط­طھظ‰ ظ†ظ‡ط§ظٹط© ط§ظ„ط¹ط§ظ….',
  'sesame-harvest-2026'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 1: ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000001'::uuid,
  'en',
  'Gedaref Sesame Harvest 2026: Premium Quality and Export Readiness',
  'The sesame harvest is under way in Gedaref with abundant volumes and exceptional quality, fully prepared for cleaning, sorting, packing, and export to global markets.',
  'Farmers across Gedaref have started harvesting white and red sesame amid strong indicators for yield and quality, supported by well-distributed rainfall and sound field management throughout the growing season.

After harvest, the crop goes through drying, mechanical cleaning, and color sorting to ensure high purity of up to 99/1, with careful checks on moisture content and admixture before storage in well-ventilated warehouses.

Deta Group has prepared export-ready lots tailored to Gulf and Asian market specifications, with flexible packing options from polypropylene bags to buyer-specific private packing, and certified quality inspection before shipment.

We advise buyers to confirm their requirements early in the peak season to secure the best prices and guarantee continuous supply through the end of the year.',
  'sesame-harvest-2026'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- ط§ظ„ظ…ظ‚ط§ظ„ 2: ط¯ظ„ظٹظ„ ط¯ط±ط¬ط§طھ ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000002'::uuid,
  'ط¯ظ„ظٹظ„ ط¯ط±ط¬ط§طھ ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ: ط§ظ„ظ‡ط´ط§ط¨ ظ…ظ‚ط§ط¨ظ„ ط§ظ„ط·ظ„ط­ط© â€” ط§ظ„ظ…ظˆط§طµظپط§طھ ظˆط§ظ„ط§ط³طھط®ط¯ط§ظ…ط§طھ',
  'gum-arabic-grades-guide',
  'طھط¹ط±ظپ ط¹ظ„ظ‰ ط§ظ„ظپط±ظ‚ ط¨ظٹظ† طµظ…ط؛ ط§ظ„ظ‡ط´ط§ط¨ ظˆطµظ…ط؛ ط§ظ„ط·ظ„ط­ط© ظ…ظ† ط­ظٹط« ط§ظ„ظ…ظˆط§طµظپط§طھ ظˆط§ظ„ط°ظˆط¨ط§ظ†ظٹط© ظˆط§ظ„ط§ط³طھط®ط¯ط§ظ…ط§طھ ط§ظ„طµظ†ط§ط¹ظٹط©طŒ ظˆظƒظٹظپ طھط®طھط§ط± ط§ظ„ط¯ط±ط¬ط© ط§ظ„ظ…ظ†ط§ط³ط¨ط© ظ„ط§ط­طھظٹط§ط¬ظƒ.',
  'ظٹط¹ط¯ ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظ…ظ† ط£ط¬ظˆط¯ ط£ظ†ظˆط§ط¹ ط§ظ„طµظ…ط؛ ظپظٹ ط§ظ„ط¹ط§ظ„ظ…طŒ ظˆظٹظ†ظ‚ط³ظ… ط¥ظ„ظ‰ ظ†ظˆط¹ظٹظ† ط±ط¦ظٹط³ظٹظٹظ†: طµظ…ط؛ ط§ظ„ظ‡ط´ط§ط¨ ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ظˆطµظ…ط؛ ط§ظ„ط·ظ„ط­ط© ظ…طھط¹ط¯ط¯ ط§ظ„ط§ط³طھط®ط¯ط§ظ…ط§طھطŒ ظˆظٹط®طھظ„ظپ ظƒظ„ ظ…ظ†ظ‡ظ…ط§ ظپظٹ ط§ظ„ط®طµط§ط¦طµ ظˆط§ظ„ط³ط¹ط± ظˆظ…ط¬ط§ظ„ط§طھ ط§ظ„ط§ط³طھط®ط¯ط§ظ….

ظٹطھظ…ظٹط² طµظ…ط؛ ط§ظ„ظ‡ط´ط§ط¨ ط¨ظ„ظˆظ†ظ‡ ط§ظ„ظپط§طھط­ ظˆط°ظˆط¨ط§ظ†ظٹطھظ‡ ط§ظ„ط¹ط§ظ„ظٹط© ظˆظ†ظ‚ط§ط¦ظ‡طŒ ظ„ط°ظ„ظƒ ظٹط³طھط®ط¯ظ… ظپظٹ ط§ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط© ظˆط§ظ„ط¯ظˆط§ط¦ظٹط© ظˆظ…ط³طھط­ط¶ط±ط§طھ ط§ظ„طھط¬ظ…ظٹظ„طŒ ط¨ظٹظ†ظ…ط§ ظٹط³طھط®ط¯ظ… طµظ…ط؛ ط§ظ„ط·ظ„ط­ط© ظپظٹ ط§ظ„طھط·ط¨ظٹظ‚ط§طھ ط§ظ„طµظ†ط§ط¹ظٹط© ظ…ط«ظ„ ط§ظ„ط£ط­ط¨ط§ط± ظˆط§ظ„ظ…ظ†ط³ظˆط¬ط§طھ ظˆط§ظ„ط¯ظ‡ط§ظ†ط§طھ ظˆط§ظ„ظ…ظˆط§ط¯ ط§ظ„ظ„ط§طµظ‚ط©.

طھط´ظ…ظ„ ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¬ظˆط¯ط© ط§ظ„ظ„ظˆظ† ظˆط§ظ„ط­ط¬ظ… ظˆط§ظ„ظ†ظ‚ط§ط، ظˆظ†ط³ط¨ط© ط§ظ„ط±ط·ظˆط¨ط© ظˆط®ظ„ظˆ ط§ظ„ظ…ظ†طھط¬ ظ…ظ† ط§ظ„ط´ظˆط§ط¦ط¨ ظˆط§ظ„ظ„ط­ط§ط،طŒ ظ…ط¹ ظپط±ط² ظٹط¯ظˆظٹ ظˆط¢ظ„ظٹ ظˆط§ط®طھط¨ط§ط±ط§طھ ط¬ظˆط¯ط© ط¯ظ‚ظٹظ‚ط© ظ‚ط¨ظ„ ط§ظ„طھط¹ط¨ط¦ط© ظ„ط¶ظ…ط§ظ† ظ…ط·ط§ط¨ظ‚ط© ط§ظ„ظ…ظˆط§طµظپط§طھ ط§ظ„ظ…طھظپظ‚ ط¹ظ„ظٹظ‡ط§.

ظ†ظˆظپط± ظپظٹ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¯ط±ط¬ط§طھ ظƒط§ظ…ظ„ط© ظˆظ…ط؛ط±ط¨ظ„ط© ظˆظ…ط·ط­ظˆظ†ط© ط­ط³ط¨ ط§ظ„ط·ظ„ط¨طŒ ظ…ط¹ ط´ظ‡ط§ط¯ط§طھ ط¬ظˆط¯ط© ظˆطھط­ظ„ظٹظ„ ظ…ط®ط¨ط±ظٹ ظ„ظƒظ„ ط´ط­ظ†ط© طھطµط¯ظٹط±ظٹط©طŒ ظˆظ†ط³ط§ط¹ط¯ ط§ظ„ظ…ط´طھط±ظٹظ† ط¹ظ„ظ‰ ط§ط®طھظٹط§ط± ط§ظ„ط¯ط±ط¬ط© ط§ظ„ط£ظ†ط³ط¨ ظ„طھط·ط¨ظٹظ‚ظ‡ظ… ط§ظ„طµظ†ط§ط¹ظٹ ظˆظ…ظٹط²ط§ظ†ظٹطھظ‡ظ….',
  'ط¯. ط³ط§ط±ط© ط£ط­ظ…ط¯ ط§ظ„ط­ط³ظ†',
  'ط£ط¯ظ„ط© ط§ظ„ط¬ظˆط¯ط©',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/gum-arabic-grades-guide.jpg',
  'articles/gum-arabic-grades-guide.jpg',
  false,
  '2026-08-22 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000002'::uuid);

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 2: ط§ظ„ط¹ط±ط¨ظٹط© (ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ط³ط¬ظ„ ط§ظ„ط£ط³ط§ط³ظٹ)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000002'::uuid,
  'ar',
  'ط¯ظ„ظٹظ„ ط¯ط±ط¬ط§طھ ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ: ط§ظ„ظ‡ط´ط§ط¨ ظ…ظ‚ط§ط¨ظ„ ط§ظ„ط·ظ„ط­ط© â€” ط§ظ„ظ…ظˆط§طµظپط§طھ ظˆط§ظ„ط§ط³طھط®ط¯ط§ظ…ط§طھ',
  'طھط¹ط±ظپ ط¹ظ„ظ‰ ط§ظ„ظپط±ظ‚ ط¨ظٹظ† طµظ…ط؛ ط§ظ„ظ‡ط´ط§ط¨ ظˆطµظ…ط؛ ط§ظ„ط·ظ„ط­ط© ظ…ظ† ط­ظٹط« ط§ظ„ظ…ظˆط§طµظپط§طھ ظˆط§ظ„ط°ظˆط¨ط§ظ†ظٹط© ظˆط§ظ„ط§ط³طھط®ط¯ط§ظ…ط§طھ ط§ظ„طµظ†ط§ط¹ظٹط©طŒ ظˆظƒظٹظپ طھط®طھط§ط± ط§ظ„ط¯ط±ط¬ط© ط§ظ„ظ…ظ†ط§ط³ط¨ط© ظ„ط§ط­طھظٹط§ط¬ظƒ.',
  'ظٹط¹ط¯ ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظ…ظ† ط£ط¬ظˆط¯ ط£ظ†ظˆط§ط¹ ط§ظ„طµظ…ط؛ ظپظٹ ط§ظ„ط¹ط§ظ„ظ…طŒ ظˆظٹظ†ظ‚ط³ظ… ط¥ظ„ظ‰ ظ†ظˆط¹ظٹظ† ط±ط¦ظٹط³ظٹظٹظ†: طµظ…ط؛ ط§ظ„ظ‡ط´ط§ط¨ ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ظˆطµظ…ط؛ ط§ظ„ط·ظ„ط­ط© ظ…طھط¹ط¯ط¯ ط§ظ„ط§ط³طھط®ط¯ط§ظ…ط§طھطŒ ظˆظٹط®طھظ„ظپ ظƒظ„ ظ…ظ†ظ‡ظ…ط§ ظپظٹ ط§ظ„ط®طµط§ط¦طµ ظˆط§ظ„ط³ط¹ط± ظˆظ…ط¬ط§ظ„ط§طھ ط§ظ„ط§ط³طھط®ط¯ط§ظ….

ظٹطھظ…ظٹط² طµظ…ط؛ ط§ظ„ظ‡ط´ط§ط¨ ط¨ظ„ظˆظ†ظ‡ ط§ظ„ظپط§طھط­ ظˆط°ظˆط¨ط§ظ†ظٹطھظ‡ ط§ظ„ط¹ط§ظ„ظٹط© ظˆظ†ظ‚ط§ط¦ظ‡طŒ ظ„ط°ظ„ظƒ ظٹط³طھط®ط¯ظ… ظپظٹ ط§ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط© ظˆط§ظ„ط¯ظˆط§ط¦ظٹط© ظˆظ…ط³طھط­ط¶ط±ط§طھ ط§ظ„طھط¬ظ…ظٹظ„طŒ ط¨ظٹظ†ظ…ط§ ظٹط³طھط®ط¯ظ… طµظ…ط؛ ط§ظ„ط·ظ„ط­ط© ظپظٹ ط§ظ„طھط·ط¨ظٹظ‚ط§طھ ط§ظ„طµظ†ط§ط¹ظٹط© ظ…ط«ظ„ ط§ظ„ط£ط­ط¨ط§ط± ظˆط§ظ„ظ…ظ†ط³ظˆط¬ط§طھ ظˆط§ظ„ط¯ظ‡ط§ظ†ط§طھ ظˆط§ظ„ظ…ظˆط§ط¯ ط§ظ„ظ„ط§طµظ‚ط©.

طھط´ظ…ظ„ ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¬ظˆط¯ط© ط§ظ„ظ„ظˆظ† ظˆط§ظ„ط­ط¬ظ… ظˆط§ظ„ظ†ظ‚ط§ط، ظˆظ†ط³ط¨ط© ط§ظ„ط±ط·ظˆط¨ط© ظˆط®ظ„ظˆ ط§ظ„ظ…ظ†طھط¬ ظ…ظ† ط§ظ„ط´ظˆط§ط¦ط¨ ظˆط§ظ„ظ„ط­ط§ط،طŒ ظ…ط¹ ظپط±ط² ظٹط¯ظˆظٹ ظˆط¢ظ„ظٹ ظˆط§ط®طھط¨ط§ط±ط§طھ ط¬ظˆط¯ط© ط¯ظ‚ظٹظ‚ط© ظ‚ط¨ظ„ ط§ظ„طھط¹ط¨ط¦ط© ظ„ط¶ظ…ط§ظ† ظ…ط·ط§ط¨ظ‚ط© ط§ظ„ظ…ظˆط§طµظپط§طھ ط§ظ„ظ…طھظپظ‚ ط¹ظ„ظٹظ‡ط§.

ظ†ظˆظپط± ظپظٹ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¯ط±ط¬ط§طھ ظƒط§ظ…ظ„ط© ظˆظ…ط؛ط±ط¨ظ„ط© ظˆظ…ط·ط­ظˆظ†ط© ط­ط³ط¨ ط§ظ„ط·ظ„ط¨طŒ ظ…ط¹ ط´ظ‡ط§ط¯ط§طھ ط¬ظˆط¯ط© ظˆطھط­ظ„ظٹظ„ ظ…ط®ط¨ط±ظٹ ظ„ظƒظ„ ط´ط­ظ†ط© طھطµط¯ظٹط±ظٹط©طŒ ظˆظ†ط³ط§ط¹ط¯ ط§ظ„ظ…ط´طھط±ظٹظ† ط¹ظ„ظ‰ ط§ط®طھظٹط§ط± ط§ظ„ط¯ط±ط¬ط© ط§ظ„ط£ظ†ط³ط¨ ظ„طھط·ط¨ظٹظ‚ظ‡ظ… ط§ظ„طµظ†ط§ط¹ظٹ ظˆظ…ظٹط²ط§ظ†ظٹطھظ‡ظ….',
  'gum-arabic-grades-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 2: ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000002'::uuid,
  'en',
  'Gum Arabic Grades Guide: Hashab vs Talha â€” Specifications and Uses',
  'Learn the difference between Hashab and Talha gum arabic in solubility, specifications, and industrial uses, and how to choose the right grade for your needs.',
  'Sudanese gum arabic is regarded among the finest in the world. It is divided into two main types: premium Hashab gum and versatile Talha gum, each differing in properties, price, and end use.

Hashab gum is prized for its light color, high solubility, and purity, making it ideal for food, pharmaceutical, and cosmetic applications, while Talha gum serves industrial uses such as inks, textiles, paints, and adhesives.

Key quality criteria include color, nodule size, purity, moisture content, and freedom from bark and foreign matter, verified through combined hand and mechanical sorting plus laboratory testing before packing.

Deta Group supplies whole, sifted, and powdered grades on request, with quality certificates and lab analysis for every export shipment, and our team helps buyers select the most suitable and cost-effective grade for their application.',
  'gum-arabic-grades-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- ط§ظ„ظ…ظ‚ط§ظ„ 3: ط¯ظ„ظٹظ„ ظ…ط³طھظ†ط¯ط§طھ ط§ظ„طھطµط¯ظٹط± ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ†
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000003'::uuid,
  'ط¯ظ„ظٹظ„ ظ…ط³طھظ†ط¯ط§طھ ط§ظ„طھطµط¯ظٹط± ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† ط®ط·ظˆط© ط¨ط®ط·ظˆط©',
  'sudan-export-documents-guide',
  'ط¯ظ„ظٹظ„ظƒ ط§ظ„ط¹ظ…ظ„ظٹ ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„طھطµط¯ظٹط± ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ†: ط´ظ‡ط§ط¯ط© ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ط´ظ‡ط§ط¯ط© ط§ظ„طµط­ظٹط© ظˆط´ظ‡ط§ط¯ط© ط§ظ„طھط¨ط®ظٹط± ظˆط¨ظˆظ„ظٹطµط© ط§ظ„ط´ط­ظ†طŒ ظ…ط¹ ظ†طµط§ط¦ط­ ط¹ظ…ظ„ظٹط© ظ„طھظپط§ط¯ظٹ ط§ظ„طھط£ط®ظٹط± ظپظٹ ط§ظ„ظ…ظˆط§ظ†ط¦.',
  'طھطھط·ظ„ط¨ ط¹ظ…ظ„ظٹط© طھطµط¯ظٹط± ط§ظ„ظ…ط­ط§طµظٹظ„ ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† طھط¬ظ‡ظٹط² ظ…ط¬ظ…ظˆط¹ط© ظ…ظ† ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„ط£ط³ط§ط³ظٹط©طŒ ظˆط£ظٹ ظ†ظ‚طµ ظپظٹظ‡ط§ ظ‚ط¯ ظٹط³ط¨ط¨ طھط£ط®ظٹط±ط§ ظ…ظƒظ„ظپط§ ظپظٹ ط§ظ„ظ…ظٹظ†ط§ط، ط£ظˆ ط¹ظ†ط¯ ط§ظ„طھط®ظ„ظٹطµ ظپظٹ ط¨ظ„ط¯ ط§ظ„ظˆطµظˆظ„طŒ ظ„ط°ظ„ظƒ ظ…ظ† ط§ظ„ظ…ظ‡ظ… ظپظ‡ظ… ظƒظ„ ظ…ط³طھظ†ط¯ ظˆط¯ظˆط±ظ‡.

طھط´ظ…ظ„ ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„ط±ط¦ظٹط³ظٹط© ط§ظ„ظپط§طھظˆط±ط© ط§ظ„طھط¬ط§ط±ظٹط© ظˆظ‚ط§ط¦ظ…ط© ط§ظ„طھط¹ط¨ط¦ط© ظˆط´ظ‡ط§ط¯ط© ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ط´ظ‡ط§ط¯ط© ط§ظ„طµط­ظٹط© ط§ظ„ظ†ط¨ط§طھظٹط© ظˆط´ظ‡ط§ط¯ط© ط§ظ„طھط¨ط®ظٹط± ظˆط¨ظˆظ„ظٹطµط© ط§ظ„ط´ط­ظ†طŒ ط¥ط¶ط§ظپط© ط¥ظ„ظ‰ ط´ظ‡ط§ط¯ط© ط§ظ„ط¬ظˆط¯ط© ط£ظˆ ط§ظ„طھط­ظ„ظٹظ„ ط§ظ„ظ…ط®ط¨ط±ظٹ ط­ط³ط¨ ظ…طھط·ظ„ط¨ط§طھ ط§ظ„ظ…ط´طھط±ظٹ.

طھط¨ط¯ط£ ط§ظ„ط®ط·ظˆط§طھ ط¨طھط¬ظ‡ظٹط² ط§ظ„ط¹ظ‚ط¯ ظˆط§ظ„ظپط§طھظˆط±ط©طŒ ط«ظ… ط§ط³طھط®ط±ط§ط¬ ط´ظ‡ط§ط¯ط© ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ط´ظ‡ط§ط¯ط§طھ ط§ظ„طµط­ظٹط©طŒ ظˆط¨ط¹ط¯ظ‡ط§ طھظ†ظپظٹط° ط§ظ„طھط¨ط®ظٹط± ط§ظ„ظ…ط¹طھظ…ط¯ ظ„ظ„ط­ط§ظˆظٹط§طھطŒ ظˆط£ط®ظٹط±ط§ ط¥طµط¯ط§ط± ط¨ظˆظ„ظٹطµط© ط§ظ„ط´ط­ظ† ط¨ط¹ط¯ طھط­ظ…ظٹظ„ ط§ظ„ط¨ط¶ط§ط¹ط© ظˆظ…ط؛ط§ط¯ط±ط© ط§ظ„ط³ظپظٹظ†ط©.

ظپظٹ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظ†ط¬ظ‡ط² ظƒط§ظ…ظ„ ط§ظ„ط­ط²ظ…ط© ط§ظ„ظ…ط³طھظ†ط¯ظٹط© ظ†ظٹط§ط¨ط© ط¹ظ† ط§ظ„ظ…ط´طھط±ظٹطŒ ظˆظ†طھط£ظƒط¯ ظ…ظ† طھط·ط§ط¨ظ‚ ط§ظ„ط£ط³ظ…ط§ط، ظˆط§ظ„ط£ظˆط²ط§ظ† ظˆط§ظ„ط£ط±ظ‚ط§ظ… ظپظٹ ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھظ†ط¯ط§طھطŒ ظ…ط¹ ط¥ط±ط³ط§ظ„ ظ†ط³ط® ط¥ظ„ظƒطھط±ظˆظ†ظٹط© ظ…ط³ط¨ظ‚ط© ظ„طھط³ط±ظٹط¹ ط§ظ„طھط®ظ„ظٹطµ ط§ظ„ط¬ظ…ط±ظƒظٹ.',
  'ظ…. ظ…ط­ظ…ط¯ ط§ظ„ظپط§طھط­ ط¹ط¨ط¯ ط§ظ„ظ„ظ‡',
  'ط£ط¯ظ„ط© ط§ظ„طھطµط¯ظٹط±',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sudan-export-documents-guide.jpg',
  'articles/sudan-export-documents-guide.jpg',
  false,
  '2026-07-15 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000003'::uuid);

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 3: ط§ظ„ط¹ط±ط¨ظٹط© (ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ط³ط¬ظ„ ط§ظ„ط£ط³ط§ط³ظٹ)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000003'::uuid,
  'ar',
  'ط¯ظ„ظٹظ„ ظ…ط³طھظ†ط¯ط§طھ ط§ظ„طھطµط¯ظٹط± ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† ط®ط·ظˆط© ط¨ط®ط·ظˆط©',
  'ط¯ظ„ظٹظ„ظƒ ط§ظ„ط¹ظ…ظ„ظٹ ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„طھطµط¯ظٹط± ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ†: ط´ظ‡ط§ط¯ط© ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ط´ظ‡ط§ط¯ط© ط§ظ„طµط­ظٹط© ظˆط´ظ‡ط§ط¯ط© ط§ظ„طھط¨ط®ظٹط± ظˆط¨ظˆظ„ظٹطµط© ط§ظ„ط´ط­ظ†طŒ ظ…ط¹ ظ†طµط§ط¦ط­ ط¹ظ…ظ„ظٹط© ظ„طھظپط§ط¯ظٹ ط§ظ„طھط£ط®ظٹط± ظپظٹ ط§ظ„ظ…ظˆط§ظ†ط¦.',
  'طھطھط·ظ„ط¨ ط¹ظ…ظ„ظٹط© طھطµط¯ظٹط± ط§ظ„ظ…ط­ط§طµظٹظ„ ظ…ظ† ط§ظ„ط³ظˆط¯ط§ظ† طھط¬ظ‡ظٹط² ظ…ط¬ظ…ظˆط¹ط© ظ…ظ† ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„ط£ط³ط§ط³ظٹط©طŒ ظˆط£ظٹ ظ†ظ‚طµ ظپظٹظ‡ط§ ظ‚ط¯ ظٹط³ط¨ط¨ طھط£ط®ظٹط±ط§ ظ…ظƒظ„ظپط§ ظپظٹ ط§ظ„ظ…ظٹظ†ط§ط، ط£ظˆ ط¹ظ†ط¯ ط§ظ„طھط®ظ„ظٹطµ ظپظٹ ط¨ظ„ط¯ ط§ظ„ظˆطµظˆظ„طŒ ظ„ط°ظ„ظƒ ظ…ظ† ط§ظ„ظ…ظ‡ظ… ظپظ‡ظ… ظƒظ„ ظ…ط³طھظ†ط¯ ظˆط¯ظˆط±ظ‡.

طھط´ظ…ظ„ ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„ط±ط¦ظٹط³ظٹط© ط§ظ„ظپط§طھظˆط±ط© ط§ظ„طھط¬ط§ط±ظٹط© ظˆظ‚ط§ط¦ظ…ط© ط§ظ„طھط¹ط¨ط¦ط© ظˆط´ظ‡ط§ط¯ط© ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ط´ظ‡ط§ط¯ط© ط§ظ„طµط­ظٹط© ط§ظ„ظ†ط¨ط§طھظٹط© ظˆط´ظ‡ط§ط¯ط© ط§ظ„طھط¨ط®ظٹط± ظˆط¨ظˆظ„ظٹطµط© ط§ظ„ط´ط­ظ†طŒ ط¥ط¶ط§ظپط© ط¥ظ„ظ‰ ط´ظ‡ط§ط¯ط© ط§ظ„ط¬ظˆط¯ط© ط£ظˆ ط§ظ„طھط­ظ„ظٹظ„ ط§ظ„ظ…ط®ط¨ط±ظٹ ط­ط³ط¨ ظ…طھط·ظ„ط¨ط§طھ ط§ظ„ظ…ط´طھط±ظٹ.

طھط¨ط¯ط£ ط§ظ„ط®ط·ظˆط§طھ ط¨طھط¬ظ‡ظٹط² ط§ظ„ط¹ظ‚ط¯ ظˆط§ظ„ظپط§طھظˆط±ط©طŒ ط«ظ… ط§ط³طھط®ط±ط§ط¬ ط´ظ‡ط§ط¯ط© ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ط´ظ‡ط§ط¯ط§طھ ط§ظ„طµط­ظٹط©طŒ ظˆط¨ط¹ط¯ظ‡ط§ طھظ†ظپظٹط° ط§ظ„طھط¨ط®ظٹط± ط§ظ„ظ…ط¹طھظ…ط¯ ظ„ظ„ط­ط§ظˆظٹط§طھطŒ ظˆط£ط®ظٹط±ط§ ط¥طµط¯ط§ط± ط¨ظˆظ„ظٹطµط© ط§ظ„ط´ط­ظ† ط¨ط¹ط¯ طھط­ظ…ظٹظ„ ط§ظ„ط¨ط¶ط§ط¹ط© ظˆظ…ط؛ط§ط¯ط±ط© ط§ظ„ط³ظپظٹظ†ط©.

ظپظٹ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظ†ط¬ظ‡ط² ظƒط§ظ…ظ„ ط§ظ„ط­ط²ظ…ط© ط§ظ„ظ…ط³طھظ†ط¯ظٹط© ظ†ظٹط§ط¨ط© ط¹ظ† ط§ظ„ظ…ط´طھط±ظٹطŒ ظˆظ†طھط£ظƒط¯ ظ…ظ† طھط·ط§ط¨ظ‚ ط§ظ„ط£ط³ظ…ط§ط، ظˆط§ظ„ط£ظˆط²ط§ظ† ظˆط§ظ„ط£ط±ظ‚ط§ظ… ظپظٹ ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھظ†ط¯ط§طھطŒ ظ…ط¹ ط¥ط±ط³ط§ظ„ ظ†ط³ط® ط¥ظ„ظƒطھط±ظˆظ†ظٹط© ظ…ط³ط¨ظ‚ط© ظ„طھط³ط±ظٹط¹ ط§ظ„طھط®ظ„ظٹطµ ط§ظ„ط¬ظ…ط±ظƒظٹ.',
  'sudan-export-documents-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 3: ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000003'::uuid,
  'en',
  'Sudan Export Documents Guide: Step-by-Step Paperwork',
  'Your practical guide to export paperwork from Sudan: certificate of origin, phytosanitary certificate, fumigation certificate, and bill of lading, with tips to avoid port delays.',
  'Exporting crops from Sudan requires a complete set of core documents, and any missing paper can cause costly delays at the port or during clearance at destination, so it is essential to understand each document and its purpose.

The main documents include the commercial invoice, packing list, certificate of origin, phytosanitary certificate, fumigation certificate, and bill of lading, plus a quality or laboratory analysis certificate depending on buyer requirements.

The process starts with the contract and invoice, followed by issuance of the certificate of origin and health certificates, then certified container fumigation, and finally release of the bill of lading after loading and vessel departure.

At Deta Group we prepare the full documentary package on behalf of the buyer, verify that names, weights, and numbers match across all documents, and share advance electronic copies to speed up customs clearance.',
  'sudan-export-documents-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- ط§ظ„ظ…ظ‚ط§ظ„ 4: ط§ظ„ط´ط­ظ† ط¹ط¨ط± ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000004'::uuid,
  'ط§ظ„ط´ط­ظ† ط¹ط¨ط± ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†: FOB ظˆCIF ظˆطھط¬ظ‡ظٹط² ط§ظ„ط­ط§ظˆظٹط§طھ ظˆظ…ط¯ط¯ ط§ظ„ظˆطµظˆظ„',
  'port-sudan-logistics',
  'ظƒظ„ ظ…ط§ طھط­طھط§ط¬ ظ…ط¹ط±ظپطھظ‡ ط¹ظ† ط§ظ„ط´ط­ظ† ط¹ط¨ط± ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†: ط§ظ„ظپط±ظ‚ ط¨ظٹظ† FOB ظˆCIFطŒ ظˆطھط¬ظ‡ظٹط² ط§ظ„ط­ط§ظˆظٹط§طھطŒ ظˆظ…ط¯ط¯ ط§ظ„ط¹ط¨ظˆط± ط¥ظ„ظ‰ ط¬ط¯ط© ظˆط¬ط¨ظ„ ط¹ظ„ظٹ ظˆط§ظ„ظ…ظˆط§ظ†ط¦ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.',
  'ظٹط¹ط¯ ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† ط§ظ„ط¨ظˆط§ط¨ط© ط§ظ„ط±ط¦ظٹط³ظٹط© ظ„طµط§ط¯ط±ط§طھ ط§ظ„ط³ظˆط¯ط§ظ† ط§ظ„ط²ط±ط§ط¹ظٹط©طŒ ظˆظ…ظ† ط®ظ„ط§ظ„ظ‡ طھط®ط±ط¬ ط´ط­ظ†ط§طھ ط§ظ„ط³ظ…ط³ظ… ظˆط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ظˆط§ظ„ظƒط±ظƒط¯ظٹظ‡ ظˆط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط¥ظ„ظ‰ ظ…ظˆط§ظ†ط¦ ط§ظ„ط¨ط­ط± ط§ظ„ط£ط­ظ…ط± ظˆط§ظ„ط®ظ„ظٹط¬ ظˆط¢ط³ظٹط§.

ظٹطھط§ط­ ط§ظ„ط´ط­ظ† ط¨ط´ط±ظˆط· FOB ط­ظٹط« ظٹط³طھظ„ظ… ط§ظ„ظ…ط´طھط±ظٹ ط§ظ„ط¨ط¶ط§ط¹ط© ط¹ظ„ظ‰ ط¸ظ‡ط± ط§ظ„ط³ظپظٹظ†ط© ظپظٹ ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط£ظˆ ط¨ط´ط±ظˆط· CIF ط­ظٹط« ظ†طھط­ظ…ظ„ ط§ظ„ط´ط­ظ† ظˆط§ظ„طھط£ظ…ظٹظ† ط­طھظ‰ ظ…ظٹظ†ط§ط، ط§ظ„ظˆطµظˆظ„طŒ ظˆظٹط¹طھظ…ط¯ ط§ظ„ط§ط®طھظٹط§ط± ط¹ظ„ظ‰ ط®ط¨ط±ط© ط§ظ„ظ…ط´طھط±ظٹ ظپظٹ ط§ظ„ط´ط­ظ† ظˆط±ط؛ط¨طھظ‡ ظپظٹ ط¥ط¯ط§ط±ط© ط§ظ„طھظƒط§ظ„ظٹظپ.

طھط´ظ…ظ„ ط¹ظ…ظ„ظٹط© طھط¬ظ‡ظٹط² ط§ظ„ط­ط§ظˆظٹط§طھ ط§ظ„ظˆط²ظ† ط§ظ„ط¯ظ‚ظٹظ‚ ظˆظˆط¶ط¹ ط§ظ„ط¨ط§ظ„طھط§طھ ط£ظˆ ط§ظ„طھط­ظ…ظٹظ„ ط§ظ„ط³ط§ط¦ط¨ ط­ط³ط¨ ط§ظ„ظ…ظ†طھط¬طŒ ظ…ط¹ ط§ظ„طھط¨ط®ظٹط± ط§ظ„ظ…ط¹طھظ…ط¯ ظˆظˆط¶ط¹ ط£ظƒظٹط§ط³ ط§ظ„طھط¬ظپظٹظپ ط¹ظ†ط¯ ط§ظ„ط­ط§ط¬ط© ظ„ط­ظ…ط§ظٹط© ط§ظ„ط¨ط¶ط§ط¹ط© ظ…ظ† ط§ظ„ط±ط·ظˆط¨ط© ط£ط«ظ†ط§ط، ط§ظ„ط±ط­ظ„ط© ط§ظ„ط¨ط­ط±ظٹط©.

طھط³طھط؛ط±ظ‚ ط§ظ„ط±ط­ظ„ط© ظ…ظ† ط¨ظˆط±طھط³ظˆط¯ط§ظ† ط¥ظ„ظ‰ ط¬ط¯ط© ط£ظٹط§ظ…ط§ ظ‚ظ„ظٹظ„ط©طŒ ظˆط¥ظ„ظ‰ ط¬ط¨ظ„ ط¹ظ„ظٹ ظ†ط­ظˆ ط£ط³ط¨ظˆط¹ طھظ‚ط±ظٹط¨ط§ ط­ط³ط¨ ط§ظ„ط®ط· ط§ظ„ظ…ظ„ط§ط­ظٹطŒ ظ…ط¹ ط¥ظ…ظƒط§ظ†ظٹط© ط§ظ„ط´ط­ظ† ط¥ظ„ظ‰ ظ…ظˆط§ظ†ط¦ ط£ط®ط±ظ‰ ط¹ط¨ط± ط§ظ„طھط±ط§ظ†ط²ظٹطھطŒ ظˆظ†ظˆظپط± ظ„ط¹ظ…ظ„ط§ط¦ظ†ط§ ط¬ط¯ظˆظ„ط§ ظˆط§ط¶ط­ط§ ظˆظ…طھط§ط¨ط¹ط© ظ„ط­ط¸ظٹط© ط­طھظ‰ ظˆطµظˆظ„ ط§ظ„ط­ط§ظˆظٹط©.',
  'ظ…. ط®ط§ظ„ط¯ ظ…طµط·ظپظ‰ ط§ظ„ط£ظ…ظٹظ†',
  'ظ„ظˆط¬ط³طھظٹط§طھ',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/port-sudan-logistics.jpg',
  'articles/port-sudan-logistics.jpg',
  false,
  '2026-06-30 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000004'::uuid);

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 4: ط§ظ„ط¹ط±ط¨ظٹط© (ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ط³ط¬ظ„ ط§ظ„ط£ط³ط§ط³ظٹ)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000004'::uuid,
  'ar',
  'ط§ظ„ط´ط­ظ† ط¹ط¨ط± ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†: FOB ظˆCIF ظˆطھط¬ظ‡ظٹط² ط§ظ„ط­ط§ظˆظٹط§طھ ظˆظ…ط¯ط¯ ط§ظ„ظˆطµظˆظ„',
  'ظƒظ„ ظ…ط§ طھط­طھط§ط¬ ظ…ط¹ط±ظپطھظ‡ ط¹ظ† ط§ظ„ط´ط­ظ† ط¹ط¨ط± ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†: ط§ظ„ظپط±ظ‚ ط¨ظٹظ† FOB ظˆCIFطŒ ظˆطھط¬ظ‡ظٹط² ط§ظ„ط­ط§ظˆظٹط§طھطŒ ظˆظ…ط¯ط¯ ط§ظ„ط¹ط¨ظˆط± ط¥ظ„ظ‰ ط¬ط¯ط© ظˆط¬ط¨ظ„ ط¹ظ„ظٹ ظˆط§ظ„ظ…ظˆط§ظ†ط¦ ط§ظ„ط¹ط§ظ„ظ…ظٹط©.',
  'ظٹط¹ط¯ ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† ط§ظ„ط¨ظˆط§ط¨ط© ط§ظ„ط±ط¦ظٹط³ظٹط© ظ„طµط§ط¯ط±ط§طھ ط§ظ„ط³ظˆط¯ط§ظ† ط§ظ„ط²ط±ط§ط¹ظٹط©طŒ ظˆظ…ظ† ط®ظ„ط§ظ„ظ‡ طھط®ط±ط¬ ط´ط­ظ†ط§طھ ط§ظ„ط³ظ…ط³ظ… ظˆط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ظˆط§ظ„ظƒط±ظƒط¯ظٹظ‡ ظˆط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط¥ظ„ظ‰ ظ…ظˆط§ظ†ط¦ ط§ظ„ط¨ط­ط± ط§ظ„ط£ط­ظ…ط± ظˆط§ظ„ط®ظ„ظٹط¬ ظˆط¢ط³ظٹط§.

ظٹطھط§ط­ ط§ظ„ط´ط­ظ† ط¨ط´ط±ظˆط· FOB ط­ظٹط« ظٹط³طھظ„ظ… ط§ظ„ظ…ط´طھط±ظٹ ط§ظ„ط¨ط¶ط§ط¹ط© ط¹ظ„ظ‰ ط¸ظ‡ط± ط§ظ„ط³ظپظٹظ†ط© ظپظٹ ط¨ظˆط±طھط³ظˆط¯ط§ظ†طŒ ط£ظˆ ط¨ط´ط±ظˆط· CIF ط­ظٹط« ظ†طھط­ظ…ظ„ ط§ظ„ط´ط­ظ† ظˆط§ظ„طھط£ظ…ظٹظ† ط­طھظ‰ ظ…ظٹظ†ط§ط، ط§ظ„ظˆطµظˆظ„طŒ ظˆظٹط¹طھظ…ط¯ ط§ظ„ط§ط®طھظٹط§ط± ط¹ظ„ظ‰ ط®ط¨ط±ط© ط§ظ„ظ…ط´طھط±ظٹ ظپظٹ ط§ظ„ط´ط­ظ† ظˆط±ط؛ط¨طھظ‡ ظپظٹ ط¥ط¯ط§ط±ط© ط§ظ„طھظƒط§ظ„ظٹظپ.

طھط´ظ…ظ„ ط¹ظ…ظ„ظٹط© طھط¬ظ‡ظٹط² ط§ظ„ط­ط§ظˆظٹط§طھ ط§ظ„ظˆط²ظ† ط§ظ„ط¯ظ‚ظٹظ‚ ظˆظˆط¶ط¹ ط§ظ„ط¨ط§ظ„طھط§طھ ط£ظˆ ط§ظ„طھط­ظ…ظٹظ„ ط§ظ„ط³ط§ط¦ط¨ ط­ط³ط¨ ط§ظ„ظ…ظ†طھط¬طŒ ظ…ط¹ ط§ظ„طھط¨ط®ظٹط± ط§ظ„ظ…ط¹طھظ…ط¯ ظˆظˆط¶ط¹ ط£ظƒظٹط§ط³ ط§ظ„طھط¬ظپظٹظپ ط¹ظ†ط¯ ط§ظ„ط­ط§ط¬ط© ظ„ط­ظ…ط§ظٹط© ط§ظ„ط¨ط¶ط§ط¹ط© ظ…ظ† ط§ظ„ط±ط·ظˆط¨ط© ط£ط«ظ†ط§ط، ط§ظ„ط±ط­ظ„ط© ط§ظ„ط¨ط­ط±ظٹط©.

طھط³طھط؛ط±ظ‚ ط§ظ„ط±ط­ظ„ط© ظ…ظ† ط¨ظˆط±طھط³ظˆط¯ط§ظ† ط¥ظ„ظ‰ ط¬ط¯ط© ط£ظٹط§ظ…ط§ ظ‚ظ„ظٹظ„ط©طŒ ظˆط¥ظ„ظ‰ ط¬ط¨ظ„ ط¹ظ„ظٹ ظ†ط­ظˆ ط£ط³ط¨ظˆط¹ طھظ‚ط±ظٹط¨ط§ ط­ط³ط¨ ط§ظ„ط®ط· ط§ظ„ظ…ظ„ط§ط­ظٹطŒ ظ…ط¹ ط¥ظ…ظƒط§ظ†ظٹط© ط§ظ„ط´ط­ظ† ط¥ظ„ظ‰ ظ…ظˆط§ظ†ط¦ ط£ط®ط±ظ‰ ط¹ط¨ط± ط§ظ„طھط±ط§ظ†ط²ظٹطھطŒ ظˆظ†ظˆظپط± ظ„ط¹ظ…ظ„ط§ط¦ظ†ط§ ط¬ط¯ظˆظ„ط§ ظˆط§ط¶ط­ط§ ظˆظ…طھط§ط¨ط¹ط© ظ„ط­ط¸ظٹط© ط­طھظ‰ ظˆطµظˆظ„ ط§ظ„ط­ط§ظˆظٹط©.',
  'port-sudan-logistics'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 4: ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000004'::uuid,
  'en',
  'Shipping via Port Sudan: FOB/CIF, Container Stuffing, and Transit Times',
  'Everything you need to know about shipping via Port Sudan: FOB vs CIF, container stuffing, and transit times to Jeddah, Jebel Ali, and global ports.',
  'Port Sudan is the main gateway for Sudanese agricultural exports, handling shipments of sesame, gum arabic, hibiscus, and groundnuts to Red Sea, Gulf, and Asian ports.

Shipments are available on FOB terms, where the buyer takes over the goods on board the vessel at Port Sudan, or on CIF terms, where we cover freight and insurance to the destination port. The choice depends on the buyer''s shipping experience and cost-management preferences.

Container stuffing covers accurate weighing, palletized or bulk loading depending on the product, certified fumigation, and desiccant bags where needed to protect the cargo from moisture during the sea voyage.

The voyage from Port Sudan to Jeddah takes only a few days, and to Jebel Ali around one week depending on the shipping line, with onward transshipment options to other ports. We provide our clients with a clear schedule and live tracking until the container arrives.',
  'port-sudan-logistics'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- ط§ظ„ظ…ظ‚ط§ظ„ 5: ظ…ط¹ط§ظٹظٹط± ط¬ظˆط¯ط© ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000005'::uuid,
  'ظ…ط¹ط§ظٹظٹط± ط¬ظˆط¯ط© ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظ„ظ„ظ…ط´طھط±ظٹظ† ط§ظ„ط£ظˆط±ظˆط¨ظٹظٹظ†',
  'hibiscus-quality-standards',
  'ظ…ط¹ط§ظٹظٹط± ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظ„ظ„ط³ظˆظ‚ ط§ظ„ط£ظˆط±ظˆط¨ظٹط©: ط§ظ„ط±ط·ظˆط¨ط© ظˆط§ظ„ظ„ظˆظ† ظˆط§ظ„ظپط±ظ‚ ط¨ظٹظ† ط§ظ„ط¯ط±ط¬ط§طھ ط§ظ„ظƒط§ظ…ظ„ط© ظˆط§ظ„ظ…ط؛ط±ط¨ظ„ط©طŒ ظˆظƒظٹظپ ظ†ط¶ظ…ظ† ظ…ط·ط§ط¨ظ‚ط© طµط§ط±ظ…ط© ظ„ظ„ظ…ظˆط§طµظپط§طھ.',
  'ظٹط´طھظ‡ط± ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط¨ظ„ظˆظ†ظ‡ ط§ظ„ط£ط­ظ…ط± ط§ظ„ط¯ط§ظƒظ† ظˆط­ظ…ظˆط¶طھظ‡ ط§ظ„ط·ط¨ظٹط¹ظٹط© ظˆظ†ظƒظ‡طھظ‡ ط§ظ„ط؛ظ†ظٹط©طŒ ظˆظ‡ظˆ ظ…ط·ظ„ظˆط¨ ط¨ظ‚ظˆط© ظپظٹ ط£ظˆط±ظˆط¨ط§ ظ„ظ„ط´ط§ظٹ ظˆط§ظ„ظ…ط´ط±ظˆط¨ط§طھ ظˆط§ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط©طŒ ظ„ظƒظ† ط¯ط®ظˆظ„ ط§ظ„ط³ظˆظ‚ ط§ظ„ط£ظˆط±ظˆط¨ظٹط© ظٹطھط·ظ„ط¨ ط§ظ„طھط²ط§ظ…ط§ طµط§ط±ظ…ط§ ط¨ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¬ظˆط¯ط©.

طھط´ظ…ظ„ ط£ظ‡ظ… ط§ظ„ظ…ط¹ط§ظٹظٹط± ظ†ط³ط¨ط© ط§ظ„ط±ط·ظˆط¨ط© ط§ظ„ظ…ظ†ط®ظپط¶ط© ظˆط§ظ„ظ„ظˆظ† ط§ظ„ظ…ظˆط­ط¯ ظˆط®ظ„ظˆ ط§ظ„ظ…ظ†طھط¬ ظ…ظ† ط§ظ„ط£طھط±ط¨ط© ظˆط§ظ„ط³ظٹظ‚ط§ظ† ظˆط§ظ„ظ…ظˆط§ط¯ ط§ظ„ط؛ط±ظٹط¨ط©طŒ ظ…ط¹ طھط­ظ„ظٹظ„ ظ…ط®ط¨ط±ظٹ ظٹط«ط¨طھ ط³ظ„ط§ظ…ط© ط§ظ„ظ…ظ†طھط¬ ظ…ظ† ط§ظ„ظ…ظٹظƒط±ظˆط¨ط§طھ ظˆط¨ظ‚ط§ظٹط§ ط§ظ„ظ…ط¨ظٹط¯ط§طھ.

ظٹطھظˆظپط± ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط¨ط¯ط±ط¬طھظٹظ† ط±ط¦ظٹط³ظٹطھظٹظ†: ط§ظ„ط²ظ‡ط±ط© ط§ظ„ظƒط§ظ…ظ„ط© ظ„ظ„ط£ط³ظˆط§ظ‚ ط§ظ„طھظٹ طھظپط¶ظ„ ط§ظ„ظ…ط¸ظ‡ط± ط§ظ„ط·ط¨ظٹط¹ظٹطŒ ظˆط§ظ„ظ…ط؛ط±ط¨ظ„ط© ط§ظ„ظ†ط¸ظٹظپط© ظ„ظ…طµط§ظ†ط¹ ط§ظ„طھط¹ط¨ط¦ط© ط§ظ„طھظٹ طھط­طھط§ط¬ ط³ط±ط¹ط© ط§ظ„ط°ظˆط¨ط§ظ† ظˆط³ظ‡ظˆظ„ط© ط§ظ„ط§ط³طھط®ط¯ط§ظ…طŒ ظˆظƒظ„ ط¯ط±ط¬ط© ظ„ظ‡ط§ ط³ط¹ط±ظ‡ط§ ظˆط§ط³طھط®ط¯ط§ظ…ظ‡ط§.

ظ†ط·ط¨ظ‚ ظپظٹ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظپط±ط²ط§ ط¯ظ‚ظٹظ‚ط§ ظˆطھط¬ظپظٹظپط§ ظ…ط¶ط¨ظˆط·ط§ ظˆطھط¹ط¨ط¦ط© ظ…ط­ظƒظ…ط© طھط­ظپط¸ ط§ظ„ظ„ظˆظ† ظˆط§ظ„ظ†ظƒظ‡ط©طŒ ظ…ط¹ ط´ظ‡ط§ط¯ط§طھ طھط­ظ„ظٹظ„ ظ„ظƒظ„ ط¯ظپط¹ط© طھطµط¯ظٹط±ظٹط© ظ„ط¶ظ…ط§ظ† ط±ط¶ط§ ط§ظ„ظ…ط´طھط±ظٹظ† ط§ظ„ط£ظˆط±ظˆط¨ظٹظٹظ† ظˆط§ط³طھظ…ط±ط§ط±ظٹط© ط§ظ„طھط¹ط§ظ…ظ„.',
  'ط¯. ط³ط§ط±ط© ط£ط­ظ…ط¯ ط§ظ„ط­ط³ظ†',
  'ط£ط¯ظ„ط© ط§ظ„ط¬ظˆط¯ط©',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/hibiscus-quality-standards.jpg',
  'articles/hibiscus-quality-standards.jpg',
  false,
  '2026-05-18 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000005'::uuid);

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 5: ط§ظ„ط¹ط±ط¨ظٹط© (ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ط³ط¬ظ„ ط§ظ„ط£ط³ط§ط³ظٹ)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000005'::uuid,
  'ar',
  'ظ…ط¹ط§ظٹظٹط± ط¬ظˆط¯ط© ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظ„ظ„ظ…ط´طھط±ظٹظ† ط§ظ„ط£ظˆط±ظˆط¨ظٹظٹظ†',
  'ظ…ط¹ط§ظٹظٹط± ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظ„ظ„ط³ظˆظ‚ ط§ظ„ط£ظˆط±ظˆط¨ظٹط©: ط§ظ„ط±ط·ظˆط¨ط© ظˆط§ظ„ظ„ظˆظ† ظˆط§ظ„ظپط±ظ‚ ط¨ظٹظ† ط§ظ„ط¯ط±ط¬ط§طھ ط§ظ„ظƒط§ظ…ظ„ط© ظˆط§ظ„ظ…ط؛ط±ط¨ظ„ط©طŒ ظˆظƒظٹظپ ظ†ط¶ظ…ظ† ظ…ط·ط§ط¨ظ‚ط© طµط§ط±ظ…ط© ظ„ظ„ظ…ظˆط§طµظپط§طھ.',
  'ظٹط´طھظ‡ط± ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط¨ظ„ظˆظ†ظ‡ ط§ظ„ط£ط­ظ…ط± ط§ظ„ط¯ط§ظƒظ† ظˆط­ظ…ظˆط¶طھظ‡ ط§ظ„ط·ط¨ظٹط¹ظٹط© ظˆظ†ظƒظ‡طھظ‡ ط§ظ„ط؛ظ†ظٹط©طŒ ظˆظ‡ظˆ ظ…ط·ظ„ظˆط¨ ط¨ظ‚ظˆط© ظپظٹ ط£ظˆط±ظˆط¨ط§ ظ„ظ„ط´ط§ظٹ ظˆط§ظ„ظ…ط´ط±ظˆط¨ط§طھ ظˆط§ظ„طµظ†ط§ط¹ط§طھ ط§ظ„ط؛ط°ط§ط¦ظٹط©طŒ ظ„ظƒظ† ط¯ط®ظˆظ„ ط§ظ„ط³ظˆظ‚ ط§ظ„ط£ظˆط±ظˆط¨ظٹط© ظٹطھط·ظ„ط¨ ط§ظ„طھط²ط§ظ…ط§ طµط§ط±ظ…ط§ ط¨ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¬ظˆط¯ط©.

طھط´ظ…ظ„ ط£ظ‡ظ… ط§ظ„ظ…ط¹ط§ظٹظٹط± ظ†ط³ط¨ط© ط§ظ„ط±ط·ظˆط¨ط© ط§ظ„ظ…ظ†ط®ظپط¶ط© ظˆط§ظ„ظ„ظˆظ† ط§ظ„ظ…ظˆط­ط¯ ظˆط®ظ„ظˆ ط§ظ„ظ…ظ†طھط¬ ظ…ظ† ط§ظ„ط£طھط±ط¨ط© ظˆط§ظ„ط³ظٹظ‚ط§ظ† ظˆط§ظ„ظ…ظˆط§ط¯ ط§ظ„ط؛ط±ظٹط¨ط©طŒ ظ…ط¹ طھط­ظ„ظٹظ„ ظ…ط®ط¨ط±ظٹ ظٹط«ط¨طھ ط³ظ„ط§ظ…ط© ط§ظ„ظ…ظ†طھط¬ ظ…ظ† ط§ظ„ظ…ظٹظƒط±ظˆط¨ط§طھ ظˆط¨ظ‚ط§ظٹط§ ط§ظ„ظ…ط¨ظٹط¯ط§طھ.

ظٹطھظˆظپط± ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط¨ط¯ط±ط¬طھظٹظ† ط±ط¦ظٹط³ظٹطھظٹظ†: ط§ظ„ط²ظ‡ط±ط© ط§ظ„ظƒط§ظ…ظ„ط© ظ„ظ„ط£ط³ظˆط§ظ‚ ط§ظ„طھظٹ طھظپط¶ظ„ ط§ظ„ظ…ط¸ظ‡ط± ط§ظ„ط·ط¨ظٹط¹ظٹطŒ ظˆط§ظ„ظ…ط؛ط±ط¨ظ„ط© ط§ظ„ظ†ط¸ظٹظپط© ظ„ظ…طµط§ظ†ط¹ ط§ظ„طھط¹ط¨ط¦ط© ط§ظ„طھظٹ طھط­طھط§ط¬ ط³ط±ط¹ط© ط§ظ„ط°ظˆط¨ط§ظ† ظˆط³ظ‡ظˆظ„ط© ط§ظ„ط§ط³طھط®ط¯ط§ظ…طŒ ظˆظƒظ„ ط¯ط±ط¬ط© ظ„ظ‡ط§ ط³ط¹ط±ظ‡ط§ ظˆط§ط³طھط®ط¯ط§ظ…ظ‡ط§.

ظ†ط·ط¨ظ‚ ظپظٹ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظپط±ط²ط§ ط¯ظ‚ظٹظ‚ط§ ظˆطھط¬ظپظٹظپط§ ظ…ط¶ط¨ظˆط·ط§ ظˆطھط¹ط¨ط¦ط© ظ…ط­ظƒظ…ط© طھط­ظپط¸ ط§ظ„ظ„ظˆظ† ظˆط§ظ„ظ†ظƒظ‡ط©طŒ ظ…ط¹ ط´ظ‡ط§ط¯ط§طھ طھط­ظ„ظٹظ„ ظ„ظƒظ„ ط¯ظپط¹ط© طھطµط¯ظٹط±ظٹط© ظ„ط¶ظ…ط§ظ† ط±ط¶ط§ ط§ظ„ظ…ط´طھط±ظٹظ† ط§ظ„ط£ظˆط±ظˆط¨ظٹظٹظ† ظˆط§ط³طھظ…ط±ط§ط±ظٹط© ط§ظ„طھط¹ط§ظ…ظ„.',
  'hibiscus-quality-standards'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- طھط±ط¬ظ…ط© ط§ظ„ظ…ظ‚ط§ظ„ 5: ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000005'::uuid,
  'en',
  'Sudanese Hibiscus Quality Standards for European Buyers',
  'Sudanese hibiscus standards for the European market: moisture, color, and whole vs sifted grades, and how we ensure strict specification compliance.',
  'Sudanese hibiscus, known as Karkadeh, is famous for its deep red color, natural acidity, and rich flavor. It is in strong demand across Europe for teas, beverages, and food manufacturing, yet entering the EU market requires strict compliance with quality standards.

The most important criteria are low moisture content, uniform color, and freedom from dust, stalks, and foreign matter, supported by laboratory analysis confirming the product is free from microbial contamination and pesticide residues.

Hibiscus is offered in two main grades: whole flowers for markets that prefer a natural appearance, and clean sifted cuts for packing factories that need fast infusion and ease of use. Each grade has its own price point and application.

At Deta Group we apply precise sorting, controlled drying, and airtight packing that preserves color and flavor, with a certificate of analysis for every export lot to ensure European buyer satisfaction and long-term partnership.',
  'hibiscus-quality-standards'
)
ON CONFLICT (article_id, language_code) DO NOTHING;
 -- =============================================
-- ط§ظ„ظ…ظ„ظپ: supabase/migrations/_parts/05_articles_b.sql
-- ط§ظ„ظˆطµظپ: ط¥ط¯ط®ط§ظ„ 5 ظ…ظ‚ط§ظ„ط§طھ (6..10) ظ…ط¹ طھط±ط¬ظ…ط§طھ ar+en â€” ط¢ظ…ظ† ظˆظ‚ط§ط¨ظ„ ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط´ط؛ظٹظ„
-- ط§ظ„ط¬ط¯ط§ظˆظ„: public.articles + public.article_translations
-- ظ…ظ„ط§ط­ط¸ط©: ظƒظ„ ط¥ط¯ط®ط§ظ„ ظ…ط­ظ…ظٹ ط¨ط´ط±ط· NOT EXISTS ط¹ظ„ظ‰ UUID ط§ظ„ط«ط§ط¨طھطŒ ظˆط§ظ„طھط±ط¬ظ…ط§طھ ظ…ط­ظ…ظٹط© ط¨ظ€ ON CONFLICT
-- ط§ظ„طھط±ظ…ظٹط²: UTF-8
-- =============================================

-- ---------------------------------------------
-- 6) طھط¯ط´ظٹظ† ط®ط· ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ظ…ط¹طµظˆط± ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ â€” ظ…ظ‚ط§ظ„ ظ…ظ…ظٹط²
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000006',
  'ط¯ظٹطھط§ طھط¯ط´ظ† ط®ط· ط¹طµط± ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ ط¨ظ…ط¹ط§ظٹظٹط± ط³ظ„ط§ظ…ط© ط§ظ„ط؛ط°ط§ط،',
  'cold-pressed-sesame-oil-line',
  'ط£ط¹ظ„ظ†طھ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¹ظ† طھط¯ط´ظٹظ† ط®ط· ط¬ط¯ظٹط¯ ظ„ط¹طµط± ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ ط¶ظ…ظ† ظ…ظ†ط¸ظˆظ…ط© ط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹطŒ ط¨ط·ط§ظ‚ط© ط¥ظ†طھط§ط¬ظٹط© ط¹ط§ظ„ظٹط© ظˆظ…ط¹ط§ظٹظٹط± طµط§ط±ظ…ط© ظ„ط³ظ„ط§ظ…ط© ط§ظ„ط؛ط°ط§ط، ظˆط§ظ„ط¬ظˆط¯ط©.',
  'ط¯ط´ظ†طھ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط®ط· ط¥ظ†طھط§ط¬ ط¬ط¯ظٹط¯ط§ ظ„ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ظ…ط¹طµظˆط± ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯طŒ ظپظٹ ط®ط·ظˆط© طھظˆط³ط¹ ط­ط¶ظˆط±ظ‡ط§ ظپظٹ ط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹ ط¥ظ„ظ‰ ط¬ط§ظ†ط¨ ط£ظ†ط´ط·ط© ط§ظ„طھط¬ط§ط±ط© ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظ„ظˆط¬ط³طھظٹط©. ظˆظٹط¹طھظ…ط¯ ط§ظ„ط®ط· طھظ‚ظ†ظٹط© ط§ظ„ط¹طµط± ط§ظ„ط¨ط§ط±ط¯ ظ„ظ„ط­ظپط§ط¸ ط¹ظ„ظ‰ ط§ظ„ظ†ظƒظ‡ط© ط§ظ„ط·ط¨ظٹط¹ظٹط© ظˆط§ظ„ظ‚ظٹظ…ط© ط§ظ„ط؛ط°ط§ط¦ظٹط© ظ„ظ„ط³ظ…ط³ظ… ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظپط§ط®ط±.

ظٹط®ط¶ط¹ ط§ظ„ط¥ظ†طھط§ط¬ ظ„ظپط­ظˆطµ ظ…ط®ط¨ط±ظٹط© ط¯ظ‚ظٹظ‚ط© طھط´ظ…ظ„ ط§ظ„ط­ظ…ظˆط¶ط© ظˆط§ظ„ط±ط·ظˆط¨ط© ظˆظ†ط³ط¨ط© ط§ظ„ط´ظˆط§ط¦ط¨طŒ ظ…ط¹ ط§ظ„ط§ظ„طھط²ط§ظ… ط§ظ„طµط§ط±ظ… ط¨ط§ط´طھط±ط§ط·ط§طھ ط§ظ„ظ†ط¸ط§ظپط© ظˆط§ظ„طھط¹ط¨ط¦ط© ط§ظ„ط؛ط°ط§ط¦ظٹط©. ظƒظ…ط§ طھظ… طھط¬ظ‡ظٹط² ظˆط­ط¯ط© طھط±ط´ظٹط­ ظˆطھط¹ط¨ط¦ط© ط­ط¯ظٹط«ط© طھط¶ظ…ظ† ط«ط¨ط§طھ ط§ظ„ط¬ظˆط¯ط© ظ…ظ† ط§ظ„ط¯ظپط¹ط© ط§ظ„ط£ظˆظ„ظ‰ ط­طھظ‰ ط§ظ„طھط³ظ„ظٹظ… ط§ظ„ظ†ظ‡ط§ط¦ظٹ.

ظٹط³طھظ‡ط¯ظپ ط§ظ„ط¥ظ†طھط§ط¬ ط§ظ„ط¬ط¯ظٹط¯ ط§ظ„ط³ظˆظ‚ ط§ظ„ظ…ط­ظ„ظٹ ظˆط£ط³ظˆط§ظ‚ ط§ظ„ط®ظ„ظٹط¬ ظˆط´ط±ظ‚ ط¢ط³ظٹط§طŒ ظ…ط¹ ط¥طھط§ط­ط© ط§ظ„طھط¹ط¨ط¦ط© ط¨ظƒظ…ظٹط§طھ ط§ظ„ط¬ظ…ظ„ط© ظˆط§ظ„طھط¬ط²ط¦ط© ط­ط³ط¨ ط·ظ„ط¨ ط§ظ„ط¹ظ…ظ„ط§ط،. ظˆطھظˆظپط± ط¯ظٹطھط§ ط¹ظٹظ†ط§طھ ظ…ط¹طھظ…ط¯ط© ظˆط´ظ‡ط§ط¯ط§طھ طھط­ظ„ظٹظ„ ظ„ظƒظ„ ط´ط­ظ†ط© طµط§ط¯ط±ط©.

ظٹظ…ط«ظ„ ظ‡ط°ط§ ط§ظ„ط®ط· ط§ظ…طھط¯ط§ط¯ط§ ظ„ط§ط³طھط±ط§طھظٹط¬ظٹط© ط¯ظٹطھط§ ظپظٹ طھط¹ط¸ظٹظ… ط§ظ„ظ‚ظٹظ…ط© ط§ظ„ظ…ط¶ط§ظپط© ظ„ظ„ظ…ط­ط§طµظٹظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط©طŒ ظˆظپطھط­ ظ‚ظ†ظˆط§طھ طھطµط¯ظٹط±ظٹط© ط¬ط¯ظٹط¯ط© ظ„ط²ظٹطھ ط³ظ…ط³ظ… ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ط¨ط¹ظ„ط§ظ…ط© ط³ظˆط¯ط§ظ†ظٹط© ظ…ظˆط«ظˆظ‚ط©.',
  'ط£. ط¹ط§ط¦ط´ط© ط¹ط¨ط¯ ط§ظ„ط±ط­ظ…ظ†',
  'ط£ط®ط¨ط§ط± ط§ظ„ط´ط±ظƒط©',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/cold-pressed-sesame-oil-line.jpg',
  true,
  '2026-08-05 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000006');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ‚ط§ظ„ 6 (ط¹ط±ط¨ظٹ ظ…ط·ط§ط¨ظ‚ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظƒط§ظ…ظ„)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000006',
  'ar',
  'ط¯ظٹطھط§ طھط¯ط´ظ† ط®ط· ط¹طµط± ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ ط¨ظ…ط¹ط§ظٹظٹط± ط³ظ„ط§ظ…ط© ط§ظ„ط؛ط°ط§ط،',
  'ط£ط¹ظ„ظ†طھ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¹ظ† طھط¯ط´ظٹظ† ط®ط· ط¬ط¯ظٹط¯ ظ„ط¹طµط± ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯ ط¶ظ…ظ† ظ…ظ†ط¸ظˆظ…ط© ط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹطŒ ط¨ط·ط§ظ‚ط© ط¥ظ†طھط§ط¬ظٹط© ط¹ط§ظ„ظٹط© ظˆظ…ط¹ط§ظٹظٹط± طµط§ط±ظ…ط© ظ„ط³ظ„ط§ظ…ط© ط§ظ„ط؛ط°ط§ط، ظˆط§ظ„ط¬ظˆط¯ط©.',
  'ط¯ط´ظ†طھ ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط®ط· ط¥ظ†طھط§ط¬ ط¬ط¯ظٹط¯ط§ ظ„ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ظ…ط¹طµظˆط± ط¹ظ„ظ‰ ط§ظ„ط¨ط§ط±ط¯طŒ ظپظٹ ط®ط·ظˆط© طھظˆط³ط¹ ط­ط¶ظˆط±ظ‡ط§ ظپظٹ ط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹ ط¥ظ„ظ‰ ط¬ط§ظ†ط¨ ط£ظ†ط´ط·ط© ط§ظ„طھط¬ط§ط±ط© ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظ„ظˆط¬ط³طھظٹط©. ظˆظٹط¹طھظ…ط¯ ط§ظ„ط®ط· طھظ‚ظ†ظٹط© ط§ظ„ط¹طµط± ط§ظ„ط¨ط§ط±ط¯ ظ„ظ„ط­ظپط§ط¸ ط¹ظ„ظ‰ ط§ظ„ظ†ظƒظ‡ط© ط§ظ„ط·ط¨ظٹط¹ظٹط© ظˆط§ظ„ظ‚ظٹظ…ط© ط§ظ„ط؛ط°ط§ط¦ظٹط© ظ„ظ„ط³ظ…ط³ظ… ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظپط§ط®ط±.

ظٹط®ط¶ط¹ ط§ظ„ط¥ظ†طھط§ط¬ ظ„ظپط­ظˆطµ ظ…ط®ط¨ط±ظٹط© ط¯ظ‚ظٹظ‚ط© طھط´ظ…ظ„ ط§ظ„ط­ظ…ظˆط¶ط© ظˆط§ظ„ط±ط·ظˆط¨ط© ظˆظ†ط³ط¨ط© ط§ظ„ط´ظˆط§ط¦ط¨طŒ ظ…ط¹ ط§ظ„ط§ظ„طھط²ط§ظ… ط§ظ„طµط§ط±ظ… ط¨ط§ط´طھط±ط§ط·ط§طھ ط§ظ„ظ†ط¸ط§ظپط© ظˆط§ظ„طھط¹ط¨ط¦ط© ط§ظ„ط؛ط°ط§ط¦ظٹط©. ظƒظ…ط§ طھظ… طھط¬ظ‡ظٹط² ظˆط­ط¯ط© طھط±ط´ظٹط­ ظˆطھط¹ط¨ط¦ط© ط­ط¯ظٹط«ط© طھط¶ظ…ظ† ط«ط¨ط§طھ ط§ظ„ط¬ظˆط¯ط© ظ…ظ† ط§ظ„ط¯ظپط¹ط© ط§ظ„ط£ظˆظ„ظ‰ ط­طھظ‰ ط§ظ„طھط³ظ„ظٹظ… ط§ظ„ظ†ظ‡ط§ط¦ظٹ.

ظٹط³طھظ‡ط¯ظپ ط§ظ„ط¥ظ†طھط§ط¬ ط§ظ„ط¬ط¯ظٹط¯ ط§ظ„ط³ظˆظ‚ ط§ظ„ظ…ط­ظ„ظٹ ظˆط£ط³ظˆط§ظ‚ ط§ظ„ط®ظ„ظٹط¬ ظˆط´ط±ظ‚ ط¢ط³ظٹط§طŒ ظ…ط¹ ط¥طھط§ط­ط© ط§ظ„طھط¹ط¨ط¦ط© ط¨ظƒظ…ظٹط§طھ ط§ظ„ط¬ظ…ظ„ط© ظˆط§ظ„طھط¬ط²ط¦ط© ط­ط³ط¨ ط·ظ„ط¨ ط§ظ„ط¹ظ…ظ„ط§ط،. ظˆطھظˆظپط± ط¯ظٹطھط§ ط¹ظٹظ†ط§طھ ظ…ط¹طھظ…ط¯ط© ظˆط´ظ‡ط§ط¯ط§طھ طھط­ظ„ظٹظ„ ظ„ظƒظ„ ط´ط­ظ†ط© طµط§ط¯ط±ط©.

ظٹظ…ط«ظ„ ظ‡ط°ط§ ط§ظ„ط®ط· ط§ظ…طھط¯ط§ط¯ط§ ظ„ط§ط³طھط±ط§طھظٹط¬ظٹط© ط¯ظٹطھط§ ظپظٹ طھط¹ط¸ظٹظ… ط§ظ„ظ‚ظٹظ…ط© ط§ظ„ظ…ط¶ط§ظپط© ظ„ظ„ظ…ط­ط§طµظٹظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط©طŒ ظˆظپطھط­ ظ‚ظ†ظˆط§طھ طھطµط¯ظٹط±ظٹط© ط¬ط¯ظٹط¯ط© ظ„ط²ظٹطھ ط³ظ…ط³ظ… ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ط¨ط¹ظ„ط§ظ…ط© ط³ظˆط¯ط§ظ†ظٹط© ظ…ظˆط«ظˆظ‚ط©.',
  'cold-pressed-sesame-oil-line'
),
(
  '30000000-0000-4000-8000-000000000006',
  'en',
  'Deta Launches Cold-Pressed Sesame Oil Line to Food-Safety Standards',
  'Deta Group has launched a new cold-pressed sesame oil line within its food-manufacturing division, with high production capacity and strict food-safety and quality standards.',
  'Deta Group has commissioned a new cold-pressed sesame oil line, expanding its food-manufacturing footprint alongside trade and logistics services. The line uses cold-press technology to preserve the natural flavor and nutritional value of premium Sudanese sesame.

Every batch undergoes rigorous laboratory testing for acidity, moisture, and impurity levels, under strict hygiene and food-grade packing controls. A modern filtration and filling unit ensures consistent quality from the first batch to final delivery.

The new output targets the domestic market as well as Gulf and East Asian buyers, with bulk and retail packing available to order. Deta provides approved samples and a certificate of analysis for every outbound shipment.

The line extends Deta strategy of adding value to Sudanese crops and opening new export channels for high-quality sesame oil under a trusted Sudanese brand.',
  'cold-pressed-sesame-oil-line'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 7) طھط­ظ„ظٹظ„ ط§ظ„ط·ظ„ط¨ ط§ظ„طµظٹظ†ظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط±
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000007',
  'ط§ظ„ط·ظ„ط¨ ط§ظ„طµظٹظ†ظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط± ظپظٹ 2025: ظ…ظٹط²ط© ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط©',
  'china-groundnut-market-2025',
  'طھط­ظ„ظٹظ„ ظ„ط§طھط¬ط§ظ‡ط§طھ ط§ظ„ط·ظ„ط¨ ط§ظ„طµظٹظ†ظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط± ظپظٹ 2025طŒ ظˆظ„ظ…ط§ط°ط§ طھطھظپظˆظ‚ ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¨ط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„ط­ط¬ظ… ط¹ط¨ط± ظ…ظ…ط± ط§ظ„ط¯ط¨ط© ط§ظ„ظ„ظˆط¬ط³طھظٹ.',
  'ظٹظˆط§طµظ„ ط§ظ„ط³ظˆظ‚ ط§ظ„طµظٹظ†ظٹ ط¥ط¸ظ‡ط§ط± ط·ظ„ط¨ ظ‚ظˆظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط± ظپظٹ 2025طŒ ظ…ط¯ظپظˆط¹ط§ ط¨طµظ†ط§ط¹ط§طھ ط§ظ„ط²ظٹظˆطھ ظˆط§ظ„ط­ظ„ظˆظٹط§طھ ظˆط§ظ„ظˆط¬ط¨ط§طھ ط§ظ„ط®ظپظٹظپط©. ظˆطھط¨ط­ط« ط§ظ„ظ…طµط§ظ†ط¹ ط§ظ„طµظٹظ†ظٹط© ط¹ظ† ط¥ظ…ط¯ط§ط¯ط§طھ ظ…ط³طھظ‚ط±ط© ط¨ظ…ظˆط§طµظپط§طھ طھط­ط¬ظٹظ… ظˆط§ط¶ط­ط© ظˆظ†ط³ط¨ط© ظƒط³ط± ظ…ظ†ط®ظپط¶ط©.

طھطھظ…ظٹط² ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¨ط­ط¬ظ…ظ‡ط§ ط§ظ„ط¬ظٹط¯ ظˆظ†ظƒظ‡طھظ‡ط§ ظˆظ‚ط¯ط±طھظ‡ط§ ط§ظ„طھظ†ط§ظپط³ظٹط© ط§ظ„ط³ط¹ط±ظٹط©طŒ ظ…ط¹ طھط­ط³ظ† ظ…ظ„ط­ظˆط¸ ظپظٹ ط¹ظ…ظ„ظٹط§طھ ط§ظ„ظپط±ط² ظˆط§ظ„طھط¯ط±ظٹط¬ ظˆط§ظ„طھط¹ط¨ط¦ط©. ظˆطھظ…ظ†ط­ ظ‡ط°ظ‡ ط§ظ„ظ…ط²ط§ظٹط§ ط§ظ„ظ…طµط¯ط±ظٹظ† ط§ظ„ط³ظˆط¯ط§ظ†ظٹظٹظ† ط£ظپط¶ظ„ظٹط© ظپظٹ ط¹ظ‚ظˆط¯ ط§ظ„طھظˆط±ظٹط¯ ط·ظˆظٹظ„ط© ط§ظ„ط£ط¬ظ„ ظ…ظ‚ط§ط±ظ†ط© ط¨ظ…ظ†ط§ط´ط¦ ط£ط®ط±ظ‰.

ظٹظ„ط¹ط¨ ظ…ظ…ط± ط§ظ„ط¯ط¨ط© ط¯ظˆط±ط§ ظ…ط­ظˆط±ظٹط§ ظپظٹ طھط³ط±ظٹط¹ ط­ط±ظƒط© ط§ظ„ط´ط­ظ†ط§طھ ظ…ظ† ظ…ظ†ط§ط·ظ‚ ط§ظ„ط¥ظ†طھط§ط¬ ط¥ظ„ظ‰ ظ…ظˆط§ظ†ط¦ ط§ظ„طھطµط¯ظٹط±طŒ ظ…ظ…ط§ ظٹط®ظپط¶ ط²ظ…ظ† ط§ظ„طھط³ظ„ظٹظ… ظˆطھظƒط§ظ„ظٹظپ ط§ظ„ظ…ظ†ط§ظˆظ„ط©. ظˆطھط³طھظپظٹط¯ ط¯ظٹطھط§ ظ…ظ† ط´ط¨ظƒط© ظ…ظˆط±ط¯ظٹظ† ظˆظ…ط®ط§ط²ظ† ظ…ط¬ظ‡ط²ط© ظ„ظ„ظپط­طµ ظˆط¥ط¹ط§ط¯ط© ط§ظ„ظپط±ط² ظ‚ط¨ظ„ ط§ظ„ط´ط­ظ†.

طھظˆطµظٹ ط¯ظٹطھط§ ط§ظ„ظ…ط´طھط±ظٹظ† ط¨طھط«ط¨ظٹطھ ط§ظ„ظ…ظˆط§طµظپط§طھ ظ…ط¨ظƒط±ط§طŒ ظˆط·ظ„ط¨ ط¹ظٹظ†ط§طھ ظ…ط¹طھظ…ط¯ط© ظˆط´ظ‡ط§ط¯ط§طھ طھط­ظ„ظٹظ„طŒ ظˆط¬ط¯ظˆظ„ط© ط§ظ„ط´ط­ظ†ط§طھ ط®ط§ط±ط¬ ط°ط±ظˆط© ط§ظ„ظ…ظˆط³ظ… ظ„ط¶ظ…ط§ظ† ط£ظپط¶ظ„ ط§ظ„ط£ط³ط¹ط§ط± ظˆطھظˆط§ظپط± ط§ظ„ط£ط­ط¬ط§ظ… ط§ظ„ظ…ط·ظ„ظˆط¨ط©.',
  'ظ…. ظ…ط­ظ…ط¯ ط§ظ„ظپط§طھط­ ط¹ط¨ط¯ ط§ظ„ظ„ظ‡',
  'ط±ط¤ظ‰ ط§ظ„ط³ظˆظ‚',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/china-groundnut-market-2025.jpg',
  false,
  '2026-04-12 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000007');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ‚ط§ظ„ 7 (ط¹ط±ط¨ظٹ ظ…ط·ط§ط¨ظ‚ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظƒط§ظ…ظ„)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000007',
  'ar',
  'ط§ظ„ط·ظ„ط¨ ط§ظ„طµظٹظ†ظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط± ظپظٹ 2025: ظ…ظٹط²ط© ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط©',
  'طھط­ظ„ظٹظ„ ظ„ط§طھط¬ط§ظ‡ط§طھ ط§ظ„ط·ظ„ط¨ ط§ظ„طµظٹظ†ظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط± ظپظٹ 2025طŒ ظˆظ„ظ…ط§ط°ط§ طھطھظپظˆظ‚ ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¨ط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„ط­ط¬ظ… ط¹ط¨ط± ظ…ظ…ط± ط§ظ„ط¯ط¨ط© ط§ظ„ظ„ظˆط¬ط³طھظٹ.',
  'ظٹظˆط§طµظ„ ط§ظ„ط³ظˆظ‚ ط§ظ„طµظٹظ†ظٹ ط¥ط¸ظ‡ط§ط± ط·ظ„ط¨ ظ‚ظˆظٹ ط¹ظ„ظ‰ ط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظ…ظ‚ط´ظˆط± ظپظٹ 2025طŒ ظ…ط¯ظپظˆط¹ط§ ط¨طµظ†ط§ط¹ط§طھ ط§ظ„ط²ظٹظˆطھ ظˆط§ظ„ط­ظ„ظˆظٹط§طھ ظˆط§ظ„ظˆط¬ط¨ط§طھ ط§ظ„ط®ظپظٹظپط©. ظˆطھط¨ط­ط« ط§ظ„ظ…طµط§ظ†ط¹ ط§ظ„طµظٹظ†ظٹط© ط¹ظ† ط¥ظ…ط¯ط§ط¯ط§طھ ظ…ط³طھظ‚ط±ط© ط¨ظ…ظˆط§طµظپط§طھ طھط­ط¬ظٹظ… ظˆط§ط¶ط­ط© ظˆظ†ط³ط¨ط© ظƒط³ط± ظ…ظ†ط®ظپط¶ط©.

طھطھظ…ظٹط² ط§ظ„ط­ط¨ظˆط¨ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¨ط­ط¬ظ…ظ‡ط§ ط§ظ„ط¬ظٹط¯ ظˆظ†ظƒظ‡طھظ‡ط§ ظˆظ‚ط¯ط±طھظ‡ط§ ط§ظ„طھظ†ط§ظپط³ظٹط© ط§ظ„ط³ط¹ط±ظٹط©طŒ ظ…ط¹ طھط­ط³ظ† ظ…ظ„ط­ظˆط¸ ظپظٹ ط¹ظ…ظ„ظٹط§طھ ط§ظ„ظپط±ط² ظˆط§ظ„طھط¯ط±ظٹط¬ ظˆط§ظ„طھط¹ط¨ط¦ط©. ظˆطھظ…ظ†ط­ ظ‡ط°ظ‡ ط§ظ„ظ…ط²ط§ظٹط§ ط§ظ„ظ…طµط¯ط±ظٹظ† ط§ظ„ط³ظˆط¯ط§ظ†ظٹظٹظ† ط£ظپط¶ظ„ظٹط© ظپظٹ ط¹ظ‚ظˆط¯ ط§ظ„طھظˆط±ظٹط¯ ط·ظˆظٹظ„ط© ط§ظ„ط£ط¬ظ„ ظ…ظ‚ط§ط±ظ†ط© ط¨ظ…ظ†ط§ط´ط¦ ط£ط®ط±ظ‰.

ظٹظ„ط¹ط¨ ظ…ظ…ط± ط§ظ„ط¯ط¨ط© ط¯ظˆط±ط§ ظ…ط­ظˆط±ظٹط§ ظپظٹ طھط³ط±ظٹط¹ ط­ط±ظƒط© ط§ظ„ط´ط­ظ†ط§طھ ظ…ظ† ظ…ظ†ط§ط·ظ‚ ط§ظ„ط¥ظ†طھط§ط¬ ط¥ظ„ظ‰ ظ…ظˆط§ظ†ط¦ ط§ظ„طھطµط¯ظٹط±طŒ ظ…ظ…ط§ ظٹط®ظپط¶ ط²ظ…ظ† ط§ظ„طھط³ظ„ظٹظ… ظˆطھظƒط§ظ„ظٹظپ ط§ظ„ظ…ظ†ط§ظˆظ„ط©. ظˆطھط³طھظپظٹط¯ ط¯ظٹطھط§ ظ…ظ† ط´ط¨ظƒط© ظ…ظˆط±ط¯ظٹظ† ظˆظ…ط®ط§ط²ظ† ظ…ط¬ظ‡ط²ط© ظ„ظ„ظپط­طµ ظˆط¥ط¹ط§ط¯ط© ط§ظ„ظپط±ط² ظ‚ط¨ظ„ ط§ظ„ط´ط­ظ†.

طھظˆطµظٹ ط¯ظٹطھط§ ط§ظ„ظ…ط´طھط±ظٹظ† ط¨طھط«ط¨ظٹطھ ط§ظ„ظ…ظˆط§طµظپط§طھ ظ…ط¨ظƒط±ط§طŒ ظˆط·ظ„ط¨ ط¹ظٹظ†ط§طھ ظ…ط¹طھظ…ط¯ط© ظˆط´ظ‡ط§ط¯ط§طھ طھط­ظ„ظٹظ„طŒ ظˆط¬ط¯ظˆظ„ط© ط§ظ„ط´ط­ظ†ط§طھ ط®ط§ط±ط¬ ط°ط±ظˆط© ط§ظ„ظ…ظˆط³ظ… ظ„ط¶ظ…ط§ظ† ط£ظپط¶ظ„ ط§ظ„ط£ط³ط¹ط§ط± ظˆطھظˆط§ظپط± ط§ظ„ط£ط­ط¬ط§ظ… ط§ظ„ظ…ط·ظ„ظˆط¨ط©.',
  'china-groundnut-market-2025'
),
(
  '30000000-0000-4000-8000-000000000007',
  'en',
  'Chinese Shelled Groundnut Demand in 2025: The Sudanese Kernel Advantage',
  'An analysis of Chinese demand trends for shelled groundnuts in 2025, and why Sudanese kernels stand out on quality and sizing through the Al-Dabba logistics corridor.',
  'The Chinese market continues to show strong demand for shelled groundnuts in 2025, driven by the oil, confectionery, and snack industries. Chinese processors are seeking stable supply with clear count sizes and low broken rates.

Sudanese kernels stand out for good size, flavor, and competitive pricing, with marked improvement in sorting, grading, and packing operations. These strengths give Sudanese exporters an edge in long-term supply contracts against other origins.

The Al-Dabba corridor plays a central role in speeding cargo from production zones to export ports, cutting lead times and handling costs. Deta leverages a network of suppliers and equipped warehouses for inspection and re-sorting before shipment.

Deta advises buyers to lock specifications early, request approved samples and analysis certificates, and schedule shipments outside peak season to secure the best prices and availability of required counts.',
  'china-groundnut-market-2025'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 8) طھط؛ظ„ظٹظپ طµط§ط¯ط±ط§طھ طµط¯ظٹظ‚ ظ„ظ„ط¨ظٹط¦ط© ط¨ظ…ط¹ط§ظٹظٹط± ط§ظ„ط؛ط°ط§ط،
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000008',
  'طھط؛ظ„ظٹظپ طµط§ط¯ط±ط§طھ طµط¯ظٹظ‚ ظ„ظ„ط¨ظٹط¦ط©: ط£ظƒظٹط§ط³ 25 ظˆ50 ظƒظٹظ„ظˆ ط¨ظ…ط¹ط§ظٹظٹط± ط§ظ„ط؛ط°ط§ط، ط§ظ„ط¹ط§ظ„ظ…ظٹط©',
  'eco-friendly-export-packaging',
  'طھط¹طھظ…ط¯ ط¯ظٹطھط§ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25 ظˆ50 ظƒظٹظ„ظˆ ظ…ط¹ ط¨ط·ط§ظ†ط§طھ ط؛ط°ط§ط¦ظٹط© ظˆطھط؛ظ„ظٹظپ ظ‚ط§ط¨ظ„ ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط¯ظˆظٹط± ظٹظ„ط¨ظٹ ط§ط´طھط±ط§ط·ط§طھ ظ…ط´طھط±ظٹ ط§ظ„ط§طھط­ط§ط¯ ط§ظ„ط£ظˆط±ظˆط¨ظٹ ظˆط§ظ„ط®ظ„ظٹط¬.',
  'ط£طµط¨ط­ ط§ظ„طھط؛ظ„ظٹظپ ط§ظ„ظ…ط³طھط¯ط§ظ… ط´ط±ط·ط§ ط£ط³ط§ط³ظٹط§ ظ„ط¯ط®ظˆظ„ ط£ط³ظˆط§ظ‚ ط§ظ„ط§طھط­ط§ط¯ ط§ظ„ط£ظˆط±ظˆط¨ظٹ ظˆط§ظ„ط®ظ„ظٹط¬طŒ ظ„ط§ ظ…ط¬ط±ط¯ ظ…ظٹط²ط© ط¥ط¶ط§ظپظٹط©. ظˆظ„ظ‡ط°ط§ طھط¹طھظ…ط¯ ط¯ظٹطھط§ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25 ظˆ50 ظƒظٹظ„ظˆ ظ…ط¯ط¹ظˆظ…ط© ط¨ط¨ط·ط§ظ†ط§طھ ط؛ط°ط§ط¦ظٹط© طھط­ظ…ظٹ ظ…ظ† ط§ظ„ط±ط·ظˆط¨ط© ظˆط§ظ„طھظ„ظˆط«.

طµظ…ظ…طھ ظ…ظ†ط¸ظˆظ…ط© ط§ظ„طھط؛ظ„ظٹظپ ظ„ظ„ط­ظپط§ط¸ ط¹ظ„ظ‰ ط¬ظˆط¯ط© ط§ظ„ط³ظ…ط³ظ… ظˆط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظˆط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط·ظˆط§ظ„ ط±ط­ظ„ط© ط§ظ„ط´ط­ظ† ظˆط§ظ„طھط®ط²ظٹظ†. ظˆطھط´ظ…ظ„ ط§ظ„ظ…ظˆط§طµظپط§طھ ط®ظٹط§ط·ط© ظ…ط­ظƒظ…ط© ظˆط¨ط·ط§ظ‚ط§طھ طھطھط¨ط¹ ظˆط§ط¶ط­ط© ظˆط®ظٹط§ط±ط§طھ طھط؛ظ„ظٹظپ ظ…ط²ط¯ظˆط¬ ظ„ظ„ط´ط­ظ†ط§طھ ط§ظ„ط­ط³ط§ط³ط©.

طھظ„طھط²ظ… ط¯ظٹطھط§ ط¨ط®ط§ظ…ط§طھ ظ‚ط§ط¨ظ„ط© ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط¯ظˆظٹط± ظˆطھظ‚ظ„ظٹظ„ ط§ظ„ط¨ظ„ط§ط³طھظٹظƒ ط£ط­ط§ط¯ظٹ ط§ظ„ط§ط³طھط®ط¯ط§ظ… ط­ظٹط«ظ…ط§ ط£ظ…ظƒظ†طŒ ط¯ظˆظ† ط§ظ„ظ…ط³ط§ط³ ط¨ط³ظ„ط§ظ…ط© ط§ظ„ط؛ط°ط§ط،. ظƒظ…ط§ طھظˆظپط± ط·ط¨ط§ط¹ط© ظ…ط®طµطµط© ط¨ط´ط¹ط§ط± ط§ظ„ط¹ظ…ظٹظ„ ظˆط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ظˆط²ظ† ط¨ط¹ط¯ط© ظ„ط؛ط§طھ.

طھطھظٹط­ ظ‡ط°ظ‡ ط§ظ„ظ…ظ†ط¸ظˆظ…ط© ظ„ظ„ظ…ط³طھظˆط±ط¯ظٹظ† ط§ط³طھظ„ط§ظ…ط§ ط£ط³ط±ط¹ ظˆظپط­طµط§ ط£ط³ظ‡ظ„ ظˆطھظˆط§ظپظ‚ط§ ط£ط¹ظ„ظ‰ ظ…ط¹ ط£ظ†ط¸ظ…ط© ط§ظ„ط¬ظˆط¯ط© ط§ظ„ط£ظˆط±ظˆط¨ظٹط© ظˆط§ظ„ط®ظ„ظٹط¬ظٹط©طŒ ظ…ظ…ط§ ظٹط¹ط²ط² ط«ظ‚ط© ط§ظ„ط¹ظ…ظ„ط§ط، ظˆظٹط®ظپط¶ ظ†ط³ط¨ ط§ظ„ظ…ط±ظپظˆط¶ط§طھ.',
  'ط¯. ط³ط§ط±ط© ط£ط­ظ…ط¯ ط§ظ„ط­ط³ظ†',
  'ط§ط³طھط¯ط§ظ…ط©',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/eco-friendly-export-packaging.jpg',
  false,
  '2026-03-20 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000008');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ‚ط§ظ„ 8 (ط¹ط±ط¨ظٹ ظ…ط·ط§ط¨ظ‚ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظƒط§ظ…ظ„)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000008',
  'ar',
  'طھط؛ظ„ظٹظپ طµط§ط¯ط±ط§طھ طµط¯ظٹظ‚ ظ„ظ„ط¨ظٹط¦ط©: ط£ظƒظٹط§ط³ 25 ظˆ50 ظƒظٹظ„ظˆ ط¨ظ…ط¹ط§ظٹظٹط± ط§ظ„ط؛ط°ط§ط، ط§ظ„ط¹ط§ظ„ظ…ظٹط©',
  'طھط¹طھظ…ط¯ ط¯ظٹطھط§ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25 ظˆ50 ظƒظٹظ„ظˆ ظ…ط¹ ط¨ط·ط§ظ†ط§طھ ط؛ط°ط§ط¦ظٹط© ظˆطھط؛ظ„ظٹظپ ظ‚ط§ط¨ظ„ ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط¯ظˆظٹط± ظٹظ„ط¨ظٹ ط§ط´طھط±ط§ط·ط§طھ ظ…ط´طھط±ظٹ ط§ظ„ط§طھط­ط§ط¯ ط§ظ„ط£ظˆط±ظˆط¨ظٹ ظˆط§ظ„ط®ظ„ظٹط¬.',
  'ط£طµط¨ط­ ط§ظ„طھط؛ظ„ظٹظپ ط§ظ„ظ…ط³طھط¯ط§ظ… ط´ط±ط·ط§ ط£ط³ط§ط³ظٹط§ ظ„ط¯ط®ظˆظ„ ط£ط³ظˆط§ظ‚ ط§ظ„ط§طھط­ط§ط¯ ط§ظ„ط£ظˆط±ظˆط¨ظٹ ظˆط§ظ„ط®ظ„ظٹط¬طŒ ظ„ط§ ظ…ط¬ط±ط¯ ظ…ظٹط²ط© ط¥ط¶ط§ظپظٹط©. ظˆظ„ظ‡ط°ط§ طھط¹طھظ…ط¯ ط¯ظٹطھط§ ط£ظƒظٹط§ط³ PP ط¨ظˆط²ظ† 25 ظˆ50 ظƒظٹظ„ظˆ ظ…ط¯ط¹ظˆظ…ط© ط¨ط¨ط·ط§ظ†ط§طھ ط؛ط°ط§ط¦ظٹط© طھط­ظ…ظٹ ظ…ظ† ط§ظ„ط±ط·ظˆط¨ط© ظˆط§ظ„طھظ„ظˆط«.

طµظ…ظ…طھ ظ…ظ†ط¸ظˆظ…ط© ط§ظ„طھط؛ظ„ظٹظپ ظ„ظ„ط­ظپط§ط¸ ط¹ظ„ظ‰ ط¬ظˆط¯ط© ط§ظ„ط³ظ…ط³ظ… ظˆط§ظ„ظپظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ظˆط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط·ظˆط§ظ„ ط±ط­ظ„ط© ط§ظ„ط´ط­ظ† ظˆط§ظ„طھط®ط²ظٹظ†. ظˆطھط´ظ…ظ„ ط§ظ„ظ…ظˆط§طµظپط§طھ ط®ظٹط§ط·ط© ظ…ط­ظƒظ…ط© ظˆط¨ط·ط§ظ‚ط§طھ طھطھط¨ط¹ ظˆط§ط¶ط­ط© ظˆط®ظٹط§ط±ط§طھ طھط؛ظ„ظٹظپ ظ…ط²ط¯ظˆط¬ ظ„ظ„ط´ط­ظ†ط§طھ ط§ظ„ط­ط³ط§ط³ط©.

طھظ„طھط²ظ… ط¯ظٹطھط§ ط¨ط®ط§ظ…ط§طھ ظ‚ط§ط¨ظ„ط© ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط¯ظˆظٹط± ظˆطھظ‚ظ„ظٹظ„ ط§ظ„ط¨ظ„ط§ط³طھظٹظƒ ط£ط­ط§ط¯ظٹ ط§ظ„ط§ط³طھط®ط¯ط§ظ… ط­ظٹط«ظ…ط§ ط£ظ…ظƒظ†طŒ ط¯ظˆظ† ط§ظ„ظ…ط³ط§ط³ ط¨ط³ظ„ط§ظ…ط© ط§ظ„ط؛ط°ط§ط،. ظƒظ…ط§ طھظˆظپط± ط·ط¨ط§ط¹ط© ظ…ط®طµطµط© ط¨ط´ط¹ط§ط± ط§ظ„ط¹ظ…ظٹظ„ ظˆط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„ظˆط²ظ† ط¨ط¹ط¯ط© ظ„ط؛ط§طھ.

طھطھظٹط­ ظ‡ط°ظ‡ ط§ظ„ظ…ظ†ط¸ظˆظ…ط© ظ„ظ„ظ…ط³طھظˆط±ط¯ظٹظ† ط§ط³طھظ„ط§ظ…ط§ ط£ط³ط±ط¹ ظˆظپط­طµط§ ط£ط³ظ‡ظ„ ظˆطھظˆط§ظپظ‚ط§ ط£ط¹ظ„ظ‰ ظ…ط¹ ط£ظ†ط¸ظ…ط© ط§ظ„ط¬ظˆط¯ط© ط§ظ„ط£ظˆط±ظˆط¨ظٹط© ظˆط§ظ„ط®ظ„ظٹط¬ظٹط©طŒ ظ…ظ…ط§ ظٹط¹ط²ط² ط«ظ‚ط© ط§ظ„ط¹ظ…ظ„ط§ط، ظˆظٹط®ظپط¶ ظ†ط³ط¨ ط§ظ„ظ…ط±ظپظˆط¶ط§طھ.',
  'eco-friendly-export-packaging'
),
(
  '30000000-0000-4000-8000-000000000008',
  'en',
  'Eco-Friendly Export Packaging: 25 and 50kg Bags to Global Food Standards',
  'Deta uses 25 and 50kg PP bags with food-grade liners and recyclable packaging that meets the requirements of EU and GCC buyers.',
  'Sustainable packaging is now a core requirement for entering EU and GCC markets, not just an added bonus. Deta therefore uses 25 and 50kg PP bags reinforced with food-grade liners that protect against moisture and contamination.

The system is designed to preserve the quality of sesame, groundnuts, and hibiscus throughout shipping and storage. Specifications include secure stitching, clear traceability labels, and double-bag options for sensitive cargo.

Deta commits to recyclable materials and to reducing single-use plastics wherever possible, without compromising food safety. Custom printing with buyer logo, origin data, and weights is available in several languages.

The setup gives importers faster receiving, easier inspection, and stronger alignment with European and Gulf quality systems, building buyer confidence and reducing rejection rates.',
  'eco-friendly-export-packaging'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 9) ظ†ط¸ط§ظ… ط¯ظٹطھط§ ظ„طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط±
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000009',
  'ط°ط±ط§ط¹ ط¯ظٹطھط§ ط§ظ„ط¨ط±ظ…ط¬ظٹط© طھط·ظ„ظ‚ ظ†ط¸ط§ظ… طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط± ظ„ظ„ط¹ظ…ظ„ط§ط،',
  'deta-customs-tracking-software',
  'ط£ط·ظ„ظ‚طھ ط°ط±ط§ط¹ ط¯ظٹطھط§ ط§ظ„ط¨ط±ظ…ط¬ظٹط© ظ†ط¸ط§ظ…ط§ ظ…ظˆط­ط¯ط§ ظ„طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆط¥ط¯ط§ط±ط© ظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط±طŒ ظٹظ…ظ†ط­ ط§ظ„ط¹ظ…ظ„ط§ط، ط±ط¤ظٹط© ظ„ط­ط¸ظٹط© ظ…ظ† ط§ظ„طھط¹ط§ظ‚ط¯ ط­طھظ‰ ط§ظ„طھط³ظ„ظٹظ….',
  'ط£ط¹ظ„ظ†طھ ط°ط±ط§ط¹ ط¯ظٹطھط§ ط§ظ„ط¨ط±ظ…ط¬ظٹط© ط¹ظ† ط¥ط·ظ„ط§ظ‚ ظ†ط¸ط§ظ… ظ…طھظƒط§ظ…ظ„ ظ„طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆط¥ط¯ط§ط±ط© ظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط±طŒ ظٹط±ط¨ط· ظپط±ظ‚ ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط§ظ„طھط®ظ„ظٹطµ ظˆط§ظ„ظ…ط®ط§ط²ظ† ظˆط§ظ„ط¹ظ…ظ„ط§ط، ظپظٹ ظ…ظ†طµط© ظˆط§ط­ط¯ط©. ظˆظٹظ‡ط¯ظپ ط§ظ„ظ†ط¸ط§ظ… ط¥ظ„ظ‰ طھظ‚ظ„ظٹظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯ ط¹ظ„ظ‰ ط§ظ„ظ…ط±ط§ط³ظ„ط§طھ ط§ظ„ظ…ط´طھطھط© ظˆط±ظپط¹ ط¯ظ‚ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.

ظٹظˆظپط± ط§ظ„ظ†ط¸ط§ظ… ظ„ظ„ط¹ظ…ظٹظ„ ظ„ظˆط­ط© ظ…طھط§ط¨ط¹ط© ظ„ط­ط¸ظٹط© طھط¹ط±ط¶ ط­ط§ظ„ط© ط§ظ„ط·ظ„ط¨ ظˆظ…ط±ط§ط­ظ„ ط§ظ„ظپط­طµ ظˆط§ظ„طھط¹ط¨ط¦ط© ظˆط§ظ„ط´ط­ظ†طŒ ظ…ط¹ طھظ†ط¨ظٹظ‡ط§طھ طھظ„ظ‚ط§ط¦ظٹط© ط¹ظ†ط¯ ظƒظ„ طھط­ط¯ظٹط«. ظƒظ…ط§ ظٹطھظٹط­ طھط­ظ…ظٹظ„ ط§ظ„ظپظˆط§طھظٹط± ظˆط´ظ‡ط§ط¯ط§طھ ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„طھط­ظ„ظٹظ„ ظˆط¨ظˆط§ظ„طµ ط§ظ„ط´ط­ظ† ط¨طµظٹط؛ ط±ظ‚ظ…ظٹط© ظ…ظ†ط¸ظ…ط©.

ظٹط¹طھظ…ط¯ ط§ظ„ظ†ط¸ط§ظ… ط¹ظ„ظ‰ طµظ„ط§ط­ظٹط§طھ ط¯ظ‚ظٹظ‚ط© ظ„ظ„ط£ط¯ظˆط§ط± ظˆط³ط¬ظ„ طھط¯ظ‚ظٹظ‚ ظƒط§ظ…ظ„ ظ„ظƒظ„ ط¥ط¬ط±ط§ط،طŒ ظ…ظ…ط§ ظٹط¹ط²ط² ط§ظ„ط´ظپط§ظپظٹط© ظˆظٹظ‚ظ„ظ„ ط§ظ„ط£ط®ط·ط§ط، ظپظٹ ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„ط¬ظ…ط±ظƒظٹط©. ظˆظٹط¯ط¹ظ… ط§ظ„طھظƒط§ظ…ظ„ ظ…ط¹ ط§ظ„ط¨ط±ظٹط¯ ظˆط£ظ†ط¸ظ…ط© ط§ظ„طھط®ط²ظٹظ† ط§ظ„ط³ط­ط§ط¨ظٹ ظ„طھط³ط±ظٹط¹ طھط¨ط§ط¯ظ„ ط§ظ„ظ…ظ„ظپط§طھ.

طھظ…ط«ظ„ ظ‡ط°ظ‡ ط§ظ„ط®ط·ظˆط© ط§ظ…طھط¯ط§ط¯ط§ ط·ط¨ظٹط¹ظٹط§ ظ„ط®ط¨ط±ط© ط¯ظٹطھط§ ظپظٹ ط§ظ„طھط®ظ„ظٹطµ ط§ظ„ط¬ظ…ط±ظƒظٹ ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظ„ظˆط¬ط³طھظٹط©طŒ ظˆطھط¶ط¹ ط§ظ„طھظ‚ظ†ظٹط© ظپظٹ ط®ط¯ظ…ط© ط§ظ„ظ…طµط¯ط± ظˆط§ظ„ظ…ط³طھظˆط±ط¯ ط¹ط¨ط± طھط¬ط±ط¨ط© ط±ظ‚ظ…ظٹط© ظ…ظˆط­ط¯ط© ظˆظ…ظˆط«ظˆظ‚ط©.',
  'ظ…. ط®ط§ظ„ط¯ ظ…طµط·ظپظ‰ ط§ظ„ط£ظ…ظٹظ†',
  'طھظ‚ظ†ظٹط©',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-customs-tracking-software.jpg',
  false,
  '2026-02-28 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000009');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ‚ط§ظ„ 9 (ط¹ط±ط¨ظٹ ظ…ط·ط§ط¨ظ‚ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظƒط§ظ…ظ„)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000009',
  'ar',
  'ط°ط±ط§ط¹ ط¯ظٹطھط§ ط§ظ„ط¨ط±ظ…ط¬ظٹط© طھط·ظ„ظ‚ ظ†ط¸ط§ظ… طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط± ظ„ظ„ط¹ظ…ظ„ط§ط،',
  'ط£ط·ظ„ظ‚طھ ط°ط±ط§ط¹ ط¯ظٹطھط§ ط§ظ„ط¨ط±ظ…ط¬ظٹط© ظ†ط¸ط§ظ…ط§ ظ…ظˆط­ط¯ط§ ظ„طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆط¥ط¯ط§ط±ط© ظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط±طŒ ظٹظ…ظ†ط­ ط§ظ„ط¹ظ…ظ„ط§ط، ط±ط¤ظٹط© ظ„ط­ط¸ظٹط© ظ…ظ† ط§ظ„طھط¹ط§ظ‚ط¯ ط­طھظ‰ ط§ظ„طھط³ظ„ظٹظ….',
  'ط£ط¹ظ„ظ†طھ ط°ط±ط§ط¹ ط¯ظٹطھط§ ط§ظ„ط¨ط±ظ…ط¬ظٹط© ط¹ظ† ط¥ط·ظ„ط§ظ‚ ظ†ط¸ط§ظ… ظ…طھظƒط§ظ…ظ„ ظ„طھطھط¨ط¹ ط§ظ„ط·ظ„ط¨ط§طھ ظˆط¥ط¯ط§ط±ط© ظˆط«ط§ط¦ظ‚ ط§ظ„طھطµط¯ظٹط±طŒ ظٹط±ط¨ط· ظپط±ظ‚ ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط§ظ„طھط®ظ„ظٹطµ ظˆط§ظ„ظ…ط®ط§ط²ظ† ظˆط§ظ„ط¹ظ…ظ„ط§ط، ظپظٹ ظ…ظ†طµط© ظˆط§ط­ط¯ط©. ظˆظٹظ‡ط¯ظپ ط§ظ„ظ†ط¸ط§ظ… ط¥ظ„ظ‰ طھظ‚ظ„ظٹظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯ ط¹ظ„ظ‰ ط§ظ„ظ…ط±ط§ط³ظ„ط§طھ ط§ظ„ظ…ط´طھطھط© ظˆط±ظپط¹ ط¯ظ‚ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.

ظٹظˆظپط± ط§ظ„ظ†ط¸ط§ظ… ظ„ظ„ط¹ظ…ظٹظ„ ظ„ظˆط­ط© ظ…طھط§ط¨ط¹ط© ظ„ط­ط¸ظٹط© طھط¹ط±ط¶ ط­ط§ظ„ط© ط§ظ„ط·ظ„ط¨ ظˆظ…ط±ط§ط­ظ„ ط§ظ„ظپط­طµ ظˆط§ظ„طھط¹ط¨ط¦ط© ظˆط§ظ„ط´ط­ظ†طŒ ظ…ط¹ طھظ†ط¨ظٹظ‡ط§طھ طھظ„ظ‚ط§ط¦ظٹط© ط¹ظ†ط¯ ظƒظ„ طھط­ط¯ظٹط«. ظƒظ…ط§ ظٹطھظٹط­ طھط­ظ…ظٹظ„ ط§ظ„ظپظˆط§طھظٹط± ظˆط´ظ‡ط§ط¯ط§طھ ط§ظ„ظ…ظ†ط´ط£ ظˆط§ظ„طھط­ظ„ظٹظ„ ظˆط¨ظˆط§ظ„طµ ط§ظ„ط´ط­ظ† ط¨طµظٹط؛ ط±ظ‚ظ…ظٹط© ظ…ظ†ط¸ظ…ط©.

ظٹط¹طھظ…ط¯ ط§ظ„ظ†ط¸ط§ظ… ط¹ظ„ظ‰ طµظ„ط§ط­ظٹط§طھ ط¯ظ‚ظٹظ‚ط© ظ„ظ„ط£ط¯ظˆط§ط± ظˆط³ط¬ظ„ طھط¯ظ‚ظٹظ‚ ظƒط§ظ…ظ„ ظ„ظƒظ„ ط¥ط¬ط±ط§ط،طŒ ظ…ظ…ط§ ظٹط¹ط²ط² ط§ظ„ط´ظپط§ظپظٹط© ظˆظٹظ‚ظ„ظ„ ط§ظ„ط£ط®ط·ط§ط، ظپظٹ ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط§ظ„ط¬ظ…ط±ظƒظٹط©. ظˆظٹط¯ط¹ظ… ط§ظ„طھظƒط§ظ…ظ„ ظ…ط¹ ط§ظ„ط¨ط±ظٹط¯ ظˆط£ظ†ط¸ظ…ط© ط§ظ„طھط®ط²ظٹظ† ط§ظ„ط³ط­ط§ط¨ظٹ ظ„طھط³ط±ظٹط¹ طھط¨ط§ط¯ظ„ ط§ظ„ظ…ظ„ظپط§طھ.

طھظ…ط«ظ„ ظ‡ط°ظ‡ ط§ظ„ط®ط·ظˆط© ط§ظ…طھط¯ط§ط¯ط§ ط·ط¨ظٹط¹ظٹط§ ظ„ط®ط¨ط±ط© ط¯ظٹطھط§ ظپظٹ ط§ظ„طھط®ظ„ظٹطµ ط§ظ„ط¬ظ…ط±ظƒظٹ ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظ„ظˆط¬ط³طھظٹط©طŒ ظˆطھط¶ط¹ ط§ظ„طھظ‚ظ†ظٹط© ظپظٹ ط®ط¯ظ…ط© ط§ظ„ظ…طµط¯ط± ظˆط§ظ„ظ…ط³طھظˆط±ط¯ ط¹ط¨ط± طھط¬ط±ط¨ط© ط±ظ‚ظ…ظٹط© ظ…ظˆط­ط¯ط© ظˆظ…ظˆط«ظˆظ‚ط©.',
  'deta-customs-tracking-software'
),
(
  '30000000-0000-4000-8000-000000000009',
  'en',
  'Deta Software Arm Launches Order-Tracking and Export Documentation System',
  'The Deta software arm has released a unified order-tracking and export documentation system, giving clients live visibility from contracting to delivery.',
  'The Deta software arm has launched an integrated order-tracking and export documentation platform connecting sales, clearance, warehouse, and client teams in one place. The system reduces reliance on scattered correspondence and improves data accuracy.

Clients receive a live dashboard showing order status across inspection, packing, and shipping stages, with automatic alerts at every update. Invoices, certificates of origin and analysis, and bills of lading are available in organized digital formats.

The platform uses precise role-based permissions and a full audit log for every action, strengthening transparency and cutting errors in customs paperwork. It also integrates with email and cloud storage to speed file exchange.

The launch is a natural extension of Deta expertise in customs clearance and logistics, putting technology at the service of exporters and importers through one unified and reliable digital experience.',
  'deta-customs-tracking-software'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 10) ط±ط¤ظٹط© ط¯ظٹطھط§: ط®ط¨ط±ط© ظˆط´ط±ط§ظƒط§طھ ط¹ط¨ط± ط§ظ„ظ…ظ†ط·ظ‚ط© ظˆط§ظ„ط¹ط§ظ„ظ…
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000010',
  'ط±ط¤ظٹط© ط¯ظٹطھط§: ط£ظƒط«ط± ظ…ظ† 15 ط¹ط§ظ…ط§ ظˆ200 ظ…ط®طھطµ ظˆط´ط±ط§ظƒط§طھ ط¹ط¨ط± ط§ظ„ظ…ظ†ط·ظ‚ط© ظˆط§ظ„ط¹ط§ظ„ظ…',
  'deta-vision-partnerships',
  'طھط³طھط¹ط±ط¶ ظ‡ط°ظ‡ ط§ظ„ظ…ظ‚ط§ظ„ط© ط±ط¤ظٹط© ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¨ط®ط¨ط±ط© طھطھط¬ط§ظˆط² 15 ط¹ط§ظ…ط§ ظˆظپط±ظٹظ‚ ظٹط¶ظ… ط£ظƒط«ط± ظ…ظ† 200 ظ…ط®طھطµ ظˆط´ط±ط§ظƒط§طھ ظ…ظ…طھط¯ط© ظپظٹ ط§ظ„ط´ط±ظ‚ ط§ظ„ط£ظˆط³ط· ظˆط¢ط³ظٹط§ ظˆط£ظˆط±ظˆط¨ط§.',
  'طھظ‚ظˆظ… ط±ط¤ظٹط© ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¹ظ„ظ‰ ط¨ظ†ط§ط، ط¬ط³ظˆط± طھط¬ط§ط±ظٹط© ظ…ظˆط«ظˆظ‚ط© ط¨ظٹظ† ط§ظ„ط³ظˆط¯ط§ظ† ظˆط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©طŒ ط¨ط®ط¨ط±ط© طھطھط¬ط§ظˆط² 15 ط¹ط§ظ…ط§ ظپظٹ ط§ظ„طھط®ظ„ظٹطµ ط§ظ„ط¬ظ…ط±ظƒظٹ ظˆط§ظ„طھط¬ط§ط±ط© ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظ„ظˆط¬ط³طھظٹط© ظˆط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹ. ظˆطھط¬ظ…ط¹ ط§ظ„ظ…ط¬ظ…ظˆط¹ط© ط¹ط¯ط© ط£ط°ط±ط¹ ظ…طھظƒط§ظ…ظ„ط© طھط¹ظ…ظ„ ظƒظ…ظ†ط¸ظˆظ…ط© ظˆط§ط­ط¯ط©.

ظٹط¶ظ… ظپط±ظٹظ‚ ط¯ظٹطھط§ ط£ظƒط«ط± ظ…ظ† 200 ظ…ط®طھطµ ظپظٹ ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط§ظ„طھط®ظ„ظٹطµ ظˆط§ظ„ظ…ط®ط§ط²ظ† ظˆط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„طھظ‚ظ†ظٹط©طŒ ظٹط¹ظ…ظ„ظˆظ† ظˆظپظ‚ ط¥ط¬ط±ط§ط،ط§طھ ظ…ظˆط­ط¯ط© ظˆظ…ط¹ط§ظٹظٹط± ط³ظ„ط§ظ…ط© ط؛ط°ط§ط، طµط§ط±ظ…ط©. ظˆظ…ظƒظ† ظ‡ط°ط§ ط§ظ„طھظƒط§ظ…ظ„ ط§ظ„ظ…ط¬ظ…ظˆط¹ط© ظ…ظ† ط®ط¯ظ…ط© ط¹ظ…ظ„ط§ط، ظپظٹ ط§ظ„ط®ظ„ظٹط¬ ظˆط´ظ…ط§ظ„ ط£ظپط±ظٹظ‚ظٹط§ ظˆط¢ط³ظٹط§ ظˆط£ظˆط±ظˆط¨ط§ ط¨ظ…ظˆط«ظˆظ‚ظٹط© ط¹ط§ظ„ظٹط©.

طھط¨ظ†ظٹ ط¯ظٹطھط§ ط´ط±ط§ظƒط§طھ ط·ظˆظٹظ„ط© ط§ظ„ط£ط¬ظ„ ظ…ط¹ ط§ظ„ظ…ظˆط±ط¯ظٹظ† ظˆط§ظ„ظ…ط´طھط±ظٹظ† ظˆظˆظƒظ„ط§ط، ط§ظ„ط´ط­ظ†طŒ ظ‚ط§ط¦ظ…ط© ط¹ظ„ظ‰ ط§ظ„ط´ظپط§ظپظٹط© ظˆط§ظ„ط§ظ„طھط²ط§ظ… ط¨ط§ظ„ظ…ظˆط§طµظپط§طھ ظˆظ…ظˆط§ط¹ظٹط¯ ط§ظ„طھط³ظ„ظٹظ…. ظˆطھظˆظپط± ظ„ط´ط±ظƒط§ط¦ظ‡ط§ ط¹ظٹظ†ط§طھ ظ…ط¹طھظ…ط¯ط© ظˆظˆط«ط§ط¦ظ‚ ط±ظ‚ظ…ظٹط© ظ…ظ†ط¸ظ…ط© ظˆطھظˆط§طµظ„ط§ ظ…ط¨ط§ط´ط±ط§ ط¹ط¨ط± ط£ظ†ط¸ظ…طھظ‡ط§ ط§ظ„طھظ‚ظ†ظٹط©.

طھظˆط§طµظ„ ط§ظ„ظ…ط¬ظ…ظˆط¹ط© ط§ظ„ط§ط³طھط«ظ…ط§ط± ظپظٹ ط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹ ظˆط§ظ„طھط؛ظ„ظٹظپ ط§ظ„ظ…ط³طھط¯ط§ظ… ظˆط§ظ„طھط­ظˆظ„ ط§ظ„ط±ظ‚ظ…ظٹطŒ ظ„طھط¨ظ‚ظ‰ ط§ظ„ط´ط±ظٹظƒ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ط£ظˆظ„ ظ„ظ„ظ…ط³طھظˆط±ط¯ظٹظ† ط§ظ„ط¨ط§ط­ط«ظٹظ† ط¹ظ† ط¬ظˆط¯ط© ط«ط§ط¨طھط© ظˆطھظˆط±ظٹط¯ ظ…ط³طھظ‚ط± ظˆطھط¬ط±ط¨ط© طھط¹ط§ظ…ظ„ ط§ط­طھط±ط§ظپظٹط©.',
  'ط£. ط¹ط§ط¦ط´ط© ط¹ط¨ط¯ ط§ظ„ط±ط­ظ…ظ†',
  'ط£ط®ط¨ط§ط± ط§ظ„ط´ط±ظƒط©',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-vision-partnerships.jpg',
  false,
  '2026-01-15 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000010');

-- طھط±ط¬ظ…ط§طھ ط§ظ„ظ…ظ‚ط§ظ„ 10 (ط¹ط±ط¨ظٹ ظ…ط·ط§ط¨ظ‚ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظƒط§ظ…ظ„)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000010',
  'ar',
  'ط±ط¤ظٹط© ط¯ظٹطھط§: ط£ظƒط«ط± ظ…ظ† 15 ط¹ط§ظ…ط§ ظˆ200 ظ…ط®طھطµ ظˆط´ط±ط§ظƒط§طھ ط¹ط¨ط± ط§ظ„ظ…ظ†ط·ظ‚ط© ظˆط§ظ„ط¹ط§ظ„ظ…',
  'طھط³طھط¹ط±ط¶ ظ‡ط°ظ‡ ط§ظ„ظ…ظ‚ط§ظ„ط© ط±ط¤ظٹط© ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¨ط®ط¨ط±ط© طھطھط¬ط§ظˆط² 15 ط¹ط§ظ…ط§ ظˆظپط±ظٹظ‚ ظٹط¶ظ… ط£ظƒط«ط± ظ…ظ† 200 ظ…ط®طھطµ ظˆط´ط±ط§ظƒط§طھ ظ…ظ…طھط¯ط© ظپظٹ ط§ظ„ط´ط±ظ‚ ط§ظ„ط£ظˆط³ط· ظˆط¢ط³ظٹط§ ظˆط£ظˆط±ظˆط¨ط§.',
  'طھظ‚ظˆظ… ط±ط¤ظٹط© ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ط¹ظ„ظ‰ ط¨ظ†ط§ط، ط¬ط³ظˆط± طھط¬ط§ط±ظٹط© ظ…ظˆط«ظˆظ‚ط© ط¨ظٹظ† ط§ظ„ط³ظˆط¯ط§ظ† ظˆط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©طŒ ط¨ط®ط¨ط±ط© طھطھط¬ط§ظˆط² 15 ط¹ط§ظ…ط§ ظپظٹ ط§ظ„طھط®ظ„ظٹطµ ط§ظ„ط¬ظ…ط±ظƒظٹ ظˆط§ظ„طھط¬ط§ط±ط© ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظ„ظˆط¬ط³طھظٹط© ظˆط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹ. ظˆطھط¬ظ…ط¹ ط§ظ„ظ…ط¬ظ…ظˆط¹ط© ط¹ط¯ط© ط£ط°ط±ط¹ ظ…طھظƒط§ظ…ظ„ط© طھط¹ظ…ظ„ ظƒظ…ظ†ط¸ظˆظ…ط© ظˆط§ط­ط¯ط©.

ظٹط¶ظ… ظپط±ظٹظ‚ ط¯ظٹطھط§ ط£ظƒط«ط± ظ…ظ† 200 ظ…ط®طھطµ ظپظٹ ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط§ظ„طھط®ظ„ظٹطµ ظˆط§ظ„ظ…ط®ط§ط²ظ† ظˆط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„طھظ‚ظ†ظٹط©طŒ ظٹط¹ظ…ظ„ظˆظ† ظˆظپظ‚ ط¥ط¬ط±ط§ط،ط§طھ ظ…ظˆط­ط¯ط© ظˆظ…ط¹ط§ظٹظٹط± ط³ظ„ط§ظ…ط© ط؛ط°ط§ط، طµط§ط±ظ…ط©. ظˆظ…ظƒظ† ظ‡ط°ط§ ط§ظ„طھظƒط§ظ…ظ„ ط§ظ„ظ…ط¬ظ…ظˆط¹ط© ظ…ظ† ط®ط¯ظ…ط© ط¹ظ…ظ„ط§ط، ظپظٹ ط§ظ„ط®ظ„ظٹط¬ ظˆط´ظ…ط§ظ„ ط£ظپط±ظٹظ‚ظٹط§ ظˆط¢ط³ظٹط§ ظˆط£ظˆط±ظˆط¨ط§ ط¨ظ…ظˆط«ظˆظ‚ظٹط© ط¹ط§ظ„ظٹط©.

طھط¨ظ†ظٹ ط¯ظٹطھط§ ط´ط±ط§ظƒط§طھ ط·ظˆظٹظ„ط© ط§ظ„ط£ط¬ظ„ ظ…ط¹ ط§ظ„ظ…ظˆط±ط¯ظٹظ† ظˆط§ظ„ظ…ط´طھط±ظٹظ† ظˆظˆظƒظ„ط§ط، ط§ظ„ط´ط­ظ†طŒ ظ‚ط§ط¦ظ…ط© ط¹ظ„ظ‰ ط§ظ„ط´ظپط§ظپظٹط© ظˆط§ظ„ط§ظ„طھط²ط§ظ… ط¨ط§ظ„ظ…ظˆط§طµظپط§طھ ظˆظ…ظˆط§ط¹ظٹط¯ ط§ظ„طھط³ظ„ظٹظ…. ظˆطھظˆظپط± ظ„ط´ط±ظƒط§ط¦ظ‡ط§ ط¹ظٹظ†ط§طھ ظ…ط¹طھظ…ط¯ط© ظˆظˆط«ط§ط¦ظ‚ ط±ظ‚ظ…ظٹط© ظ…ظ†ط¸ظ…ط© ظˆطھظˆط§طµظ„ط§ ظ…ط¨ط§ط´ط±ط§ ط¹ط¨ط± ط£ظ†ط¸ظ…طھظ‡ط§ ط§ظ„طھظ‚ظ†ظٹط©.

طھظˆط§طµظ„ ط§ظ„ظ…ط¬ظ…ظˆط¹ط© ط§ظ„ط§ط³طھط«ظ…ط§ط± ظپظٹ ط§ظ„طھطµظ†ظٹط¹ ط§ظ„ط؛ط°ط§ط¦ظٹ ظˆط§ظ„طھط؛ظ„ظٹظپ ط§ظ„ظ…ط³طھط¯ط§ظ… ظˆط§ظ„طھط­ظˆظ„ ط§ظ„ط±ظ‚ظ…ظٹطŒ ظ„طھط¨ظ‚ظ‰ ط§ظ„ط´ط±ظٹظƒ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ط£ظˆظ„ ظ„ظ„ظ…ط³طھظˆط±ط¯ظٹظ† ط§ظ„ط¨ط§ط­ط«ظٹظ† ط¹ظ† ط¬ظˆط¯ط© ط«ط§ط¨طھط© ظˆطھظˆط±ظٹط¯ ظ…ط³طھظ‚ط± ظˆطھط¬ط±ط¨ط© طھط¹ط§ظ…ظ„ ط§ط­طھط±ط§ظپظٹط©.',
  'deta-vision-partnerships'
),
(
  '30000000-0000-4000-8000-000000000010',
  'en',
  'Deta Group Vision: 15 Plus Years, 200 Plus Specialists, and Global Partnerships',
  'This article presents the Deta Group vision, with more than 15 years of experience, a team of over 200 specialists, and partnerships across MENA, Asia, and Europe.',
  'The Deta Group vision is built on trusted trade bridges between Sudan and world markets, with more than 15 years of experience in customs clearance, trade, logistics, and food manufacturing. Its integrated divisions operate as one system.

The Deta team includes more than 200 specialists in sales, clearance, warehousing, quality, and technology, working to unified procedures and strict food-safety standards. This integration allows the group to serve clients across the Gulf, North Africa, Asia, and Europe with high reliability.

Deta builds long-term partnerships with suppliers, buyers, and freight agents, grounded in transparency, specification compliance, and on-time delivery. Partners receive approved samples, organized digital documents, and direct communication through its technical systems.

The group continues to invest in food manufacturing, sustainable packaging, and digital transformation, remaining the first Sudanese partner of choice for importers seeking consistent quality, stable supply, and a professional working experience.',
  'deta-vision-partnerships'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ظ†ظ‡ط§ظٹط© ط§ظ„ظ…ظ„ظپ: 5 ظ…ظ‚ط§ظ„ط§طھ + 10 طھط±ط¬ظ…ط§طھ (ar+en ظ„ظƒظ„ ظ…ظ‚ط§ظ„)
 -- =============================================================
-- 06_settings_media.sql
-- ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ظˆظ‚ط¹ ط§ظ„ط£ط³ط§ط³ظٹط© + ط§ظ„طھط±ط¬ظ…ط§طھ + طµظˆط± ط§ظ„ط®ظ„ظپظٹط© + ط§ظ„ظˆط³ط§ط¦ط·
-- ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ: Postgres (Supabase)
-- ظ…ظ„ط§ط­ط¸ط©: ظ‡ط°ط§ ط§ظ„ظ…ظ„ظپ ط¢ظ…ظ† ظ„ظ„طھظƒط±ط§ط± (idempotent)
--   - site_settings: ON CONFLICT (key) DO NOTHING
--   - site_setting_translations: ON CONFLICT (setting_key, language_code) DO NOTHING
--   - background_images: ط­ظ…ط§ظٹط© ط¨ظ€ WHERE NOT EXISTS
--   - media: ط­ظ…ط§ظٹط© ط¨ظ€ WHERE NOT EXISTS ط¹ظ„ظ‰ url
-- =============================================================

-- -------------------------------------------------------------
-- 1) ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ظˆظ‚ط¹ ط§ظ„ط£ط³ط§ط³ظٹط© (site_settings)
-- ط§ظ„ط£ط¹ظ…ط¯ط©: key, value, description, type
-- ط§ظ„ظ†ظˆط¹ 'text' ظ„ظ„ظƒظ„ ظ…ط§ ط¹ط¯ط§ ط§ظ„ط£ط±ظ‚ط§ظ… ظپط§ظ„ظ†ظˆط¹ 'number'
-- -------------------------------------------------------------
INSERT INTO site_settings (key, value, description, type) VALUES
  ('company_name', 'ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظ„ظ„طµط§ط¯ط±ط§طھ ط§ظ„ط²ط±ط§ط¹ظٹط©', 'ط§ط³ظ… ط§ظ„ط´ط±ظƒط© ط§ظ„ط±ط³ظ…ظٹ', 'text'),
  ('company_tagline', 'ظ…ظ† ط§ظ„ط­ظ‚ظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¥ظ„ظ‰ ط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©', 'ط§ظ„ط´ط¹ط§ط± ط§ظ„ط±ط¦ظٹط³ظٹ ظ„ظ„ط´ط±ظƒط©', 'text'),
  ('phone', '+249183000000', 'ط±ظ‚ظ… ظ‡ط§طھظپ ط§ظ„ط´ط±ظƒط©', 'text'),
  ('email', 'info@deta.sd', 'ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ ط§ظ„ط±ط³ظ…ظٹ', 'text'),
  ('address', 'ط§ظ„ط®ط±ط·ظˆظ…طŒ ط§ظ„ط³ظˆط¯ط§ظ† - ط´ط§ط±ط¹ ط§ظ„ظ†ظٹظ„', 'ط¹ظ†ظˆط§ظ† ط§ظ„ط´ط±ظƒط©', 'text'),
  ('working_hours', 'ط§ظ„ط£ط­ط¯ - ط§ظ„ط®ظ…ظٹط³: 8طµ - 5ظ…', 'ط³ط§ط¹ط§طھ ط§ظ„ط¹ظ…ظ„ ط§ظ„ط±ط³ظ…ظٹط©', 'text'),
  ('facebook', 'https://facebook.com/detagroup', 'ط±ط§ط¨ط· ظپظٹط³ط¨ظˆظƒ', 'text'),
  ('twitter', 'https://twitter.com/detagroup', 'ط±ط§ط¨ط· طھظˆظٹطھط±', 'text'),
  ('linkedin', 'https://linkedin.com/company/detagroup', 'ط±ط§ط¨ط· ظ„ظٹظ†ظƒط¯ط¥ظ†', 'text'),
  ('instagram', 'https://instagram.com/detagroup', 'ط±ط§ط¨ط· ط§ظ†ط³طھط؛ط±ط§ظ…', 'text'),
  ('years_experience', '15', 'ط³ظ†ظˆط§طھ ط§ظ„ط®ط¨ط±ط©', 'number'),
  ('employees_count', '200', 'ط¹ط¯ط¯ ط§ظ„ظ…ظˆط¸ظپظٹظ†', 'number'),
  ('export_countries', '12', 'ط¹ط¯ط¯ ط¯ظˆظ„ ط§ظ„طھطµط¯ظٹط±', 'number'),
  ('hero_badge', 'ط±ط§ط¦ط¯ظˆظ† ظپظٹ طھطµط¯ظٹط± ط§ظ„ظ…ط­ط§طµظٹظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط©', 'ط´ط§ط±ط© ط§ظ„ظˆط§ط¬ظ‡ط© ط§ظ„ط±ط¦ظٹط³ظٹط©', 'text'),
  ('footer_about', 'ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظ„ظ„طµط§ط¯ط±ط§طھ ط§ظ„ط²ط±ط§ط¹ظٹط© ط´ط±ظƒط© ط³ظˆط¯ط§ظ†ظٹط© ط±ط§ط¦ط¯ط© ظپظٹ طھطµط¯ظٹط± ط§ظ„ظ…ط­ط§طµظٹظ„ ط¹ط§ظ„ظٹط© ط§ظ„ط¬ظˆط¯ط© ط¥ظ„ظ‰ ط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©. ظ†ظ„طھط²ظ… ط¨ط£ط¹ظ„ظ‰ ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„ط§ط³طھط¯ط§ظ…ط© ظ„ط¨ظ†ط§ط، ط´ط±ط§ظƒط§طھ ط·ظˆظٹظ„ط© ط§ظ„ط£ظ…ط¯ ظ…ط¹ ط¹ظ…ظ„ط§ط¦ظ†ط§ ط­ظˆظ„ ط§ظ„ط¹ط§ظ„ظ….', 'ظ†ط¨ط°ط© ظ‚طµظٹط±ط© ط¹ظ† ط§ظ„ط´ط±ظƒط© ظپظٹ ط§ظ„طھط°ظٹظٹظ„', 'text')
ON CONFLICT (key) DO NOTHING;

-- -------------------------------------------------------------
-- 2) طھط±ط¬ظ…ط§طھ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ (site_setting_translations)
-- ط§ظ„ط£ط¹ظ…ط¯ط©: setting_key, language_code, value
-- ط¹ط±ط¨ظٹ + ط¥ظ†ط¬ظ„ظٹط²ظٹ ظ„ظ„ظ…ظپط§طھظٹط­: company_tagline, footer_about, hero_badge, address, working_hours
-- -------------------------------------------------------------
INSERT INTO site_setting_translations (setting_key, language_code, value) VALUES
  -- ط§ظ„ط´ط¹ط§ط± ط§ظ„ط±ط¦ظٹط³ظٹ
  ('company_tagline', 'ar', 'ظ…ظ† ط§ظ„ط­ظ‚ظˆظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط© ط¥ظ„ظ‰ ط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©'),
  ('company_tagline', 'en', 'From Sudan''s Fields to Global Markets'),
  -- ظ†ط¨ط°ط© ط§ظ„طھط°ظٹظٹظ„
  ('footer_about', 'ar', 'ظ…ط¬ظ…ظˆط¹ط© ط¯ظٹطھط§ ظ„ظ„طµط§ط¯ط±ط§طھ ط§ظ„ط²ط±ط§ط¹ظٹط© ط´ط±ظƒط© ط³ظˆط¯ط§ظ†ظٹط© ط±ط§ط¦ط¯ط© ظپظٹ طھطµط¯ظٹط± ط§ظ„ظ…ط­ط§طµظٹظ„ ط¹ط§ظ„ظٹط© ط§ظ„ط¬ظˆط¯ط© ط¥ظ„ظ‰ ط§ظ„ط£ط³ظˆط§ظ‚ ط§ظ„ط¹ط§ظ„ظ…ظٹط©. ظ†ظ„طھط²ظ… ط¨ط£ط¹ظ„ظ‰ ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„ط§ط³طھط¯ط§ظ…ط© ظ„ط¨ظ†ط§ط، ط´ط±ط§ظƒط§طھ ط·ظˆظٹظ„ط© ط§ظ„ط£ظ…ط¯ ظ…ط¹ ط¹ظ…ظ„ط§ط¦ظ†ط§ ط­ظˆظ„ ط§ظ„ط¹ط§ظ„ظ….'),
  ('footer_about', 'en', 'Deta Group for Agricultural Exports is a leading Sudanese company exporting high-quality crops to global markets. We uphold the highest standards of quality and sustainability to build long-lasting partnerships with our clients worldwide.'),
  -- ط´ط§ط±ط© ط§ظ„ظˆط§ط¬ظ‡ط©
  ('hero_badge', 'ar', 'ط±ط§ط¦ط¯ظˆظ† ظپظٹ طھطµط¯ظٹط± ط§ظ„ظ…ط­ط§طµظٹظ„ ط§ظ„ط³ظˆط¯ط§ظ†ظٹط©'),
  ('hero_badge', 'en', 'Leaders in Exporting Sudanese Crops'),
  -- ط§ظ„ط¹ظ†ظˆط§ظ†
  ('address', 'ar', 'ط§ظ„ط®ط±ط·ظˆظ…طŒ ط§ظ„ط³ظˆط¯ط§ظ† - ط´ط§ط±ط¹ ط§ظ„ظ†ظٹظ„'),
  ('address', 'en', 'Khartoum, Sudan - Nile Street'),
  -- ط³ط§ط¹ط§طھ ط§ظ„ط¹ظ…ظ„
  ('working_hours', 'ar', 'ط§ظ„ط£ط­ط¯ - ط§ظ„ط®ظ…ظٹط³: 8طµ - 5ظ…'),
  ('working_hours', 'en', 'Sunday - Thursday: 8 AM - 5 PM')
ON CONFLICT (setting_key, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- 3) طµظˆط± ط§ظ„ط®ظ„ظپظٹط© (background_images)
-- ط§ظ„ط£ط¹ظ…ط¯ط©: title, description, url, file_path, is_active, display_order
-- ط§ظ„طµظˆط±: hero/slide-1..6.jpg ظپظٹ ط¨ط§ظƒطھ background-images
-- ط§ظ„ط­ظ…ط§ظٹط©: WHERE NOT EXISTS
-- -------------------------------------------------------------

-- ط§ظ„ط´ط±ظٹط­ط© 1: ط­ظ‚ظˆظ„ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ط­ظ‚ظˆظ„ ط§ظ„ط³ظ…ط³ظ… ظپظٹ ط§ظ„ظ‚ط¶ط§ط±ظپ', 'ط­ظ‚ظˆظ„ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ط®ط¶ط±ط§ط، ط§ظ„ظ…ظ…طھط¯ط© ظپظٹ ظˆظ„ط§ظٹط© ط§ظ„ظ‚ط¶ط§ط±ظپ ط´ط±ظ‚ ط§ظ„ط³ظˆط¯ط§ظ†.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg', NULL, true, 1
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg');

-- ط§ظ„ط´ط±ظٹط­ط© 2: ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ظ…ظ† ظƒط±ط¯ظپط§ظ†
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ظ…ظ† ظƒط±ط¯ظپط§ظ†', 'ط£ط´ط¬ط§ط± ط§ظ„ظ‡ط´ط§ط¨ ط§ظ„ظ…ظ†طھط¬ط© ظ„ط£ط¬ظˆط¯ ط£ظ†ظˆط§ط¹ ط§ظ„طµظ…ط؛ ط§ظ„ط¹ط±ط¨ظٹ ظپظٹ ظƒط±ط¯ظپط§ظ†.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg', NULL, true, 2
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg');

-- ط§ظ„ط´ط±ظٹط­ط© 3: ط®ط· ط¹طµط± ط§ظ„ط²ظٹظˆطھ
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ط®ط· ط¹طµط± ط§ظ„ط²ظٹظˆطھ', 'ط®ط·ظˆط· ط§ظ„ط¹طµط± ط§ظ„ط¨ط§ط±ط¯ ط§ظ„ط­ط¯ظٹط«ط© ظ„ط¥ظ†طھط§ط¬ ط²ظٹطھ ط§ظ„ط³ظ…ط³ظ… ط§ظ„ظ†ظ‚ظٹ.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg', NULL, true, 3
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg');

-- ط§ظ„ط´ط±ظٹط­ط© 4: ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† ظ„ظ„طھطµط¯ظٹط±
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ† ظ„ظ„طھطµط¯ظٹط±', 'ط¹ظ…ظ„ظٹط§طھ ط§ظ„ط´ط­ظ† ظˆط§ظ„ط­ط§ظˆظٹط§طھ ط§ظ„ط¬ط§ظ‡ط²ط© ظ„ظ„طھطµط¯ظٹط± ظ…ظ† ظ…ظٹظ†ط§ط، ط¨ظˆط±طھط³ظˆط¯ط§ظ†.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg', NULL, true, 4
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg');

-- ط§ظ„ط´ط±ظٹط­ط© 5: ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ', 'ط²ظ‡ط±ط§طھ ط§ظ„ظƒط±ظƒط¯ظٹظ‡ ط§ظ„ط³ظˆط¯ط§ظ†ظٹ ط§ظ„ظپط§ط®ط± ط§ظ„ظ…ط¬ظپظپ ط¨ط¹ظ†ط§ظٹط© ظ„ظ„طھطµط¯ظٹط±.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg', NULL, true, 5
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg');

-- ط§ظ„ط´ط±ظٹط­ط© 6: ظپط±ظٹظ‚ ط¯ظٹطھط§ ظ„ظ„طھظ‚ظ†ظٹط©
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ظپط±ظٹظ‚ ط¯ظٹطھط§ ظ„ظ„طھظ‚ظ†ظٹط©', 'ظپط±ظٹظ‚ ط¯ظٹطھط§ ظٹط¬ظ…ط¹ ط¨ظٹظ† ط§ظ„ط®ط¨ط±ط© ط§ظ„ط²ط±ط§ط¹ظٹط© ظˆط§ظ„ط­ظ„ظˆظ„ ط§ظ„طھظ‚ظ†ظٹط© ط§ظ„ط­ط¯ظٹط«ط©.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg', NULL, true, 6
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg');

-- -------------------------------------------------------------
-- 4) ط§ظ„ظˆط³ط§ط¦ط· (media)
-- ط§ظ„ط£ط¹ظ…ط¯ط©: name, url, type, size_bytes, uploaded_by
-- ط§ظ„ظ†ظˆط¹: image/jpeg - ط§ظ„ط±ظپط¹: seed
-- ط§ظ„ظ‚ط§ط¹ط¯ط© ط§ظ„ط£ط³ط§ط³ظٹط© ظ„ظ„ظ…ظ†طھط¬ط§طھ ظˆط§ظ„ظ…ظ‚ط§ظ„ط§طھ: https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/
-- طµظˆط± ط§ظ„ظˆط§ط¬ظ‡ط© ظپظٹ ط¨ط§ظƒطھ background-images
-- ط§ظ„ط­ظ…ط§ظٹط©: WHERE NOT EXISTS (SELECT 1 FROM media WHERE url='<url>')
-- -------------------------------------------------------------

-- ظ…ظ†طھط¬ط§طھ (12): طµظˆط± ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ط²ط±ط§ط¹ظٹط©
INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-natural-gadaref.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-natural-gadaref.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-natural-gadaref.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-hulled-premium.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-premium.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-premium.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-hulled-standard.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-standard.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-standard.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-hashab-handpicked.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-hashab-handpicked.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-hashab-handpicked.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-talha.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-talha.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-talha.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-powder-spray-dried.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-powder-spray-dried.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-powder-spray-dried.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'peanut-kernels-8090.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-kernels-8090.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-kernels-8090.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'peanut-inshell.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-inshell.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-inshell.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'hibiscus-whole.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/hibiscus-whole.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/hibiscus-whole.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sorghum-feterita.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sorghum-feterita.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sorghum-feterita.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'watermelon-seeds.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/watermelon-seeds.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/watermelon-seeds.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-oil-cold-pressed.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-oil-cold-pressed.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-oil-cold-pressed.jpg');

-- ظ…ظ‚ط§ظ„ط§طھ (10): طµظˆط± ط§ظ„ظ…ظ‚ط§ظ„ط§طھ ط­ط³ط¨ ط§ظ„ط³ظ„ط§ظ‚
INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-harvest-2026.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sesame-harvest-2026.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sesame-harvest-2026.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-arabic-grades-guide.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/gum-arabic-grades-guide.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/gum-arabic-grades-guide.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sudan-export-documents-guide.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sudan-export-documents-guide.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sudan-export-documents-guide.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'port-sudan-logistics.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/port-sudan-logistics.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/port-sudan-logistics.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'hibiscus-quality-standards.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/hibiscus-quality-standards.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/hibiscus-quality-standards.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'cold-pressed-sesame-oil-line.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/cold-pressed-sesame-oil-line.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/cold-pressed-sesame-oil-line.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'china-groundnut-market-2025.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/china-groundnut-market-2025.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/china-groundnut-market-2025.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'eco-friendly-export-packaging.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/eco-friendly-export-packaging.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/eco-friendly-export-packaging.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'deta-customs-tracking-software.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-customs-tracking-software.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-customs-tracking-software.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'deta-vision-partnerships.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-vision-partnerships.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-vision-partnerships.jpg');

-- طµظˆط± ط§ظ„ظˆط§ط¬ظ‡ط© (6): ظ†ظپط³ ط±ظˆط§ط¨ط· background-images ظپظٹ ط¨ط§ظƒطھ background-images
INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-1.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-2.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-3.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-4.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-5.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-6.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg');


