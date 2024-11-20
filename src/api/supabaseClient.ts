import { createClient } from '@supabase/supabase-js';
//import { getEnvironmentData } from 'worker_threads';

//const supabaseUrl:String = getEnvironmentData('SUPERBASE_API_URL');
//const supabaseKey:String = getEnvironmentData('SUPABASE_API_KEY');
const supabaseUrl = "https://inopslkccexruubpuhyr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub3BzbGtjY2V4cnV1YnB1aHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NjMzMTUsImV4cCI6MjA0MTMzOTMxNX0.ebVkz6PrThoIJftrh1koO5s0oWqphIx0lVakui4W7_Y";

export const supabase = createClient(supabaseUrl, supabaseKey);
