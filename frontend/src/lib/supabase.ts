import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtinvlzbviutbxptipum.supabase.co';
const supabaseKey = 'sb_publishable_39z93DUiTdRN189UK589tA_owI5GUD1';

export const supabase = createClient(supabaseUrl, supabaseKey);
