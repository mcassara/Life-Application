import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../lib/supabase'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

export const useClientIntakeStore = create(
  persist(
    (set, get) => ({
      intakes: [],
      isLoading: false,
      error: null,
      
      // Load client intakes for current user
      loadIntakes: async () => {
        const { user } = useAuthStore.getState()
        if (!user) {
          set({ intakes: [], error: null, isLoading: false })
          return
        }

        set({ isLoading: true, error: null })
        try {
          const data = await db.getClientIntakes(user.id)
          // Transform client data to intake format for compatibility
          const transformedIntakes = Array.isArray(data) ? data.map(client => ({
            id: client.id,
            client_name: `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unnamed Client',
            client_email: client.email || '',
            client_phone: client.phone || '',
            status: client.status || 'prospect',
            completion_percentage: 0,
            personal_info: {},
            financial_info: {},
            family_info: {},
            insurance_info: {},
            createdAt: client.created_at,
            updatedAt: client.updated_at,
            // Parse notes if it contains JSON data
            ...(client.notes ? (() => {
              try {
                const parsed = JSON.parse(client.notes)
                return {
                  completion_percentage: parsed.completion_percentage || 0,
                  personal_info: parsed.personal_info || {},
                  financial_info: parsed.financial_info || {},
                  family_info: parsed.family_info || {},
                  insurance_info: parsed.insurance_info || {}
                }
              } catch {
                return {}
              }
            })() : {})
          })) : []
          
          set({ 
            intakes: transformedIntakes, 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          console.error('Failed to load client intakes:', error)
          set({ 
            intakes: [], 
            isLoading: false,
            error: error.message || 'Failed to load client intakes'
          })
        }
      },
      
      // Create new intake
      createIntake: async (intakeData) => {
        const { user } = useAuthStore.getState()
        if (!user) throw new Error('User not authenticated')

        set({ isLoading: true })
        try {
          const newIntake = await db.createClientIntake(user.id, intakeData)
          // Transform to intake format
          const transformedIntake = {
            id: newIntake.id,
            client_name: `${newIntake.first_name || ''} ${newIntake.last_name || ''}`.trim(),
            client_email: newIntake.email || '',
            client_phone: newIntake.phone || '',
            status: newIntake.status || 'prospect',
            completion_percentage: intakeData.completion_percentage || 0,
            personal_info: intakeData.personal_info || {},
            financial_info: intakeData.financial_info || {},
            family_info: intakeData.family_info || {},
            insurance_info: intakeData.insurance_info || {},
            createdAt: newIntake.created_at,
            updatedAt: newIntake.updated_at
          }
          
          set(state => ({ 
            intakes: [transformedIntake, ...state.intakes],
            isLoading: false 
          }))
          toast.success('Client intake created successfully')
          return transformedIntake
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to create client intake')
          throw error
        }
      },
      
      // Update existing intake
      updateIntake: async (id, updates) => {
        set({ isLoading: true })
        try {
          const updatedIntake = await db.updateClientIntake(id, updates)
          // Transform to intake format
          const transformedIntake = {
            id: updatedIntake.id,
            client_name: `${updatedIntake.first_name || ''} ${updatedIntake.last_name || ''}`.trim(),
            client_email: updatedIntake.email || '',
            client_phone: updatedIntake.phone || '',
            status: updatedIntake.status || 'prospect',
            completion_percentage: updates.completion_percentage || 0,
            personal_info: updates.personal_info || {},
            financial_info: updates.financial_info || {},
            family_info: updates.family_info || {},
            insurance_info: updates.insurance_info || {},
            createdAt: updatedIntake.created_at,
            updatedAt: updatedIntake.updated_at
          }
          
          set(state => ({
            intakes: state.intakes.map(intake => 
              intake.id === id ? transformedIntake : intake
            ),
            isLoading: false
          }))
          toast.success('Client intake updated successfully')
          return transformedIntake
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to update client intake')
          throw error
        }
      },
      
      // Delete intake
      deleteIntake: async (id) => {
        set({ isLoading: true })
        try {
          await db.deleteClientIntake(id)
          set(state => ({
            intakes: state.intakes.filter(intake => intake.id !== id),
            isLoading: false
          }))
          toast.success('Client intake deleted successfully')
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to delete client intake')
          throw error
        }
      },
      
      // Get intake by ID
      getIntakeById: (id) => {
        const { intakes } = get()
        return intakes.find(intake => intake.id === id)
      },
      
      // Import from needs analysis
      importFromAnalysis: async (analysisId) => {
        const { user } = useAuthStore.getState()
        if (!user) throw new Error('User not authenticated')

        set({ isLoading: true })
        try {
          const newIntake = await db.importFromNeedsAnalysis(analysisId, user.id)
          const transformedIntake = {
            id: newIntake.id,
            client_name: `${newIntake.first_name || ''} ${newIntake.last_name || ''}`.trim(),
            client_email: newIntake.email || '',
            client_phone: newIntake.phone || '',
            status: newIntake.status || 'prospect',
            completion_percentage: 75, // Pre-filled from analysis
            personal_info: {},
            financial_info: {},
            family_info: {},
            insurance_info: {},
            createdAt: newIntake.created_at,
            updatedAt: newIntake.updated_at
          }
          
          set(state => ({ 
            intakes: [transformedIntake, ...state.intakes],
            isLoading: false 
          }))
          toast.success('Client imported from analysis successfully')
          return transformedIntake
        } catch (error) {
          set({ isLoading: false })
          toast.error('Failed to import from analysis')
          throw error
        }
      },
      
      // Clear all intakes (for logout)
      clearIntakes: () => {
        set({ intakes: [], error: null, isLoading: false })
      }
    }),
    {
      name: 'client-intake-storage',
      partialize: (state) => ({ 
        intakes: state.intakes 
      })
    }
  )
)
