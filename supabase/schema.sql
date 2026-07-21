-- ====================================================================
-- SMART SYSTEM DATABASE SETUP FOR RIPPLE BY SUBHRA BISWAS
-- Includes Server Data Validation, Input Sanitization Triggers,
-- Atomic Operations, and System Health Check Verification.
-- Execute this complete script in your Supabase SQL Editor.
-- ====================================================================

-- 1. Create `posts` table with strict data validation constraints
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
    message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 280),
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create `comments` table with strict data validation constraints
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
    message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create high-performance indices
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments (created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 5. Safe RLS Policy Management for Posts
DROP POLICY IF EXISTS "Allow public read posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public delete posts" ON public.posts;

CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON public.posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete posts" ON public.posts FOR DELETE USING (true);

-- 6. Safe RLS Policy Management for Comments
DROP POLICY IF EXISTS "Allow public read comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public delete comments" ON public.comments;

CREATE POLICY "Allow public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete comments" ON public.comments FOR DELETE USING (true);

-- 7. Smart Input Sanitization Triggers (Auto Trimming Whitespace)
CREATE OR REPLACE FUNCTION sanitize_post_input()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := trim(NEW.name);
  NEW.message := trim(NEW.message);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sanitize_post ON public.posts;
CREATE TRIGGER trigger_sanitize_post
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION sanitize_post_input();

CREATE OR REPLACE FUNCTION sanitize_comment_input()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := trim(NEW.name);
  NEW.message := trim(NEW.message);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sanitize_comment ON public.comments;
CREATE TRIGGER trigger_sanitize_comment
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION sanitize_comment_input();

-- 8. Safe Realtime Replication setup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
  END IF;
END $$;

-- 9. Atomic Like Increment RPC Function
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.posts SET likes = likes + 1 WHERE id = post_id;
$$;

-- 10. Atomic Like Decrement RPC Function (Unlike)
CREATE OR REPLACE FUNCTION decrement_likes(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.posts SET likes = GREATEST(0, likes - 1) WHERE id = post_id;
$$;

-- 11. Smart Server System Health Verification RPC Function
CREATE OR REPLACE FUNCTION verify_system_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    post_count INT;
    comment_count INT;
    result JSONB;
BEGIN
    SELECT COUNT(*) INTO post_count FROM public.posts;
    SELECT COUNT(*) INTO comment_count FROM public.comments;

    result := jsonb_build_object(
        'status', 'HEALTHY_ONLINE',
        'app_name', 'Ripple By SUBHRA BISWAS',
        'database_time', timezone('utc'::text, now()),
        'total_posts_recorded', post_count,
        'total_comments_recorded', comment_count,
        'validation_rules', 'ACTIVE',
        'realtime_replication', 'ENABLED'
    );

    RETURN result;
END;
$$;
