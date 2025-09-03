import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin'
}

// Função para fazer login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Função para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

// Função para registrar novo usuário
export async function signUp(email: string, password: string) {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
  const emailRedirectTo = `${window.location.origin}${base}login`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    }
  })

  if (error) {
    throw error
  }

  return data
}

// Função para recuperar senha
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}login`,
  })

  if (error) {
    throw error
  }
}

// Função para obter usuário atual
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Função para verificar se usuário está logado
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

// Função para obter sessão atual
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Listener para mudanças de autenticação
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}
