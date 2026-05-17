import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize a single supabase client for the frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? process.env.REACT_APP_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? process.env.REACT_APP_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anon key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Export the typed client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to fetch user's study plans
export async function fetchStudyPlans(userId: string) {
  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch study plans: ${error.message}`);
  }
  return data ?? [];
}

// Helper function to save a new study plan
export async function saveStudyPlan(plan: {
  user_id: string;
  goals: string;
  constraints?: string;
  plan_data: any;
}) {
  const { data, error } = await supabase
    .from('study_plans')
    .insert([plan])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save study plan: ${error.message}`);
  }
  return data;
}