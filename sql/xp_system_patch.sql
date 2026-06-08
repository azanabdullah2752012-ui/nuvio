-- 🏆 ACADEVANCE GAMIFICATION DATABASE PATCH
-- Run this script in your Supabase SQL Editor to configure your database for the XP and Token system.

-- 1. Create xp_logs table if it does not exist
CREATE TABLE IF NOT EXISTS public.xp_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    reason text NOT NULL,
    category text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
DROP POLICY IF EXISTS "Users can view own xp logs" ON public.xp_logs;
CREATE POLICY "Users can view own xp logs" ON public.xp_logs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own xp logs" ON public.xp_logs;
CREATE POLICY "Users can insert own xp logs" ON public.xp_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Create/Replace RPC Function for adding tokens
CREATE OR REPLACE FUNCTION public.rpc_add_tokens(amount_to_add integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    curr_user_id uuid;
    new_balance integer;
BEGIN
    curr_user_id := auth.uid();
    IF curr_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    UPDATE public.profiles
    SET era_tokens = COALESCE(era_tokens, 0) + amount_to_add
    WHERE id = curr_user_id
    RETURNING era_tokens INTO new_balance;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', new_balance
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'message', SQLERRM
    );
END;
$$;

-- 3. Create/Replace RPC Function for awarding XP and calculating level ups atomically
CREATE OR REPLACE FUNCTION public.rpc_award_xp(
    amount_to_add integer,
    award_reason text,
    award_category text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    curr_user_id uuid;
    curr_xp integer;
    curr_level integer;
    new_xp integer;
    new_level integer;
    leveled_up boolean := false;
    updated_profile jsonb;
    -- Level threshold definitions
    level_thresholds integer[] := ARRAY[
        0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000,
        15000, 20000, 26000, 33000, 41000, 50000, 60000, 71000, 83000, 96000
    ];
    threshold_length integer;
    i integer;
    extra_xp integer;
BEGIN
    -- Get current authenticated user ID
    curr_user_id := auth.uid();
    IF curr_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    -- Fetch current XP and level from profiles
    SELECT xp, level INTO curr_xp, curr_level
    FROM public.profiles
    WHERE id = curr_user_id;

    IF curr_xp IS NULL THEN
        curr_xp := 0;
    END IF;
    IF curr_level IS NULL THEN
        curr_level := 1;
    END IF;

    -- Calculate new XP
    new_xp := curr_xp + amount_to_add;

    -- Calculate new level based on thresholds
    new_level := 1;
    threshold_length := array_length(level_thresholds, 1);
    
    FOR i IN REVERSE threshold_length..1 LOOP
        IF new_xp >= level_thresholds[i] THEN
            IF i = threshold_length THEN
                extra_xp := new_xp - level_thresholds[i];
                new_level := 20 + floor(extra_xp / 15000);
            ELSE
                new_level := i;
            END IF;
            EXIT;
        END IF;
    END LOOP;

    -- Check if level up occurred
    IF new_level > curr_level THEN
        leveled_up := true;
    END IF;

    -- Update user profile
    UPDATE public.profiles
    SET 
        xp = new_xp,
        level = new_level,
        last_activity_date = timezone('utc'::text, now())
    WHERE id = curr_user_id;

    -- Insert log entry
    INSERT INTO public.xp_logs (user_id, amount, reason, category)
    VALUES (curr_user_id, amount_to_add, award_reason, award_category);

    -- Fetch updated profile to return
    SELECT to_jsonb(p) INTO updated_profile
    FROM public.profiles p
    WHERE id = curr_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'profile', updated_profile,
        'leveled_up', leveled_up
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'message', SQLERRM
    );
END;
$$;
