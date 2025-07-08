import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, db } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      session: null,
      banners: [],
      
      // Initialize auth state
      initialize: async () => {
        set({ isLoading: true })
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const profile = await db.getUserProfile(session.user.id)
            set({ 
              user: profile, 
              session,
              isLoading: false 
            })
            await get().loadBanners()
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ isLoading: false })
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) throw error
          
          const profile = await db.getUserProfile(data.user.id)
          set({ 
            user: profile, 
            session: data.session,
            isLoading: false 
          })
          await get().loadBanners()
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          // Determine role based on email domain
          const role = email.endsWith('@legacywealthco.com') ? 'admin' : 'agent'
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
                role: role
              }
            }
          })
          
          if (error) throw error
          
          if (data.user && !data.session) {
            // Email confirmation required
            set({ isLoading: false })
            return { success: true, emailConfirmation: true }
          }
          
          // Create or get profile with correct role
          let profile = await db.getUserProfile(data.user.id)
          if (!profile) {
            profile = await db.updateUserProfile(data.user.id, {
              name: name,
              role: role
            })
          }
          
          set({ 
            user: profile, 
            session: data.session,
            isLoading: false 
          })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null, banners: [] })
        } catch (error) {
          console.error('Logout error:', error)
        }
      },
      
      updateUser: async (updates) => {
        const { user, session } = get()
        if (user && session) {
          try {
            const updatedProfile = await db.updateUserProfile(user.id, updates)
            set({ user: updatedProfile })
            toast.success('Profile updated successfully')
          } catch (error) {
            console.error('Update user error:', error)
            toast.error('Failed to update profile')
          }
        }
      },
      
      isAdmin: () => {
        const user = get().user
        return user?.role === 'admin'
      },
      
      // Banner management
      loadBanners: async () => {
        try {
          const banners = await db.getActiveBanners()
          set({ banners })
        } catch (error) {
          console.error('Load banners error:', error)
        }
      },
      
      addBanner: async (bannerData) => {
        const { user } = get()
        if (user && user.role === 'admin') {
          try {
            await db.createBanner(user.id, bannerData)
            await get().loadBanners()
            toast.success('Banner created successfully')
          } catch (error) {
            console.error('Add banner error:', error)
            toast.error('Failed to create banner')
          }
        }
      },
      
      removeBanner: async (bannerId) => {
        const { user } = get()
        if (user && user.role === 'admin') {
          try {
            await db.deleteBanner(bannerId)
            await get().loadBanners()
            toast.success('Banner removed successfully')
          } catch (error) {
            console.error('Remove banner error:', error)
            toast.error('Failed to remove banner')
          }
        }
      },
      
      addNotification: async (notificationData) => {
        // This would be implemented for sending notifications to users
        toast.success('Notification feature coming soon!')
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      })
    }
  )

)