import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { 
  Shield, 
  Users, 
  Bell, 
  Megaphone, 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  Plus,
  X,
  Save,
  AlertTriangle,
  Info,
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const { user, isAdmin, addNotification, addBanner, removeBanner, banners } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [newBanner, setNewBanner] = useState({
    type: 'info',
    title: '',
    message: '',
    active: true
  })
  const [newNotification, setNewNotification] = useState({
    type: 'info',
    title: '',
    message: '',
    targetUsers: 'all'
  })

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'banners', name: 'Banners', icon: Megaphone },
    { id: 'features', name: 'Features', icon: Settings },
  ]

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.message) {
      toast.error('Please fill in all banner fields')
      return
    }
    
    addBanner(newBanner)
    setNewBanner({ type: 'info', title: '', message: '', active: true })
    toast.success('Banner added successfully!')
  }

  const handleAddNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all notification fields')
      return
    }
    
    addNotification(newNotification)
    setNewNotification({ type: 'info', title: '', message: '', targetUsers: 'all' })
    toast.success('Notification sent successfully!')
  }

  const getBannerIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      case 'error': return X
      default: return Info
    }
  }

  const getBannerColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-red-500 mr-3" />
            Admin Panel
          </h1>
          <p className="mt-2 text-gray-600">
            Manage users, features, and system-wide settings
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="font-medium text-gray-900">{user?.name}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-500">+12% this month</p>
          </div>
          
          <div className="card text-center">
            <Bell className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Active Notifications</h3>
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-500">2 pending review</p>
          </div>
          
          <div className="card text-center">
            <Megaphone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Active Banners</h3>
            <p className="text-2xl font-bold text-purple-600">{banners.length}</p>
            <p className="text-sm text-gray-500">Across all pages</p>
          </div>
          
          <div className="card text-center">
            <Settings className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            <p className="text-2xl font-bold text-orange-600">8</p>
            <p className="text-sm text-gray-500">6 active, 2 beta</p>
          </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Add New Banner */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Banner</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Type
                  </label>
                  <select
                    value={newBanner.type}
                    onChange={(e) => setNewBanner({...newBanner, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newBanner.active}
                    onChange={(e) => setNewBanner({...newBanner, active: e.target.value === 'true'})}
                    className="input-field"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                  className="input-field"
                  placeholder="Important announcement..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Message
                </label>
                <textarea
                  value={newBanner.message}
                  onChange={(e) => setNewBanner({...newBanner, message: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Detailed message for users..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAddBanner}
                  className="btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </button>
              </div>
            </div>
          </div>

          {/* Existing Banners */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Banners</h2>
            {banners.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No banners created yet</p>
            ) : (
              <div className="space-y-4">
                {banners.map((banner) => {
                  const Icon = getBannerIcon(banner.type)
                  return (
                    <div
                      key={banner.id}
                      className={`p-4 rounded-lg border-2 ${getBannerColor(banner.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Icon className="h-5 w-5 mr-3 mt-0.5" />
                          <div>
                            <h3 className="font-medium">{banner.title}</h3>
                            <p className="text-sm mt-1">{banner.message}</p>
                            <p className="text-xs mt-2 opacity-75">
                              Created: {new Date(banner.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeBanner(banner.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Notification</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="input-field"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Users
                </label>
                <select
                  value={newNotification.targetUsers}
                  onChange={(e) => setNewNotification({...newNotification, targetUsers: e.target.value})}
                  className="input-field"
                >
                  <option value="all">All Users</option>
                  <option value="free">Free Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Title
              </label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                className="input-field"
                placeholder="New feature available..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Message
              </label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                className="input-field"
                rows={3}
                placeholder="Detailed notification message..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAddNotification}
                className="btn-primary flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Management</h2>
          <div className="space-y-4">
            {[
              { name: 'Needs Analysis Calculator', enabled: true, beta: false },
              { name: 'Client Intake Forms', enabled: false, beta: true },
              { name: 'PDF Export', enabled: true, beta: false },
              { name: 'AI Recommendations', enabled: true, beta: true },
              { name: 'Product Recommendation Engine', enabled: false, beta: true },
              { name: 'Sales Script Assistant', enabled: false, beta: true },
              { name: 'Legacy Planning Blueprint', enabled: false, beta: true },
              { name: 'Advanced Analytics', enabled: false, beta: false },
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        feature.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      {feature.beta && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Beta
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  {feature.enabled ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'John Doe', email: 'john@example.com', plan: 'Free', joined: '2024-01-15', status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@example.com', plan: 'Premium', joined: '2024-02-20', status: 'Active' },
                  { name: 'Mike Johnson', email: 'mike@example.com', plan: 'Free', joined: '2024-03-10', status: 'Inactive' },
                ].map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
