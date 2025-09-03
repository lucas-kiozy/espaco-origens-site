import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env'

// Configuração para desenvolvimento e produção
const supabaseUrl = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || 'https://cpjiclzbbquoulrykjgi.supabase.co'
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamljbHpiYnF1b3VscnlramdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzU0NTUsImV4cCI6MjA3MjQxMTQ1NX0.LQaKmPZa9Ywq_W9RS729ePk-BdUiFh_WPzOvw_J94fE'

// Em desenvolvimento, usar valores padrão se não configurados
const isDevelopment = import.meta.env.DEV

if (!isDevelopment && (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder'))) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Work {
  id: string
  title: string
  description?: string
  images: string[]
  focal_point?: string
  category: 'gallery' | 'work_in_progress'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  work_id: string
  created_at: string
}
