import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Camera, 
  Save, 
  Palette,
  Upload,
  X,
  Check,
  Brain,
  Key,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader,
  Edit3
} from 'lucide-react'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const { themeOptions, currentTheme, setTheme, getCurrentTheme } = useThemeStore()
  
  // Personal Info State
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: user?.profilePicture || ''
  })

  // Business Info State
  const [isBusinessEditing, setIsBusinessEditing] = useState(false)
  const [businessData, setBusinessData] = useState({
    company: user?.company || '',
    companyDescription: user?.companyDescription || '',
    address: user?.address || '',
    brandLogo: user?.brandLogo || ''
  })

  // AI Integration State
  const [isAIEditing, setIsAIEditing] = useState(false)
  const [aiData, setAIData] = useState({
    apiKey: user?.apiKey || ''
  })
  const [detectedProvider, setDetectedProvider] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('unchecked')
  const [testingConnection, setTestingConnection] = useState(false)

  const [showThemeSelector, setShowThemeSelector] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBusinessChange = (e) => {
    const { name, value } = e.target
    setBusinessData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAIChange = (e) => {
    const { name, value } = e.target
    setAIData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-detect provider when key changes
    if (name === 'apiKey') {
      const provider = detectProvider(value)
      setDetectedProvider(provider)
      setConnectionStatus('unchecked')
    }
  }

  const detectProvider = (apiKey) => {
    if (!apiKey) return null
    
    if (apiKey.startsWith('sk-') && !apiKey.startsWith('sk-ant-')) {
      return { name: 'OpenAI', icon: '🤖', color: 'text-emerald-600 dark:text-emerald-400' }
    } else if (apiKey.startsWith('sk-ant-')) {
      return { name: 'Anthropic', icon: '🧠', color: 'text-orange-600 dark:text-orange-400' }
    } else if (apiKey.startsWith('AIza')) {
      return { name: 'Google Gemini', icon: '✨', color: 'text-blue-600 dark:text-blue-400' }
    } else if (apiKey.startsWith('co-')) {
      return { name: 'Cohere', icon: '⚡', color: 'text-purple-600 dark:text-purple-400' }
    }
    
    return { name: 'Unknown', icon: '❓', color: 'text-gray-600 dark:text-slate-400' }
  }

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleBusinessSave = () => {
    updateUser(businessData)
    setIsBusinessEditing(false)
  }

  const handleAISave = async () => {
    updateUser(aiData)
    setIsAIEditing(false)
    // Test connection after saving
    if (aiData.apiKey) {
      await testConnection()
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profilePicture: user?.profilePicture || ''
    })
    setIsEditing(false)
  }

  const handleBusinessCancel = () => {
    setBusinessData({
      company: user?.company || '',
      companyDescription: user?.companyDescription || '',
      address: user?.address || '',
      brandLogo: user?.brandLogo || ''
    })
    setIsBusinessEditing(false)
  }

  const handleAICancel = () => {
    setAIData({
      apiKey: user?.apiKey || ''
    })
    const provider = detectProvider(user?.apiKey || '')
    setDetectedProvider(provider)
    setIsAIEditing(false)
  }

  const testConnection = async () => {
    if (!aiData.apiKey) return
    
    setTestingConnection(true)
    setConnectionStatus('testing')
    
    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    // Mock connection test - in real app, this would make actual API calls
    const provider = detectProvider(aiData.apiKey)
    const isValid = aiData.apiKey.length > 20 && provider && provider.name !== 'Unknown'
    
    setConnectionStatus(isValid ? 'connected' : 'error')
    setTestingConnection(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'testing':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Key className="h-4 w-4 text-gray-400 dark:text-slate-500" />
    }
  }

  // Initialize detected provider on component mount
  useEffect(() => {
    if (user?.apiKey) {
      const provider = detectProvider(user.apiKey)
      setDetectedProvider(provider)
    }
  }, [user?.apiKey])

  const currentThemeData = getCurrentTheme()

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Personal Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn-success flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-500/50"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ring-4 ring-blue-500/50 relative">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                )}
                {isEditing && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="flex-1">
                  <input
                    type="url"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleInputChange}
                    placeholder="Enter profile picture URL"
                    className="input-field"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
              />
            ) : (
              <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
                {user?.name || 'Not set'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
              />
            ) : (
              <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
                {user?.email || 'Not set'}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
              />
            ) : (
              <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
                {user?.phone || 'Not set'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Information & Branding */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Business Information & Branding</h2>
          {!isBusinessEditing ? (
            <button
              onClick={() => setIsBusinessEditing(true)}
              className="btn-primary flex items-center"
            >
              <Building className="h-4 w-4 mr-2" />
              Edit Business
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleBusinessSave}
                className="btn-success flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleBusinessCancel}
                className="btn-secondary flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {businessData.brandLogo ? (
                  <img
                    src={businessData.brandLogo}
                    alt="Brand Logo"
                    className="h-16 w-16 object-contain bg-gray-100 dark:bg-slate-700 rounded-lg p-2"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400 dark:text-slate-500" />
                  </div>
                )}
                {isBusinessEditing && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              {isBusinessEditing && (
                <div className="flex-1">
                  <input
                    type="url"
                    name="brandLogo"
                    value={businessData.brandLogo}
                    onChange={handleBusinessChange}
                    placeholder="Enter logo URL"
                    className="input-field"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Company Name
            </label>
            {isBusinessEditing ? (
              <input
                type="text"
                name="company"
                value={businessData.company}
                onChange={handleBusinessChange}
                className="input-field"
              />
            ) : (
              <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
                {user?.company || 'Not set'}
              </div>
            )}
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Company Description
            </label>
            {isBusinessEditing ? (
              <textarea
                name="companyDescription"
                value={businessData.companyDescription}
                onChange={handleBusinessChange}
                rows={4}
                placeholder="Describe your company, services, and what makes you unique..."
                className="input-field resize-none"
              />
            ) : (
              <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 min-h-[100px]">
                {user?.companyDescription || 'Not set'}
              </div>
            )}
          </div>

          {/* Business Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Business Address
            </label>
            {isBusinessEditing ? (
              <textarea
                name="address"
                value={businessData.address}
                onChange={handleBusinessChange}
                rows={3}
                className="input-field resize-none"
              />
            ) : (
              <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 min-h-[80px]">
                {user?.address || 'Not set'}
              </div>
            )}
          </div>

          {/* Brand Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Brand Colors
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-600 shadow-sm"
                    style={{ background: currentThemeData.preview }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{currentThemeData.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Current theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className="btn-secondary flex items-center"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Change
                </button>
              </div>

              {showThemeSelector && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id)
                        setShowThemeSelector(false)
                      }}
                      className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        currentTheme === theme.id 
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <div 
                        className="w-full h-8 rounded-md mb-2 border border-gray-200 dark:border-slate-600"
                        style={{ background: theme.preview }}
                      ></div>
                      <p className="text-xs font-medium text-gray-900 dark:text-slate-100 text-center">
                        {theme.name}
                      </p>
                      {currentTheme === theme.id && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 dark:bg-blue-500 rounded-full p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Integration */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">AI Integration</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Connect your AI assistant with a single API key</p>
            </div>
          </div>
          {!isAIEditing ? (
            <button
              onClick={() => setIsAIEditing(true)}
              className="btn-primary flex items-center"
            >
              <Brain className="h-4 w-4 mr-2" />
              Configure AI
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleAISave}
                className="btn-success flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save & Test
              </button>
              <button
                onClick={handleAICancel}
                className="btn-secondary flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Universal API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              API Key
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  {isAIEditing ? (
                    <input
                      type="password"
                      name="apiKey"
                      value={aiData.apiKey}
                      onChange={handleAIChange}
                      placeholder="Paste your API key (OpenAI, Anthropic, Gemini, or Cohere)"
                      className="input-field"
                    />
                  ) : (
                    <div className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
                      {user?.apiKey ? '••••••••••••••••••••' : 'Not configured'}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(connectionStatus)}
                  <span className="text-sm text-gray-500 dark:text-slate-400 capitalize">
                    {connectionStatus === 'unchecked' ? 'Not tested' : connectionStatus}
                  </span>
                </div>
              </div>

              {/* Provider Detection Display */}
              {detectedProvider && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <span className="text-2xl">{detectedProvider.icon}</span>
                  <div>
                    <p className={`font-medium ${detectedProvider.color}`}>
                      {detectedProvider.name} Detected
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {detectedProvider.name === 'Unknown' 
                        ? 'Key format not recognized. Supported: OpenAI (sk-), Anthropic (sk-ant-), Gemini (AIza), Cohere (co-)'
                        : `Ready to connect to ${detectedProvider.name}`
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Connection Button */}
          {!isAIEditing && user?.apiKey && (
            <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
              <button
                onClick={testConnection}
                disabled={testingConnection}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {testingConnection ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {testingConnection ? 'Testing Connection...' : 'Test Connection'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
