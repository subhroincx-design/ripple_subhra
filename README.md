# ⚡ Pulse — Anonymous Microblogging Platform

A production-quality anonymous microblogging web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase Realtime**.

Inspired by modern social media platforms with a sleek dark theme, responsive 3-column layout, real-time message feeds, optimistic like interactions, character counting, and URL-secured admin deletion capabilities.

---

## ✨ Features

- ⚡ **Zero Friction**: No sign up, login, or passwords required. Users simply enter a Name and Message to post.
- 🎨 **X-Inspired 3-Column Layout**: Left Sidebar (Navigation), Center Feed (Composer & Posts), Right Sidebar (Live Statistics & Project Info).
- 💬 **Live Supabase Realtime**: New posts stream instantly across open browser windows without refreshing.
- 🎨 **Initials Avatar Generator**: Automatic gradient avatar generated from author name initials.
- 🕒 **Relative Timestamps**: Humanized time badges (`Just now`, `5m`, `2h`, `Yesterday`).
- ✍️ **Smart Composer**: Live 280-character limit counter with color warning indicators (amber at 240+, red at 270+) and auto-scroll on submission.
- ❤️ **Optimistic Likes**: Instant visual feedback and heart animation with atomic backend incrementing.
- 🔐 **URL-Secured Admin Deletion**: Delete buttons are **only rendered** when the page URL contains `?admin=YOUR_SECRET_KEY` (e.g. `http://localhost:3000/?admin=secret123`). Standard visitors never see delete options.
- 📱 **Fully Responsive**: Adapts seamlessly to Desktop, Tablet, and Mobile viewports with a collapsible navigation drawer.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Realtime**: Supabase (`@supabase/supabase-js`)
- **Icons**: Lucide React
- **Animations**: Framer Motion & Canvas Confetti

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Install Dependencies

```bash
# Install npm dependencies
npm install
```

### 2. Configure Supabase Environment Variables

Create a file named `.env.local` in the root of your project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Secret Key for Post Deletion
NEXT_PUBLIC_ADMIN_SECRET=secret123
```

> 💡 **Where to find Supabase keys?**
> 1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
> 2. Open **Project Settings** -> **API**
> 3. Copy your **Project URL** and `anon` `public` key into `.env.local`.

---

## 🗄️ Database Setup (Supabase SQL Schema)

Open your Supabase project's **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql):

```sql
-- 1. Create the `posts` table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    message TEXT NOT NULL CHECK (char_length(message) <= 280),
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index for sorting by newest
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow public read access" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update likes" ON public.posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.posts FOR DELETE USING (true);

-- 5. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- 6. Atomic like increment function
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.posts SET likes = likes + 1 WHERE id = post_id;
$$;
```

---

## 💻 Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To test **Admin Deletion Mode**, open:
[http://localhost:3000/?admin=secret123](http://localhost:3000/?admin=secret123)

---

## 🌐 Deploying to Vercel

1. Push your code to a GitHub/GitLab repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_SECRET`
5. Click **Deploy**. Vercel will automatically build and publish your Next.js 15 application!

---

## 📁 Project Structure

```
.
├── app/
│   ├── globals.css         # Dark theme CSS tokens & animations
│   ├── layout.tsx          # Root layout with fonts & SEO tags
│   └── page.tsx            # Main 3-column responsive layout
├── components/
│   ├── AboutModal.tsx      # Info modal dialog
│   ├── CreatePost.tsx      # Post composer card with character counter
│   ├── EmptyState.tsx      # Empty feed visual
│   ├── Feed.tsx            # Main post feed container
│   ├── Header.tsx          # Mobile navigation header & drawer
│   ├── LeftSidebar.tsx     # Left navigation column
│   ├── LoadingSkeleton.tsx # Pulse loading skeleton
│   ├── PostCard.tsx        # Post item with avatar & admin delete
│   ├── RightSidebar.tsx    # Statistics & Project info column
│   ├── StatsCard.tsx       # Live counters widget
│   └── Toast.tsx           # Glassmorphism alert toast
├── hooks/
│   ├── useAdminMode.ts     # Safe URL query parameter detector
│   └── usePosts.ts         # Supabase Realtime & state management
├── lib/
│   ├── supabase.ts         # Reusable Supabase client
│   └── utils.ts            # Avatar generator & relative time formatting
├── supabase/
│   └── schema.sql          # Supabase SQL table & replication script
├── types/
│   └── post.ts             # TypeScript model definitions
└── README.md
```
