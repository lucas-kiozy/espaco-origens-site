import { supabase, type Work, type User, type Favorite } from './supabase'

// Funções para obras
export async function getWorks(category?: 'gallery' | 'work_in_progress') {
  try {
    let query = supabase
      .from('works')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching works:', error)
      return []
    }

    return data as Work[]
  } catch (error) {
    console.error('Database connection error:', error)
    return []
  }
}

export async function getWorkById(id: string) {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching work:', error)
    return null
  }

  return data as Work
}

export async function createWork(work: Omit<Work, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('works')
    .insert([work])
    .select()
    .single()

  if (error) {
    console.error('Error creating work:', error)
    throw error
  }

  return data as Work
}

export async function updateWork(id: string, updates: Partial<Work>) {
  const { data, error } = await supabase
    .from('works')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating work:', error)
    throw error
  }

  return data as Work
}

export async function deleteWork(id: string) {
  const { error } = await supabase
    .from('works')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting work:', error)
    throw error
  }
}

// Funções para usuários
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data as User
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

// Funções para favoritos
export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      works (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return data as (Favorite & { works: Work })[]
}

export async function addFavorite(userId: string, workId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, work_id: workId }])
    .select()
    .single()

  if (error) {
    console.error('Error adding favorite:', error)
    throw error
  }

  return data as Favorite
}

export async function removeFavorite(userId: string, workId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('work_id', workId)

  if (error) {
    console.error('Error removing favorite:', error)
    throw error
  }
}

export async function isFavorite(userId: string, workId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('work_id', workId)
    .single()

  return !error && !!data
}
