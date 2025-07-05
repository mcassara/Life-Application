import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: email,
          subscription: 'premium',
          role: email === 'admin@lifeguard.com' ? 'admin' : 'agent',
          profilePicture: null,
          phone: '',
          company: '',
          companyDescription: '',
          address: '',
          brandLogo: '',
          apiKey: '', // Simplified to single API key
          createdAt: new Date().toISOString()
        }
        
        set({ user: mockUser, isLoading: false })
        return { success: true }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data
        const mockUser = {
          id: '2',
          name: name,
          email: email,
          subscription: 'basic',
          role: 'agent',
          profilePicture: null,
          phone: '',
          company: '',
          companyDescription: '',
          address: '',
          brandLogo: '',
          apiKey: '', // Simplified to single API key
          createdAt: new Date().toISOString()
        }
        
        set({ user: mockUser, isLoading: false })
        return { success: true }
      },
      
      logout: () => {
        set({ user: null })
      },
      
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
      
      isAdmin: () => {
        const user = get().user
        return user?.role === 'admin'
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)
