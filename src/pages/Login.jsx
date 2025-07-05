import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Shield, Eye, EyeOff, Loader2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Welcome back!')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 cyber-grid py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 fade-in">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Sign in to <span className="gradient-text">LifeGuard Pro</span>
          </h2>
          <p className="text-slate-400">
            Access your advanced insurance platform
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input-field pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full btn-primary flex justify-center items-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
              <div className="text-center text-sm text-slate-400 mb-2">
                Demo credentials:
              </div>
              <div className="space-y-1 text-xs text-slate-500 text-center">
                <div className="flex justify-between items-center px-2 py-1 bg-slate-700/30 rounded">
                  <span className="text-blue-400">Agent:</span>
                  <span>agent@lifeguard.com / password</span>
                </div>
                <div className="flex justify-between items-center px-2 py-1 bg-slate-700/30 rounded">
                  <span className="text-purple-400">Admin:</span>
                  <span>admin@lifeguard.com / password</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
