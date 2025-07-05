import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      currentTheme: 'ocean-professional', // Default theme
      
      // Theme combinations with 3 complementary colors each
      themeOptions: [
        {
          id: 'ocean-professional',
          name: 'Ocean Professional',
          colors: ['#0EA5E9', '#0284C7', '#0369A1'],
          preview: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
          cssVars: {
            '--color-primary': '#0EA5E9',
            '--color-secondary': '#0284C7',
            '--color-accent': '#0369A1'
          }
        },
        {
          id: 'forest-trust',
          name: 'Forest Trust',
          colors: ['#10B981', '#059669', '#047857'],
          preview: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
          cssVars: {
            '--color-primary': '#10B981',
            '--color-secondary': '#059669',
            '--color-accent': '#047857'
          }
        },
        {
          id: 'royal-authority',
          name: 'Royal Authority',
          colors: ['#8B5CF6', '#7C3AED', '#6D28D9'],
          preview: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
          cssVars: {
            '--color-primary': '#8B5CF6',
            '--color-secondary': '#7C3AED',
            '--color-accent': '#6D28D9'
          }
        },
        {
          id: 'sunset-energy',
          name: 'Sunset Energy',
          colors: ['#F59E0B', '#D97706', '#B45309'],
          preview: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
          cssVars: {
            '--color-primary': '#F59E0B',
            '--color-secondary': '#D97706',
            '--color-accent': '#B45309'
          }
        },
        {
          id: 'crimson-power',
          name: 'Crimson Power',
          colors: ['#EF4444', '#DC2626', '#B91C1C'],
          preview: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
          cssVars: {
            '--color-primary': '#EF4444',
            '--color-secondary': '#DC2626',
            '--color-accent': '#B91C1C'
          }
        },
        {
          id: 'midnight-elegance',
          name: 'Midnight Elegance',
          colors: ['#6366F1', '#4F46E5', '#4338CA'],
          preview: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)',
          cssVars: {
            '--color-primary': '#6366F1',
            '--color-secondary': '#4F46E5',
            '--color-accent': '#4338CA'
          }
        },
        {
          id: 'rose-gold',
          name: 'Rose Gold',
          colors: ['#F472B6', '#EC4899', '#DB2777'],
          preview: 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #DB2777 100%)',
          cssVars: {
            '--color-primary': '#F472B6',
            '--color-secondary': '#EC4899',
            '--color-accent': '#DB2777'
          }
        },
        {
          id: 'cyber-teal',
          name: 'Cyber Teal',
          colors: ['#14B8A6', '#0D9488', '#0F766E'],
          preview: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #0F766E 100%)',
          cssVars: {
            '--color-primary': '#14B8A6',
            '--color-secondary': '#0D9488',
            '--color-accent': '#0F766E'
          }
        }
      ],
      
      toggleTheme: () => {
        const currentMode = get().isDarkMode
        const newMode = !currentMode
        
        console.log('Toggling theme from', currentMode, 'to', newMode)
        
        set({ isDarkMode: newMode })
        
        // Update document class immediately
        const html = document.documentElement
        if (newMode) {
          html.classList.add('dark')
          html.classList.remove('light')
          console.log('Applied dark mode classes')
        } else {
          html.classList.add('light')
          html.classList.remove('dark')
          console.log('Applied light mode classes')
        }
      },
      
      setTheme: (themeId) => {
        const theme = get().themeOptions.find(t => t.id === themeId)
        if (theme) {
          set({ currentTheme: themeId })
          
          // Apply CSS custom properties
          const root = document.documentElement
          Object.entries(theme.cssVars).forEach(([property, value]) => {
            root.style.setProperty(property, value)
          })
          
          console.log('Applied theme:', theme.name, theme.colors)
        }
      },
      
      getCurrentTheme: () => {
        const currentThemeId = get().currentTheme
        return get().themeOptions.find(t => t.id === currentThemeId) || get().themeOptions[0]
      },
      
      initializeTheme: () => {
        const isDark = get().isDarkMode
        const currentTheme = get().getCurrentTheme()
        const html = document.documentElement
        
        console.log('Initializing theme, isDark:', isDark, 'theme:', currentTheme.name)
        
        // Apply dark/light mode
        if (isDark) {
          html.classList.add('dark')
          html.classList.remove('light')
        } else {
          html.classList.add('light')
          html.classList.remove('dark')
        }
        
        // Apply theme colors
        const root = document.documentElement
        Object.entries(currentTheme.cssVars).forEach(([property, value]) => {
          root.style.setProperty(property, value)
        })
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Theme rehydrated:', state.isDarkMode, state.currentTheme)
          state.initializeTheme()
        }
      }
    }
  )
)
