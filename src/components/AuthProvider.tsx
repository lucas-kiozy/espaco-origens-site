import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, onAuthStateChange } from '../lib/auth'
import { getCurrentUser as getCurrentUserProfile } from '../lib/database'

interface AuthContextType {
  user: any | null
  userProfile: any | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          const profile = await getCurrentUserProfile()
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      setUser(user)
      
      if (user) {
        try {
          const profile = await getCurrentUserProfile()
          setUserProfile(profile)
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const { signOut: supabaseSignOut } = await import('../lib/auth')
    await supabaseSignOut()
    setUser(null)
    setUserProfile(null)
  }

  const value = {
    user,
    userProfile,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

