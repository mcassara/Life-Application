import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useAnalysisStore } from '../store/analysisStore'
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Zap,
  Globe,
  Lock,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'

const Admin = () => {
  const { users } = useAuthStore()
  const { analyses } = useAnalysisStore()
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate system metrics
  const totalUsers = users.length
  const totalAnalyses = analyses.length
  const activeUsers = users.filter(user => user.lastLogin && 
    new Date(user.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
  
  const systemMetrics = [
    {
      name: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      change: '+12% this month'
    },
    {
      name: 'Active Users (7d)',
      value: activeUsers.toString(),
      icon: Activity,
      color: 'text-green-600 dark:text-green-400',
      change: '+8% this week'
    },
    {
      name: 'Total Analyses',
      value: totalAnalyses.toString(),
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400',
      change: '+25% this month'
    },
    {
      name: 'System Uptime',
      value: '99.9%',
      icon: Server,
      color: 'text-emerald-600 dark:text-emerald-400',
      change: 'Last 30 days'
    }
  ]

  const systemStatus = [
    { service: 'API Gateway', status: 'operational', uptime: '99.9%' },
    { service: 'Database', status: 'operational', uptime: '100%' },
    { service: 'Authentication', status: 'operational', uptime: '99.8%' },
    { service: 'File Storage', status: 'operational', uptime: '99.9%' },
    { service: 'Email Service', status: 'maintenance', uptime: '98.5%' },
    { service: 'Analytics Engine', status: 'operational', uptime: '99.7%' }
  ]

  const recentActivity = [
    { type: 'user_registration', user: 'John Smith', timestamp: '2 minutes ago', details: 'New user registered' },
    { type: 'analysis_completed', user: 'Sarah Johnson', timestamp: '5 minutes ago', details: 'Completed needs analysis for client' },
    { type: 'system_update', user: 'System', timestamp: '1 hour ago', details: 'Security patch applied' },
    { type: 'user_login', user: 'Mike Davis', timestamp: '2 hours ago', details: 'User logged in from new device' },
    { type: 'analysis_completed', user: 'Lisa Chen', timestamp: '3 hours ago', details: 'Generated insurance report' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'maintenance':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700'
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'analysis_completed':
        return <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'system_update':
        return <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case 'user_login':
        return <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600 dark:text-slate-400" />
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'system', name: 'System', icon: Server },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                System administration and monitoring
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="btn-primary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
        <div className="border-b border-gray-200 dark:border-slate-600">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-500'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemMetrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <div key={metric.name} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{metric.name}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{metric.value}</p>
                          <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                            {metric.change}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Icon className={`h-8 w-8 ${metric.color}`} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* System Status */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                  <Server className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  System Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemStatus.map((service) => (
                    <div key={service.service} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100">{service.service}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Uptime: {service.uptime}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status === 'operational' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {service.status === 'maintenance' && <Clock className="h-3 w-3 mr-1" />}
                        {service.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="flex-shrink-0 mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                          {activity.details}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">User Management</h3>
                <button className="btn-primary flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                    <thead className="bg-gray-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {user.profilePicture ? (
                                  <img className="h-8 w-8 rounded-full object-cover" src={user.profilePicture} alt="" />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">
                                      {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            }`}>
                              {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-300">
                              <Settings className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">System Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    Database
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-slate-400">Total Records</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-slate-400">Storage Used</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">2.4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-slate-400">Last Backup</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">2 hours ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    Security
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-slate-400">SSL Certificate</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Valid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-slate-400">Firewall Status</span>
