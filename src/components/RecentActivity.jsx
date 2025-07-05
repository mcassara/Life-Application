import React from 'react'
import { Clock, FileText, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      client: 'Sarah Johnson',
      action: 'Submitted life insurance application',
      time: '2 hours ago',
      status: 'pending',
      icon: FileText,
      color: 'yellow'
    },
    {
      id: 2,
      client: 'Mike Chen',
      action: 'Completed needs analysis meeting',
      time: '4 hours ago',
      status: 'completed',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      client: 'Emma Davis',
      action: 'Follow-up call scheduled',
      time: '1 day ago',
      status: 'scheduled',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 4,
      client: 'Robert Wilson',
      action: 'Policy review required',
      time: '2 days ago',
      status: 'urgent',
      icon: AlertCircle,
      color: 'red'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getBorderColor = (color) => {
    switch (color) {
      case 'yellow': return 'border-l-yellow-400'
      case 'green': return 'border-l-green-400'
      case 'blue': return 'border-l-blue-400'
      case 'red': return 'border-l-red-400'
      default: return 'border-l-gray-400'
    }
  }

  const getIconColor = (color) => {
    switch (color) {
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400'
      case 'green': return 'text-green-600 dark:text-green-400'
      case 'blue': return 'text-blue-600 dark:text-blue-400'
      case 'red': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Recent Activities
        </h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${getBorderColor(activity.color)} bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-all duration-200`}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                  <Icon className={`h-4 w-4 ${getIconColor(activity.color)}`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {activity.client}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {activity.action}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} flex-shrink-0`}>
                    {activity.status}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2">
          Load more activities
        </button>
      </div>
    </div>
  )
}

export default RecentActivity
