// You need to Rewrite the file to supabase.js The format is bellow of the real file:
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
