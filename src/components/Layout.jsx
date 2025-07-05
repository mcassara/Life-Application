import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  User, 
  LogOut,
  Shield,
  Sparkles,
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react'

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuthStore()
  const { isDarkMode, toggleTheme, initializeTheme } = useThemeStore()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Needs Analysis', href: '/needs-analysis', icon: Calculator },
    { name: 'Client Intake', href: '/client-intake', icon: FileText },
    { name: 'Future Tools', href: '/future-tools', icon: Sparkles },
    { name: 'Settings', href: '/profile', icon: Settings },
  ]

  // Add admin navigation if user is admin
  if (isAdmin()) {
    navigation.push(
      { name: 'Admin Panel', href: '/admin', icon: Shield, adminOnly: true }
    )
  }

  const isActive = (href) => location.pathname === href

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 cyber-grid transition-colors duration-300">
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-600/50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            {user?.brandLogo ? (
              <img
                src={user.brandLogo}
                alt="Company Logo"
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            )}
            <span className="text-lg font-bold gradient-text">
              {user?.company || 'LifeGuard Pro'}
            </span>
          </div>
          
          {/* Center - Empty for now */}
          <div></div>
          
          {/* System Status */}
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-slate-300">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed bottom-16 right-4 z-40">
        <button
          onClick={toggleTheme}
          className="flex items-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-slate-600/50 hover:shadow-xl transition-all duration-300 group"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="relative w-4 h-4 mr-2">
            <Sun className={`absolute inset-0 h-4 w-4 text-amber-500 transition-all duration-300 ${
              isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
            }`} />
            <Moon className={`absolute inset-0 h-4 w-4 text-blue-400 transition-all duration-300 ${
              isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
            }`} />
          </div>
          <span className="text-xs text-gray-600 dark:text-slate-300">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
          <div className={`ml-2 w-8 h-4 rounded-full transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 mt-0.5 ${
              isDarkMode ? 'translate-x-4' : 'translate-x-0.5'
            }`}></div>
          </div>
        </button>
      </div>

      {/* Floating Powered By Tag */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-200/50 dark:border-slate-600/50">
          <span className="text-xs text-gray-500 dark:text-slate-400">
            Powered by Legacy AI Tools
          </span>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-slate-600/50 fixed top-16 left-0 right-0 z-40 h-12">
        <div className="flex items-center justify-between px-3 h-full">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center ml-2">
              {user?.brandLogo ? (
                <img
                  src={user.brandLogo}
                  alt="Company Logo"
                  className="h-5 w-5 object-contain"
                />
              ) : (
                <div className="relative">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              )}
              <span className="ml-2 text-base font-bold gradient-text">
                {user?.company || 'LifeGuard Pro'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover ring-2 ring-blue-500/50"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ring-2 ring-blue-500/50">
                <span className="text-xs font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl border-r border-gray-200/50 dark:border-slate-600/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full flex-col">
              {/* Mobile Menu Header */}
              <div className="flex h-12 items-center justify-between px-3 border-b border-gray-200/50 dark:border-slate-600/50 mt-16">
                <span className="text-base font-bold gradient-text">
                  Navigation
                </span>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-2 py-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100'
                      } ${item.adminOnly ? 'border-l-2 border-red-500' : ''}`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <span>{item.name}</span>
                      {item.adminOnly && (
                        <Shield className="ml-auto h-3 w-3 text-red-400" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile User Info */}
              <div className="border-t border-gray-200/50 dark:border-slate-600/50 p-3">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/50"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ring-2 ring-blue-500/50">
                        <span className="text-sm font-medium text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100 flex items-center">
                      {user?.name}
                      {isAdmin() && <Shield className="ml-2 h-3 w-3 text-red-400" />}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-slate-400 capitalize flex items-center">
                      <div className="status-dot status-online mr-2"></div>
                      {user?.subscription} Plan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    closeMobileMenu()
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100 rounded-lg transition-all duration-200"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Left Sidebar for Tablet+ */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30 w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border-r border-gray-200/50 dark:border-slate-600/50 mt-16">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-12 items-center px-4 border-b border-gray-200/50 dark:border-slate-600/50">
            <span className="text-lg font-bold gradient-text">
              Navigation
            </span>
            {isAdmin() && (
              <div className="ml-auto">
                <div className="status-dot status-error"></div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/20'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100 hover:shadow-md'
                  } ${item.adminOnly ? 'border-l-2 border-red-500' : ''}`}
                >
                  <Icon className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.name}</span>
                  {item.adminOnly && (
                    <Shield className="ml-auto h-3 w-3 text-red-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-200/50 dark:border-slate-600/50 p-3">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ring-2 ring-blue-500/50">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100 flex items-center">
                  {user?.name}
                  {isAdmin() && <Shield className="ml-2 h-3 w-3 text-red-400" />}
                </p>
                <p className="text-xs text-gray-600 dark:text-slate-400 capitalize flex items-center">
                  <div className="status-dot status-online mr-2"></div>
                  {user?.subscription} Plan
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-56">
        <main className="pt-28 md:pt-16 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
