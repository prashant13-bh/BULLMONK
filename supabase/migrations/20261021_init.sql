-- ==============================================================================
-- BULLMONK Sovereign Intelligence - Supabase Architecture & Storage Schema
-- ==============================================================================

-- 1. Create Storage Buckets (Public for Media & Documents)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('documents', 'documents', true),
  ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Security Policies (Allow Public Read & Authorized Inserts)
CREATE POLICY "Public Read Access for Documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Public Read Access for Media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Allow Uploads to Documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow Uploads to Media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'media');

-- 3. Dynamic Reader Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  author TEXT NOT NULL,
  affiliation TEXT NOT NULL DEFAULT 'Institutional Analyst',
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Comments" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Public Insert Comments" 
ON public.comments FOR INSERT 
WITH CHECK (true);

-- 4. Dynamic Newsroom Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  deck TEXT,
  content TEXT NOT NULL,
  key_takeaways JSONB DEFAULT '[]'::jsonb,
  author JSONB NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  read_time TEXT DEFAULT '5 min read',
  hero_image TEXT,
  image_caption TEXT,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Articles" 
ON public.articles FOR SELECT 
USING (true);

CREATE POLICY "Allow Insert Custom Articles" 
ON public.articles FOR INSERT 
WITH CHECK (true);
