-- RETENTION ENGINE SCHEMA EXPANSION
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_activity_date timestamp with time zone DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_streak integer DEFAULT 1;
