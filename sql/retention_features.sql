-- retention_features.sql
-- Run this in your Supabase SQL Editor to support the new gamification features

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stats_focus_sessions integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stats_flashcards_reviewed integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stats_quizzes_correct integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stats_math_completed integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stats_science_completed integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stats_quests_completed integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_streak integer DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_reward_date timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unlocked_avatars text[] DEFAULT '{"⚡"}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS claimed_season_tiers integer[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS boss_chapter_progress jsonb DEFAULT '{"dragon": {"hp": 1000, "max": 1000, "status": "active"}, "monster": {"hp": 2000, "max": 2000, "status": "locked"}, "titan": {"hp": 5000, "max": 5000, "status": "locked"}}';
