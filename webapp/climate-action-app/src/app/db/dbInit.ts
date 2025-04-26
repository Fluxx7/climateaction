import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mqewhofkgjaphfnvafsb.supabase.co';
// Use SUPABASE_SERVICE_ROLE_KEY for server-side operations
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZXdob2ZrZ2phcGhmbnZhZnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg2NDMsImV4cCI6MjA2MTI1NDY0M30.z9pwfgwTRyXuVgadnGvuFWbEUrKQDP8bT9A-DCR2bS4";//process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Supabase key is missing. Check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
