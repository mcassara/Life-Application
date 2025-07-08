import React, { useState, useEffect } from 'react'
import { useClientIntakeStore } from '../store/clientIntakeStore'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import { 
  FileText, 
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Calendar,
  Shield,
  Database,
  Import,
  Plus,
  Eye,
  X,
  Calculator
} from 'lucide-react'

const ClientIntake = () => {
  const { user } = useAuthStore()
  const { intakes, loadIntakes, importFromAnalysis, isLoading } = useClientIntakeStore()
  const { analyses, getAnalysesForImport } = useAnalysisStore()
  const [showImportModal, setShowImportModal] = useState(false)
  
  useEffect(() => {
    if (user) {
      loadIntakes()
    }
  }, [user, loadIntakes])
  
  const availableAnalyses = getAnalysesForImport()
  
  const handleImport = async (analysisId) => {
    try {
      await importFromAnalysis(analysisId)
      setShowImportModal(false)
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  const features = [
    {
      icon: FileText,
      title: 'Digital Forms',
      description: 'Smart, adaptive forms that adjust based on client responses',
      status: 'coming-soon'
    },
    {
      icon: Users,
      title: 'Client Portal',
      description: 'Secure client dashboard for document uploads and communication',
      status: 'coming-soon'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered appointment scheduling with automated reminders',
      status: 'coming-soon'
    },
    {
      icon: Database,
      title: 'Data Integration',
      description: 'Seamless integration with existing CRM and policy management systems',
      status: 'coming-soon'
    }
  ]

  const currentTools = [
    {
      name: 'Needs Analysis',
      description: 'Calculate comprehensive insurance needs',
      href: '/needs-analysis',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      name: 'Future Tools',
      description: 'Explore upcoming features and capabilities',
      href: '/future-tools',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      available: true
    }
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          Client Intake System
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
          A comprehensive client onboarding solution designed specifically for insurance professionals
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
          <Clock className="h-4 w-4 mr-2" />
          Coming Soon - In Development
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="section-card bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Import from Needs Analysis */}
          {availableAnalyses.length > 0 && (
            <div className="mb-8 p-6 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center justify-center">
                <Import className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                Import from Needs Analysis
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Start a client intake with data from an existing needs analysis
              </p>
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-primary flex items-center mx-auto"
              >
                <Import className="h-4 w-4 mr-2" />
                Import Client Data
              </button>
            </div>
          )}
          
          <div className="relative mb-6">
            <Sparkles className="h-12 w-12 text-blue-400 mx-auto" />
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Exciting Features Coming Soon!
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8">
            We're building a comprehensive client intake system that will revolutionize how you onboard new clients. 
            Stay tuned for digital forms, client portals, appointment scheduling, and much more.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-600 slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">{feature.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{feature.description}</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-sm text-gray-500 dark:text-slate-400">
            Want to be notified when this launches? Your profile is already set up to receive updates!
          </p>
        </div>
      </div>

      {/* Current Tools */}
      <div className="section-card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
          <Zap className="h-5 w-5 text-blue-400 mr-2" />
          Available Tools
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">
          While we're building the Client Intake system, make the most of our current tools:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentTools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <a
                key={tool.name}
                href={tool.href}
                className="group flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 slide-up shadow-sm hover:shadow-md"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{tool.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
              </a>
            )
          })}
        </div>
      </div>

      {/* Development Timeline */}
      <div className="section-card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-purple-400 mr-2" />
          Development Roadmap
        </h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-4 animate-pulse"></div>
            <div>
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Phase 1: Core Infrastructure</h3>
              <p className="text-xs text-gray-600 dark:text-slate-400">Database design and API development</p>
            </div>
            <div className="ml-auto text-xs text-blue-600 dark:text-blue-400 font-medium">In Progress</div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
            <div className="w-3 h-3 bg-gray-400 dark:bg-slate-500 rounded-full mr-4"></div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">Phase 2: Digital Forms</h3>
              <p className="text-xs text-gray-600 dark:text-slate-400">Smart form builder and validation system</p>
            </div>
            <div className="ml-auto text-xs text-gray-500 dark:text-slate-400 font-medium">Planned</div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
            <div className="w-3 h-3 bg-gray-400 dark:bg-slate-500 rounded-full mr-4"></div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">Phase 3: Client Portal</h3>
              <p className="text-xs text-gray-600 dark:text-slate-400">Secure client dashboard and communication tools</p>
            </div>
            <div className="ml-auto text-xs text-gray-500 dark:text-slate-400 font-medium">Planned</div>
          </div>
        </div>
      </div>

        {/* Current Intakes */}
        {intakes.length > 0 && (
          <div className="section-card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              Current Client Intakes
            </h2>
            <div className="space-y-4">
              {intakes.slice(0, 5).map((intake) => (
                <div key={intake.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {intake.client_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {intake.completion_percentage}% complete • {intake.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${intake.completion_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {new Date(intake.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Import from Needs Analysis
                  </h3>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  Select a completed needs analysis to import client data and start the intake process.
                </p>
                
                <div className="space-y-3">
                  {availableAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                      <div className="flex items-center">
                        <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-slate-100">
                            {analysis.client_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Coverage Gap: ${analysis.coverage_gap?.toLocaleString() || '0'} • 
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleImport(analysis.id)}
                        disabled={isLoading}
                        className="btn-primary flex items-center disabled:opacity-50"
                      >
                        <Import className="h-4 w-4 mr-2" />
                        Import
                      </button>
                    </div>
                  ))}
                </div>
                
                {availableAnalyses.length === 0 && (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-slate-400">
                      No completed needs analyses available for import.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientIntake