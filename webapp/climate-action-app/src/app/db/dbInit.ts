import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqewhofkgjaphfnvafsb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Supabase key is missing.');
  throw new Error('Supabase key is missing. Check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
