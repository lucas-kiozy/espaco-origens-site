import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Esses valores devem ser injetados no build final, ajuste conforme necessário
const SUPABASE_URL = window.env?.PUBLIC_SUPABASE_URL || 'https://cpjiclzbbquoulrykjgi.supabase.co';
const SUPABASE_ANON_KEY = window.env?.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamljbHpiYnF1b3VscnlramdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzU0NTUsImV4cCI6MjA3MjQxMTQ1NX0.LQaKmPZa9Ywq_W9RS729ePk-BdUiFh_WPzOvw_J94fE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}
