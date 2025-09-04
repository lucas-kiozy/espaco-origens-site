// public/scripts/auth-client.js
// carregado diretamente no site; usa ESM CDN do supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const env = (typeof window !== 'undefined' && window.__ENV) ? window.__ENV : {};
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function onAuthStateChange(cb) {
  // retorna objeto de unsubscribe compatível
  const res = supabase.auth.onAuthStateChange((_, session) => {
    cb(session?.user ?? null);
  });
  return res?.data?.subscription ?? res;
}

export async function signInWithOtp(email, redirectTo) {
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
}

export async function exchangeCodeForSession(url) {
  return supabase.auth.exchangeCodeForSession(url);
}
