// public/scripts/auth-client.js
// roda no browser — usa supabase via CDN e lê env em runtime (window.__ENV)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const URL = (window.__ENV && window.__ENV.PUBLIC_SUPABASE_URL) || '';
const ANON = (window.__ENV && window.__ENV.PUBLIC_SUPABASE_ANON_KEY) || '';

if (!URL || !ANON) {
  console.error('auth-client: missing runtime env PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(URL, ANON);

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthStateChange(cb) {
  // retorna subscription no formato v2 ou fallback
  const res = supabase.auth.onAuthStateChange((event, session) => cb(session?.user ?? null));
  return res?.data?.subscription ?? res;
}

export async function signInWithOtp(email, redirectTo) {
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
}

export async function exchangeCodeForSession(url) {
  return supabase.auth.exchangeCodeForSession(url);
}
