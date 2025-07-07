import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../lib/supabase'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

export const useClientIntakeStore = create(
  persist(
    (set, get) => ({
      intakes: [],
      currentIntake: null,
      isLoading: false,

      // Load client intakes from database
      loadIntakes: async () => {
        const { user } = useAuthStore.getState()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const intakes = await db.getClientIntakes(user.id)
          set({ intakes, isLoading: false })
        } catch (error) {
          console.error('Load intakes error:', error)
          set({ isLoading: false })
          toast.error('Failed to load client intakes')
        }
      },

      // Create new client intake
      createIntake: async (intakeData) => {
        const { user } = useAuthStore.getState()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const intake = await db.createClientIntake(user.id, intakeData)
          set((state) => ({
            intakes: [intake, ...state.intakes],
            currentIntake: intake,
            isLoading: false
          }))
          toast.success('Client intake created successfully')
          return intake
        } catch (error) {
          console.error('Create intake error:', error)
          set({ isLoading: false })
          toast.error('Failed to create client intake')
          throw error
        }
      },

      // Update client intake
      updateIntake: async (id, updates) => {
        set({ isLoading: true })
        try {
          const intake = await db.updateClientIntake(id, updates)
          set((state) => ({
            intakes: state.intakes.map(i => i.id === id ? intake : i),
            currentIntake: state.currentIntake?.id === id ? intake : state.currentIntake,
            isLoading: false
          }))
          toast.success('Client intake updated successfully')
          return intake
        } catch (error) {
          console.error('Update intake error:', error)
          set({ isLoading: false })
          toast.error('Failed to update client intake')
          throw error
        }
      },

      // Delete client intake
      deleteIntake: async (id) => {
        set({ isLoading: true })
        try {
          await db.deleteClientIntake(id)
          set((state) => ({
            intakes: state.intakes.filter(i => i.id !== id),
            currentIntake: state.currentIntake?.id === id ? null : state.currentIntake,
            isLoading: false
          }))
          toast.success('Client intake deleted successfully')
        } catch (error) {
          console.error('Delete intake error:', error)
          set({ isLoading: false })
          toast.error('Failed to delete client intake')
        }
      },

      // Import from needs analysis
      importFromAnalysis: async (needsAnalysisId) => {
        const { user } = useAuthStore.getState()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const intake = await db.importFromNeedsAnalysis(needsAnalysisId, user.id)
          set((state) => ({
            intakes: [intake, ...state.intakes],
            currentIntake: intake,
            isLoading: false
          }))
          toast.success('Client data imported successfully from needs analysis')
          return intake
        } catch (error) {
          console.error('Import from analysis error:', error)
          set({ isLoading: false })
          toast.error('Failed to import from needs analysis')
          throw error
        }
      },

      // Set current intake
      setCurrentIntake: (intake) => {
        set({ currentIntake: intake })
      },

      // Clear current intake
      clearCurrentIntake: () => {
        set({ currentIntake: null })
      },

      // Calculate completion percentage
      calculateCompletion: (intakeData) => {
        const sections = [
          intakeData.personal_info,
          intakeData.financial_info,
          intakeData.family_info,
          intakeData.insurance_info
        ]
        
        let totalFields = 0
        let filledFields = 0
        
        sections.forEach(section => {
          if (section && typeof section === 'object') {
            const fields = Object.values(section)
            totalFields += fields.length
            filledFields += fields.filter(value => 
              value !== null && value !== undefined && value !== ''
            ).length
          }
        })
        
        return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
      },

      // Get intake by ID
      getIntakeById: (id) => {
        const state = get()
        return state.intakes.find(intake => intake.id === id)
      }
    }),
    {
      name: 'client-intake-storage',
      partialize: (state) => ({
        // Don't persist intakes since they come from database
        currentIntake: state.currentIntake
      })
    }
  )
)