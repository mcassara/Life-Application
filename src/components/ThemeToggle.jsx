import React from 'react'
import { Sun, Moon, Palette } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, themeOptions, currentTheme, setTheme } = useThemeStore()
  const [showThemeSelector, setShowThemeSelector] = React.useState(false)

  const handleToggle = () => {
    console.log('Theme toggle clicked, current mode:', isDarkMode)
    toggleTheme()
  }

  const handleThemeSelect = (themeId) => {
    setTheme(themeId)
    setShowThemeSelector(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Theme Selector Dropdown */}
      {showThemeSelector && (
        <div className="absolute top-16 right-0 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Choose Theme Color Combination
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                  currentTheme === theme.id
                    ? 'border-gray-900 dark:border-white shadow-xl ring-2 ring-blue-500/50'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                {/* 3 Separate Color Bars */}
                <div className="w-full h-16 rounded-lg mb-3 overflow-hidden border border-white/20 shadow-inner">
                  <div className="flex h-full">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: color }}
                        title={`Color ${index + 1}: ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {theme.name}
                </h4>
                
                {/* Individual Color Swatches */}
                <div className="flex justify-center space-x-1">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      title={`Color ${index + 1}: ${color}`}
                    />
                  ))}
                </div>
                
                {/* Active Theme Indicator */}
                {currentTheme === theme.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center font-medium">
              Each theme contains 3 separate contrasting colors that work together throughout the interface
            </p>
          </div>
        </div>
      )}

      {/* Main Toggle Buttons */}
      <div className="flex flex-col space-y-2">
        {/* Theme Selector Button */}
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Choose theme colors"
        >
          <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={handleToggle}
          className="p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="relative w-5 h-5">
            <Sun className={`absolute inset-0 h-5 w-5 text-yellow-500 transition-all duration-300 ${
              isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
            }`} />
            <Moon className={`absolute inset-0 h-5 w-5 text-blue-400 transition-all duration-300 ${
              isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
            }`} />
          </div>
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle
