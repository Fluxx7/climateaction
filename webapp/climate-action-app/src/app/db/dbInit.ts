import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mqewhofkgjaphfnvafsb.supabase.co';
// Use SUPABASE_SERVICE_ROLE_KEY for server-side operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Supabase key is missing. Check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
