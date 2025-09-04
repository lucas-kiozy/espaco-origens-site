// src/lib/auth.ts
import { getSupabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Função para fazer login
export async function signIn(email: string, password: string) {
  const sb = await getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Função para fazer logout
export async function signOut() {
  const sb = await getSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

// Função para registrar novo usuário
export async function signUp(email: string, password: string) {
  const sb = await getSupabase();

  const base =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) ||
    '/';
  const normalizedBase = base.endsWith('/') ? base : base + '/';
  const emailRedirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}${normalizedBase}login`;

  // retorna o objeto completo do SDK: { data, error }
  const res = await sb.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  return res; // caller decide a UX (res.data, res.error)
}

// Função para recuperar senha
export async function resetPassword(email: string) {
  const sb = await getSupabase();
  const base =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) ||
    '/';
  const normalizedBase = base.endsWith('/') ? base : base + '/';
  const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}${normalizedBase}login`;

  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw error;
}

// Função para obter usuário atual
export async function getCurrentUser() {
  const sb = await getSupabase();
  const { data } = await sb.auth.getUser();
  return data?.user ?? null;
}

// Função para verificar se usuário está logado
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Função para obter sessão atual
export async function getSession() {
  const sb = await getSupabase();
  const { data } = await sb.auth.getSession();
  return data?.session ?? null;
}

// Listener para mudanças de autenticação
export function onAuthStateChange(callback: (user: any) => void) {
  // retorna um objeto simples com unsubscribe para manter compatibilidade
  let subscription: any = null;

  getSupabase()
    .then((sb) => {
      const res = sb.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
      });
      // supabase v2 pode retornar { data: { subscription } }
      subscription = res?.data?.subscription ?? res;
    })
    .catch(() => {
      // se não inicializar, aviso e chama callback com null
      console.warn('onAuthStateChange: supabase not initialized');
      callback(null);
    });

  return {
    unsubscribe: () => {
      try {
        if (subscription) {
          // tentativa de suportar ambos os formatos
          if (typeof subscription.unsubscribe === 'function') subscription.unsubscribe();
          else if (typeof subscription === 'function') subscription();
        }
      } catch (e) {
        // swallow
      }
    },
  };
}
