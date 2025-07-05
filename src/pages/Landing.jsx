import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Calculator, 
  FileText, 
  Users, 
  TrendingUp, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Star,
  Crown,
  Rocket,
  Globe,
  Award
} from 'lucide-react'

const Landing = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Intelligent Needs Analysis',
      description: 'AI-powered calculations that provide accurate insurance recommendations based on comprehensive client data analysis.'
    },
    {
      icon: FileText,
      title: 'Digital Client Intake',
      description: 'Streamlined onboarding process with smart forms that adapt to client responses and automate data collection.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights and performance metrics to help you track client progress and optimize your sales strategy.'
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Comprehensive client portal with secure document storage, communication tools, and appointment scheduling.'
    },
    {
      icon: TrendingUp,
      title: 'Sales Optimization',
      description: 'Data-driven recommendations and automated workflows to increase conversion rates and client satisfaction.'
    },
    {
      icon: Shield,
      title: 'Compliance & Security',
      description: 'Bank-level security with built-in compliance tools to ensure all client data is protected and regulations are met.'
    }
  ]

  const benefits = [
    'Increase sales conversion by up to 40%',
    'Reduce client onboarding time by 60%',
    'Automate 80% of routine administrative tasks',
    'Ensure 100% regulatory compliance',
    'Access real-time analytics and insights',
    'Provide exceptional client experience'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-600/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                LifeGuard Pro
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-400/5 dark:to-indigo-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-6 sm:mb-8 border border-blue-200 dark:border-blue-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Revolutionary FinTech Platform for Insurance Professionals
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"> Insurance Practice</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              LifeGuard Pro is the cutting-edge platform that empowers life insurance agents with AI-driven analytics, 
              automated workflows, and intelligent client management tools to maximize sales and deliver exceptional service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
            
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500 dark:text-slate-400 px-4 sm:px-0">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                14-Day Free Trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                Cancel Anytime
              </div>
            </div>

            {/* Founders Special - Featured Section */}
            <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-yellow-800 dark:text-yellow-300 font-bold text-sm uppercase tracking-wide">
                    Founders Special - Limited Time
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                  Lifetime Access Available
                </h3>
                
                <p className="text-gray-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                  Be among the first 100 professionals to secure lifetime access to all current and future features. 
                  Lock in exclusive founders pricing with no recurring fees.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Claim Lifetime Access
                  </Link>
                  <div className="text-center">
                    <p className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">
                      Only <span className="text-yellow-800 dark:text-yellow-200 font-bold">87 spots remaining</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto px-4 sm:px-0">
              Our comprehensive suite of tools is designed specifically for modern insurance professionals 
              who want to stay ahead of the competition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={feature.title} 
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500 group mx-4 sm:mx-0"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Proven Results That Drive Success
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto px-4 sm:px-0">
              Join thousands of insurance professionals who have transformed their practice with LifeGuard Pro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 mx-4 sm:mx-0">
                <CheckCircle className="h-6 w-6 text-green-300 mr-4 flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-100 dark:border-slate-600 mx-4 sm:mx-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Zap className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Ready to Transform Your Practice?
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Join the revolution in insurance technology. Start your free trial today and experience 
              the future of client management and sales optimization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 font-semibold text-lg transition-all duration-200 flex items-center justify-center"
              >
                Already have an account?
              </Link>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-slate-400">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-1" />
                <span>10,000+ Agents</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
        {/* Futuristic Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  LifeGuard Pro
                </span>
                <p className="text-gray-400 text-sm mt-1">
                  Next-Generation Insurance Technology
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end mb-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-400"></div>
                </div>
                <span className="text-green-400 text-sm ml-3 font-medium">
                  System Operational
                </span>
              </div>
              
              <p className="text-gray-300 mb-2 font-medium">
                © 2024 LifeGuard Pro. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Empowering insurance professionals worldwide
              </p>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center md:justify-end space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                  Secure Platform
                </span>
                <span className="flex items-center">
                  <div className="w-1 h-1 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  99.9% Uptime
                </span>
                <span className="flex items-center">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  AI-Powered
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom Border Effect */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-0">
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Powered by</span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  Advanced AI Technology
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
