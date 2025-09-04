// src/lib/supabase.ts
import type { SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getRuntimeConfig() {
  // runtime: window.__ENV gerado no dist/env.js
  const win = typeof window !== 'undefined' ? (window as any) : undefined;
  const runtime = win?.__ENV || {};
  const url =
    runtime.PUBLIC_SUPABASE_URL ||
    (import.meta as any).env?.PUBLIC_SUPABASE_URL ||
    '';
  const anon =
    runtime.PUBLIC_SUPABASE_ANON_KEY ||
    (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY ||
    '';
  return { url, anon };
}

/** Retorna o cliente Supabase inicializado no tempo de execução */
export async function getSupabase(): Promise<SupabaseClient> {
  if (_supabase) return _supabase;

  const { url, anon } = getRuntimeConfig();

  if (!url || !anon) {
    // Mensagem clara de debug sem expor segredos
    console.error('Supabase config missing', {
      hasUrl: Boolean(url),
      hasAnon: Boolean(anon),
    });
    throw new Error('Missing Supabase runtime configuration');
  }

  // importa dinamicamente para garantir que o bundle não contenha chaves estáticas
  const mod = await import('@supabase/supabase-js');
  const { createClient } = mod;
  _supabase = createClient(url, anon) as SupabaseClient;
  return _supabase;
}

/** helpers */
export async function signInWithOtp(email: string, redirectTo: string) {
  const sb = await getSupabase();
  return sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
}

export async function exchangeCodeForSession(url: string) {
  const sb = await getSupabase();
  return sb.auth.exchangeCodeForSession(url);
}

export async function getCurrentUser() {
  const sb = await getSupabase();
  const { data } = await sb.auth.getUser();
  return data?.user ?? null;
}

export function onAuthStateChange(cb: (user: any) => void) {
  // lazy attach: não bloqueia se getSupabase ainda não inicializou
  getSupabase()
    .then((sb) => {
      // supabase.auth.onAuthStateChange retorna { data: { subscription } } em v2,
      // mas manteremos comportamento atual: chamar callback com user
      const sub = sb.auth.onAuthStateChange((_, session) => cb(session?.user ?? null));
      return sub;
    })
    .catch((err) => {
      // não quebrar a aplicação se a config estiver faltando em runtime
      console.warn('onAuthStateChange: supabase not initialized', err);
      cb(null);
    });
}
