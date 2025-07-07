import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../lib/supabase'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

export const useAnalysisStore = create(
  persist(
    (set, get) => ({
      analyses: [],
      editingAnalysis: null,
      isLoading: false,

      // Load analyses from database
      loadAnalyses: async () => {
        const { user } = useAuthStore.getState()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const analyses = await db.getNeedsAnalyses(user.id)
          set({ analyses, isLoading: false })
        } catch (error) {
          console.error('Load analyses error:', error)
          set({ isLoading: false })
          toast.error('Failed to load analyses')
        }
      },

      addAnalysis: async (analysisData) => {
        const { user } = useAuthStore.getState()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const analysis = await db.createNeedsAnalysis(user.id, {
            client_name: analysisData.clientName,
            client_data: analysisData.formData || {},
            analysis_results: {
              totalNeeds: analysisData.totalNeeds,
              incomeReplacement: analysisData.incomeReplacement,
              debtCoverage: analysisData.debtCoverage,
              educationCoverage: analysisData.educationCoverage,
              finalExpenses: analysisData.finalExpenses,
              existingCoverage: analysisData.existingCoverage
            },
            total_needs: analysisData.totalNeeds,
            coverage_gap: analysisData.coverageGap,
            estimated_premium: analysisData.estimatedPremium,
            recommendations: analysisData.recommendations || [],
            status: 'completed'
          })
          
          set((state) => ({
            analyses: [analysis, ...state.analyses],
            isLoading: false
          }))
          
          toast.success('Analysis saved successfully')
          return analysis
        } catch (error) {
          console.error('Add analysis error:', error)
          set({ isLoading: false })
          toast.error('Failed to save analysis')
          throw error
        }
      },

      updateAnalysis: async (id, updatedData) => {
        set({ isLoading: true })
        try {
          const analysis = await db.updateNeedsAnalysis(id, updatedData)
          set((state) => ({
            analyses: state.analyses.map(a =>
              a.id === id ? analysis : a
            ),
            isLoading: false
          }))
          toast.success('Analysis updated successfully')
        } catch (error) {
          console.error('Update analysis error:', error)
          set({ isLoading: false })
          toast.error('Failed to update analysis')
        }
      },

      deleteAnalysis: async (id) => {
        set({ isLoading: true })
        try {
          await db.deleteNeedsAnalysis(id)
          set((state) => ({
            analyses: state.analyses.filter(analysis => analysis.id !== id),
            isLoading: false
          }))
          toast.success('Analysis deleted successfully')
        } catch (error) {
          console.error('Delete analysis error:', error)
          set({ isLoading: false })
          toast.error('Failed to delete analysis')
        }
      },

      setEditingAnalysis: (analysis) => {
        set({ editingAnalysis: analysis })
      },

      clearEditingAnalysis: () => {
        set({ editingAnalysis: null })
      },

      getAnalysisById: (id) => {
        const state = get()
        return state.analyses.find(analysis => analysis.id === id)
      },
      
      // Get analyses for client intake import
      getAnalysesForImport: () => {
        const state = get()
        return state.analyses.filter(analysis => 
          analysis.status === 'completed' && analysis.client_name
        )
      }
    }),
    {
      name: 'analysis-storage',
      partialize: (state) => ({
        // Don't persist analyses since they come from database
        editingAnalysis: state.editingAnalysis
      })
    }
  )
)