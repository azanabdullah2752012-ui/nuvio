import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Dashboard -> Settings -> API
const supabaseUrl = 'https://xnljskxgvewojeyerysu.supabase.co';
const supabaseAnonKey = 'sb_publishable_zadB8jmKsBsa33gD1NvYGQ_1p910Okr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
