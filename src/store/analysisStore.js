import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAnalysisStore = create(
  persist(
    (set, get) => ({
      analyses: [],
      editingAnalysis: null,

      saveAnalysis: (analysisData) => {
        const analysis = {
          id: Date.now().toString(),
          ...analysisData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        set((state) => ({
          analyses: [analysis, ...state.analyses]
        }))
        
        return analysis
      },

      updateAnalysis: (id, updatedData) => {
        set((state) => ({
          analyses: state.analyses.map(analysis =>
            analysis.id === id
              ? { ...analysis, ...updatedData, updatedAt: new Date().toISOString() }
              : analysis
          )
        }))
      },

      deleteAnalysis: (id) => {
        set((state) => ({
          analyses: state.analyses.filter(analysis => analysis.id !== id)
        }))
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
      }
    }),
    {
      name: 'analysis-storage',
    }
  )
)
