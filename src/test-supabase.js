import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnljskxgvewojeyerysu.supabase.co';
const supabaseAnonKey = 'sb_publishable_zadB8jmKsBsa33gD1NvYGQ_1p910Okr';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Supabase insert...");
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title: 'Test Node Script',
      subject: 'Test',
      priority: 'Standard',
      completed: false,
      user_id: '00000000-0000-0000-0000-000000000000'
    }])
    .select()
    .single();

  console.log("Data:", data);
  console.log("Error:", error);
}

test();
