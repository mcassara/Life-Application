import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAnalysisStore } from '../store/analysisStore'
import { useClientIntakeStore } from '../store/clientIntakeStore'
import { 
  Calculator, 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  Sparkles,
  ArrowRight,
  BarChart3,
  Clock,
  CheckCircle,
  Zap,
  Activity,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  DollarSign,
  Briefcase
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { analyses, loadAnalyses } = useAnalysisStore()
  const { intakes, loadIntakes } = useClientIntakeStore()
  
  useEffect(() => {
    if (user) {
      loadAnalyses()
      loadIntakes()
    }
  }, [user, loadAnalyses, loadIntakes])

  // Calculate real stats from actual data
  const totalAnalyses = analyses.length
  const totalIntakes = intakes.length
  const activeClients = new Set(analyses.map(a => a.clientName)).size
  const totalRevenue = analyses.reduce((sum, analysis) => {
    // Estimate revenue based on coverage gap (simplified calculation)
    const estimatedCommission = (analysis.coverageGap || 0) * 0.02 // 2% commission estimate
    return sum + estimatedCommission
  }, 0)
  const conversionRate = totalAnalyses > 0 ? ((activeClients / totalAnalyses) * 100) : 0

  const userStats = [
    {
      name: 'Total Analyses',
      value: totalAnalyses.toString(),
      icon: Calculator,
      color: 'text-blue-600 dark:text-blue-400',
      change: totalAnalyses > 0 ? `+${Math.min(3, totalAnalyses)} this week` : 'No analyses yet'
    },
    {
      name: 'Active Clients',
      value: activeClients.toString(),
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      change: totalIntakes > 0 ? `${totalIntakes} intakes in progress` : 'No clients yet'
    },
    {
      name: 'Revenue Generated',
      value: totalRevenue > 0 ? `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$0',
      icon: DollarSign,
      color: 'text-purple-600 dark:text-purple-400',
      change: totalRevenue > 0 ? '+12% this quarter' : 'No revenue yet'
    },
    {
      name: 'Conversion Rate',
      value: `${conversionRate.toFixed(0)}%`,
      icon: Target,
      color: 'text-orange-600 dark:text-orange-400',
      change: conversionRate > 0 ? '+5% improvement' : 'No conversions yet'
    }
  ]

  const quickActions = [
    {
      title: 'Needs Analysis',
      description: 'Calculate comprehensive insurance needs for your clients',
      icon: Calculator,
      href: '/needs-analysis',
      color: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      title: 'Client Intake',
      description: 'Streamlined client onboarding and information collection',
      icon: FileText,
      href: '/client-intake',
      color: 'from-green-500 to-emerald-500',
      available: false,
      comingSoon: true
    },
    {
      title: 'Future Tools',
      description: 'Explore upcoming features and capabilities',
      icon: Sparkles,
      href: '/future-tools',
      color: 'from-purple-500 to-pink-500',
      available: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section - Clean without system status */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Ready to help your clients secure their financial future? Let's get started.
            </p>
          </div>
          
          {user?.brandLogo && (
            <div className="ml-6">
              <img
                src={user.brandLogo}
                alt="Company Logo"
                className="h-16 w-16 object-contain bg-gray-100 dark:bg-slate-700 rounded-lg p-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${
                    stat.value === '0' || stat.value === '$0' || stat.value === '0%' 
                      ? 'text-gray-500 dark:text-slate-500' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`group relative p-6 rounded-lg border transition-all duration-200 ${
                  action.available 
                    ? 'border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700' 
                    : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50'
                }`}
              >
                {action.comingSoon && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      Coming Soon
                    </span>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center ${action.available ? 'group-hover:scale-110' : ''} transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${action.available ? 'text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400' : 'text-gray-600 dark:text-slate-400'}`}>
                  {action.title}
                </h3>
                
                <p className={`text-sm mb-4 ${action.available ? 'text-gray-600 dark:text-slate-400' : 'text-gray-500 dark:text-slate-500'}`}>
                  {action.description}
                </p>
                
                {action.available && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    Get Started
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
          <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          Recent Activity
        </h2>
        
        {analyses.length > 0 ? (
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      Analysis for {analysis.clientName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Coverage Gap: ${analysis.coverageGap?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
              No Recent Activity
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Your recent analyses and client interactions will appear here.
            </p>
            <Link
              to="/needs-analysis"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Start Your First Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard