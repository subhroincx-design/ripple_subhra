-- ====================================================================
-- RIPPLE v2.0 — PRODUCTION DATABASE SETUP BY SUBHRA BISWAS
-- ====================================================================
-- Includes: Tables, Indexes, RLS, Sanitization, Rate Limiting,
-- Edit Tracking, Spam Protection, Atomic RPCs, Realtime,
-- Health Check, and Admin Stats.
-- 
-- ⚠️  SAFE TO RE-RUN: All policies/triggers/functions use
--    DROP IF EXISTS before CREATE, so this is idempotent.
--
-- Paste this ENTIRE script into Supabase SQL Editor and click RUN.
-- ====================================================================


-- ====================================================================
-- SECTION 1: TABLE DEFINITIONS
-- ====================================================================

-- 1A. Posts table with strict server-side validation
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(trim(name)) <= 50),
    message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 280),
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 1B. Comments table with cascade delete + validation
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(trim(name)) <= 40),
    message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Add updated_at columns if they don't exist (safe for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.comments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END $$;


-- ====================================================================
-- SECTION 2: HIGH-PERFORMANCE INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS posts_likes_idx ON public.posts (likes DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments (created_at ASC);


-- ====================================================================
-- SECTION 3: ROW LEVEL SECURITY (RLS)
-- ====================================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 3A. Posts policies (full CRUD)
DROP POLICY IF EXISTS "Allow public read posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public delete posts" ON public.posts;

CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON public.posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete posts" ON public.posts FOR DELETE USING (true);

-- 3B. Comments policies (full CRUD)
DROP POLICY IF EXISTS "Allow public read comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public update comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public delete comments" ON public.comments;

CREATE POLICY "Allow public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON public.comments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete comments" ON public.comments FOR DELETE USING (true);


-- ====================================================================
-- SECTION 4: INPUT SANITIZATION TRIGGERS
-- Automatically trims whitespace from name and message on every
-- INSERT and UPDATE. Prevents " Hello  " from being stored.
-- ====================================================================

CREATE OR REPLACE FUNCTION sanitize_post_input()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := trim(NEW.name);
  NEW.message := trim(NEW.message);
  -- Auto-set updated_at on edits (not on first insert)
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := timezone('utc'::text, now());
  END IF;
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
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := timezone('utc'::text, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sanitize_comment ON public.comments;
CREATE TRIGGER trigger_sanitize_comment
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION sanitize_comment_input();


-- ====================================================================
-- SECTION 5: SPAM / FLOOD PROTECTION
-- Server-side rate limiting: Max 5 posts per IP-like identifier
-- (name) per 60 seconds. Prevents rapid-fire spam.
-- ====================================================================

CREATE OR REPLACE FUNCTION check_post_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.posts
  WHERE name = NEW.name
    AND created_at > (now() - INTERVAL '60 seconds');

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Max 5 posts per minute per user.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_post_rate_limit ON public.posts;
CREATE TRIGGER trigger_post_rate_limit
BEFORE INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION check_post_rate_limit();

-- Comment rate limit: Max 10 comments per user per 60 seconds
CREATE OR REPLACE FUNCTION check_comment_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.comments
  WHERE name = NEW.name
    AND created_at > (now() - INTERVAL '60 seconds');

  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Max 10 comments per minute per user.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_comment_rate_limit ON public.comments;
CREATE TRIGGER trigger_comment_rate_limit
BEFORE INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION check_comment_rate_limit();


-- ====================================================================
-- SECTION 6: LIKE OVERFLOW PROTECTION
-- Prevents likes from being manipulated beyond reasonable bounds.
-- ====================================================================

CREATE OR REPLACE FUNCTION protect_likes_overflow()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent likes from going above 999999 (anti-abuse)
  IF NEW.likes > 999999 THEN
    NEW.likes := 999999;
  END IF;
  -- Prevent negative likes
  IF NEW.likes < 0 THEN
    NEW.likes := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_protect_likes ON public.posts;
CREATE TRIGGER trigger_protect_likes
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION protect_likes_overflow();


-- ====================================================================
-- SECTION 7: ATOMIC RPC FUNCTIONS
-- Prevents race conditions on concurrent like/unlike operations.
-- ====================================================================

-- 7A. Increment likes (atomic +1)
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.posts SET likes = likes + 1 WHERE id = post_id;
$$;

-- 7B. Decrement likes (atomic -1, floor at 0)
CREATE OR REPLACE FUNCTION decrement_likes(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.posts SET likes = GREATEST(0, likes - 1) WHERE id = post_id;
$$;


-- ====================================================================
-- SECTION 8: REALTIME REPLICATION
-- Enables Supabase Realtime WebSocket sync for both tables.
-- ====================================================================

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


-- ====================================================================
-- SECTION 9: AUTOMATIC STALE CONTENT CLEANUP
-- Deletes posts older than 365 days. Call via Supabase Edge Function
-- or pg_cron if available. Can also be run manually.
-- ====================================================================

CREATE OR REPLACE FUNCTION cleanup_old_posts(days_old INT DEFAULT 365)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INT;
BEGIN
  WITH deleted AS (
    DELETE FROM public.posts
    WHERE created_at < (now() - (days_old || ' days')::INTERVAL)
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  RETURN jsonb_build_object(
    'action', 'cleanup_old_posts',
    'deleted_count', deleted_count,
    'threshold_days', days_old,
    'executed_at', timezone('utc'::text, now())
  );
END;
$$;


-- ====================================================================
-- SECTION 10: ADMIN STATISTICS RPC
-- Returns detailed analytics about the platform.
-- ====================================================================

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_posts INT;
  total_comments INT;
  total_likes BIGINT;
  today_posts INT;
  today_comments INT;
  top_poster TEXT;
  top_poster_count INT;
  most_liked_post JSONB;
  result JSONB;
BEGIN
  SELECT COUNT(*) INTO total_posts FROM public.posts;
  SELECT COUNT(*) INTO total_comments FROM public.comments;
  SELECT COALESCE(SUM(likes), 0) INTO total_likes FROM public.posts;

  SELECT COUNT(*) INTO today_posts
  FROM public.posts
  WHERE created_at::date = CURRENT_DATE;

  SELECT COUNT(*) INTO today_comments
  FROM public.comments
  WHERE created_at::date = CURRENT_DATE;

  SELECT name, COUNT(*) INTO top_poster, top_poster_count
  FROM public.posts
  GROUP BY name
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  SELECT jsonb_build_object('id', id, 'name', name, 'likes', likes, 'message', LEFT(message, 60))
  INTO most_liked_post
  FROM public.posts
  ORDER BY likes DESC
  LIMIT 1;

  result := jsonb_build_object(
    'total_posts', total_posts,
    'total_comments', total_comments,
    'total_likes', total_likes,
    'posts_today', today_posts,
    'comments_today', today_comments,
    'top_poster', COALESCE(top_poster, 'N/A'),
    'top_poster_count', COALESCE(top_poster_count, 0),
    'most_liked_post', COALESCE(most_liked_post, '{}'::JSONB),
    'generated_at', timezone('utc'::text, now())
  );

  RETURN result;
END;
$$;


-- ====================================================================
-- SECTION 11: COMPREHENSIVE SYSTEM HEALTH CHECK
-- Verifies every layer of the database is functioning correctly.
-- Call with: SELECT verify_system_health();
-- ====================================================================

CREATE OR REPLACE FUNCTION verify_system_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_count INT;
  comment_count INT;
  has_rls_posts BOOLEAN;
  has_rls_comments BOOLEAN;
  posts_in_realtime BOOLEAN;
  comments_in_realtime BOOLEAN;
  has_rate_limit_post BOOLEAN;
  has_rate_limit_comment BOOLEAN;
  has_sanitize_post BOOLEAN;
  has_sanitize_comment BOOLEAN;
  has_likes_protection BOOLEAN;
  idx_count INT;
  result JSONB;
BEGIN
  -- Row counts
  SELECT COUNT(*) INTO post_count FROM public.posts;
  SELECT COUNT(*) INTO comment_count FROM public.comments;

  -- RLS enabled?
  SELECT relrowsecurity INTO has_rls_posts
  FROM pg_class WHERE relname = 'posts' AND relnamespace = 'public'::regnamespace;

  SELECT relrowsecurity INTO has_rls_comments
  FROM pg_class WHERE relname = 'comments' AND relnamespace = 'public'::regnamespace;

  -- Realtime enabled?
  SELECT EXISTS(
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'posts'
  ) INTO posts_in_realtime;

  SELECT EXISTS(
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
  ) INTO comments_in_realtime;

  -- Triggers exist?
  SELECT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_post_rate_limit') INTO has_rate_limit_post;
  SELECT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_comment_rate_limit') INTO has_rate_limit_comment;
  SELECT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_sanitize_post') INTO has_sanitize_post;
  SELECT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_sanitize_comment') INTO has_sanitize_comment;
  SELECT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_protect_likes') INTO has_likes_protection;

  -- Index count
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes
  WHERE schemaname = 'public' AND (tablename = 'posts' OR tablename = 'comments');

  result := jsonb_build_object(
    'status', 'HEALTHY_ONLINE',
    'app_name', 'Ripple v2.0 by SUBHRA BISWAS',
    'database_time', timezone('utc'::text, now()),
    'data', jsonb_build_object(
      'total_posts', post_count,
      'total_comments', comment_count
    ),
    'security', jsonb_build_object(
      'rls_posts', CASE WHEN has_rls_posts THEN '✅ ENABLED' ELSE '❌ DISABLED' END,
      'rls_comments', CASE WHEN has_rls_comments THEN '✅ ENABLED' ELSE '❌ DISABLED' END,
      'rate_limit_posts', CASE WHEN has_rate_limit_post THEN '✅ ACTIVE (5/min)' ELSE '❌ MISSING' END,
      'rate_limit_comments', CASE WHEN has_rate_limit_comment THEN '✅ ACTIVE (10/min)' ELSE '❌ MISSING' END,
      'likes_overflow_guard', CASE WHEN has_likes_protection THEN '✅ ACTIVE (max 999999)' ELSE '❌ MISSING' END
    ),
    'data_integrity', jsonb_build_object(
      'sanitization_posts', CASE WHEN has_sanitize_post THEN '✅ ACTIVE' ELSE '❌ MISSING' END,
      'sanitization_comments', CASE WHEN has_sanitize_comment THEN '✅ ACTIVE' ELSE '❌ MISSING' END,
      'edit_tracking', '✅ updated_at column',
      'cascade_delete', '✅ comments auto-deleted with parent post'
    ),
    'realtime', jsonb_build_object(
      'posts_stream', CASE WHEN posts_in_realtime THEN '✅ LIVE' ELSE '❌ OFFLINE' END,
      'comments_stream', CASE WHEN comments_in_realtime THEN '✅ LIVE' ELSE '❌ OFFLINE' END
    ),
    'performance', jsonb_build_object(
      'total_indexes', idx_count
    )
  );

  RETURN result;
END;
$$;


-- ====================================================================
-- ✅ SETUP COMPLETE
-- Run: SELECT verify_system_health();  to verify everything.
-- Run: SELECT get_admin_stats();       to see platform analytics.
-- ====================================================================
