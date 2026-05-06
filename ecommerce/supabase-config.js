// Supabase Configuration
// Your actual Supabase credentials
const SUPABASE_URL = 'https://mrqdytkzlwlnpznsopxe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zGgTrafDIxkwbZOS0U1jQg_geF2vlva';

// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);