// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta as any).env?.PUBLIC_SUPABASE_URL ||
  (typeof window !== 'undefined' && (window as any).__ENV?.PUBLIC_SUPABASE_URL) ||
  '';

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' && (window as any).__ENV?.PUBLIC_SUPABASE_ANON_KEY) ||
  '';

const isDev = Boolean((import.meta as any).env?.DEV);

if (!isDev && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase environment variables. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY for production.');
}

// Nunca exponha service_role no cliente
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Tipos do DB (mantive os seus) */
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Work {
  id: string;
  title: string;
  description?: string;
  images: string[];
  focal_point?: string;
  category: 'gallery' | 'work_in_progress';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  work_id: string;
  created_at: string;
}
