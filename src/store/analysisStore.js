import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../lib/supabase'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

export const useAnalysisStore = create(
  persist(
    (set, get) => ({
      analyses: [],
      isLoading: false,
      error: null,
      
      // Load analyses for current user
      loadAnalyses: async () => {
        const { user } = useAuthStore.getState()
        if (!user) {
          set({ analyses: [], error: null, isLoading: false })
          return
        }

        set({ isLoading: true, error: null })
        try {
          const data = await db.getNeedsAnalyses(user.id)
          set({ 
            analyses: Array.isArray(data) ? data : [], 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          console.error('Failed to load analyses:', error)
          set({ 
            analyses: [], 
            isLoading: false,
            error: error.message || 'Failed to load analyses'
          })
        }
      },
      
      // Create new analysis
      createAnalysis: async (analysisData) => {
        const { user } = useAuthStore.getState()
        if (!user) throw new Error('User not authenticated')

        set({ isLoading: true })
        try {
          const newAnalysis = await db.createNeedsAnalysis(user.id, analysisData)
          set(state => ({ 
            analyses: [newAnalysis, ...state.analyses],
            isLoading: false 
          }))
          toast.success('Analysis saved successfully')
          return newAnalysis
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to save analysis')
          throw error
        }
      },
      
      // Update existing analysis
      updateAnalysis: async (id, updates) => {
        set({ isLoading: true })
        try {
          const updatedAnalysis = await db.updateNeedsAnalysis(id, updates)
          set(state => ({
            analyses: state.analyses.map(analysis => 
              analysis.id === id ? updatedAnalysis : analysis
            ),
            isLoading: false
          }))
          toast.success('Analysis updated successfully')
          return updatedAnalysis
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to update analysis')
          throw error
        }
      },
      
      // Delete analysis
      deleteAnalysis: async (id) => {
        set({ isLoading: true })
        try {
          await db.deleteNeedsAnalysis(id)
          set(state => ({
            analyses: state.analyses.filter(analysis => analysis.id !== id),
            isLoading: false
          }))
          toast.success('Analysis deleted successfully')
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to delete analysis')
          throw error
        }
      },
      
      // Get analysis by ID
      getAnalysisById: (id) => {
        const { analyses } = get()
        return analyses.find(analysis => analysis.id === id)
      },
      
      // Clear all analyses (for logout)
      clearAnalyses: () => {
        set({ analyses: [], error: null, isLoading: false })
      }
    }),
    {
      name: 'analysis-storage',
      partialize: (state) => ({ 
        analyses: state.analyses 
      })
    }
  )
)
