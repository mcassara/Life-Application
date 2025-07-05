import React from 'react'
import { 
  Sparkles, 
  Brain,
  Zap,
  Rocket,
  Shield,
  TrendingUp,
  Users,
  FileText,
  Calculator,
  BarChart3,
  MessageSquare,
  Calendar,
  Globe,
  Lock,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb
} from 'lucide-react'

const FutureTools = () => {
  const upcomingFeatures = [
    {
      category: 'AI & Automation',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      features: [
        {
          name: 'AI Policy Recommendations',
          description: 'Machine learning algorithms that analyze client data to suggest optimal policy types and coverage amounts',
          status: 'In Development',
          eta: 'Q2 2024'
        },
        {
          name: 'Automated Underwriting Assistant',
          description: 'AI-powered pre-screening tool that predicts underwriting outcomes and identifies potential issues',
          status: 'Planning',
          eta: 'Q3 2024'
        },
        {
          name: 'Smart Document Processing',
          description: 'OCR and AI technology to automatically extract and process information from client documents',
          status: 'Research',
          eta: 'Q4 2024'
        }
      ]
    },
    {
      category: 'Client Management',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      features: [
        {
          name: 'Advanced CRM Integration',
          description: 'Seamless integration with popular CRM systems including Salesforce, HubSpot, and Pipedrive',
          status: 'In Development',
          eta: 'Q2 2024'
        },
        {
          name: 'Client Communication Hub',
          description: 'Unified messaging platform with SMS, email, and video calling capabilities',
          status: 'Planning',
          eta: 'Q3 2024'
        },
        {
          name: 'Automated Follow-up System',
          description: 'Smart scheduling and automated reminders for policy reviews and client check-ins',
          status: 'Planning',
          eta: 'Q3 2024'
        }
      ]
    },
    {
      category: 'Analytics & Reporting',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      features: [
        {
          name: 'Advanced Analytics Dashboard',
          description: 'Comprehensive business intelligence with predictive analytics and performance forecasting',
          status: 'In Development',
          eta: 'Q2 2024'
        },
        {
          name: 'Commission Tracking',
          description: 'Automated commission calculation and tracking with detailed reporting and projections',
          status: 'Planning',
          eta: 'Q3 2024'
        },
        {
          name: 'Market Analysis Tools',
          description: 'Real-time market data and competitive analysis to optimize pricing and positioning',
          status: 'Research',
          eta: 'Q4 2024'
        }
      ]
    },
    {
      category: 'Compliance & Security',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      features: [
        {
          name: 'Regulatory Compliance Monitor',
          description: 'Automated compliance checking and alerts for changing regulations across all states',
          status: 'In Development',
          eta: 'Q2 2024'
        },
        {
          name: 'Advanced Security Suite',
          description: 'Enhanced encryption, multi-factor authentication, and advanced threat protection',
          status: 'Planning',
          eta: 'Q3 2024'
        },
        {
          name: 'Audit Trail System',
          description: 'Comprehensive logging and audit capabilities for regulatory compliance and internal reviews',
          status: 'Planning',
          eta: 'Q3 2024'
        }
      ]
    }
  ]

  const currentTools = [
    {
      name: 'Needs Analysis Calculator',
      description: 'Comprehensive insurance needs analysis with detailed reporting',
      href: '/needs-analysis',
      icon: Calculator,
      status: 'Available Now'
    },
    {
      name: 'Client Intake System',
      description: 'Streamlined client onboarding and information collection',
      href: '/client-intake',
      icon: FileText,
      status: 'Coming Soon'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Development':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700'
      case 'Planning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
      case 'Research':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700'
      case 'Available Now':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
      case 'Coming Soon':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300 border-gray-200 dark:border-slate-600'
    }
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          Future Tools & Features
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
          Discover the cutting-edge features we're building to revolutionize your insurance practice. 
          The future of insurance technology is here.
        </p>
      </div>

      {/* Innovation Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <Rocket className="h-6 w-6 mr-3" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Innovation Pipeline
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Building the Future of Insurance Technology
            </h2>
            <p className="text-purple-100 mb-4">
              Our development team is working around the clock to bring you the most advanced tools in the industry. 
              Every feature is designed with your success in mind.
            </p>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2" />
              <span>Updated roadmap • Last updated: January 2024</span>
            </div>
          </div>
          <div className="hidden sm:block ml-8">
            <div className="relative">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-white/5 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Tools */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          Available Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentTools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <a
                key={tool.name}
                href={tool.href}
                className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tool.status)}`}>
                    {tool.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200 ml-2" />
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Future Features by Category */}
      {upcomingFeatures.map((category, categoryIndex) => {
        const CategoryIcon = category.icon
        return (
          <div key={category.category} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6 slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
            <div className="flex items-center mb-6">
              <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <CategoryIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{category.category}</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {category.features.length} features in development
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {category.features.map((feature, featureIndex) => (
                <div key={feature.name} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-slate-100 flex items-center">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                      {feature.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                        {feature.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        {feature.eta}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Innovation Commitment */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 sm:p-8 border border-blue-200 dark:border-blue-700">
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Your Success Drives Our Innovation
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
            Every feature we build is based on real feedback from insurance professionals like you. 
            We're committed to staying at the forefront of technology to give you the competitive edge you need.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">50+</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Features Planned</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">24/7</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Development Cycle</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">100%</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">User-Focused</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
            Have Ideas? We Want to Hear Them!
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Your feedback shapes our roadmap. Let us know what features would make the biggest impact on your business.
          </p>
          <button className="btn-primary">
            Share Your Ideas
          </button>
        </div>
      </div>
    </div>
  )
}

export default FutureTools
