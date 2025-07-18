import { useState, useEffect } from 'react'
import { analytics } from '../lib/analytics'
import { useAuthStore } from '../store/authStore'

export const useUserAnalytics = (daysBack = 30) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)
        
        const [summary, analytics_data, lifecycle] = await Promise.all([
          analytics.getUserActivitySummary(user.id, daysBack),
          analytics.getUserAnalytics(user.id),
          analytics.getClientLifecycleAnalytics(user.id)
        ])

        setData({
          summary,
          analytics: analytics_data,
          lifecycle
        })
      } catch (err) {
        setError(err.message)
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, daysBack])

  return { data, loading, error, refetch: () => fetchAnalytics() }
}

export const useClientEngagement = (clientId) => {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEngagementScore = async () => {
      if (!clientId) return

      try {
        setLoading(true)
        setError(null)
        const engagementScore = await analytics.getClientEngagementScore(clientId)
        setScore(engagementScore)
      } catch (err) {
        setError(err.message)
        console.error('Engagement score fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEngagementScore()
  }, [clientId])

  return { score, loading, error }
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useAuthStore()

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!isAdmin()) return

      try {
        setLoading(true)
        setError(null)
        const systemMetrics = await analytics.getSystemPerformanceMetrics()
        setMetrics(systemMetrics)
      } catch (err) {
        setError(err.message)
        console.error('System metrics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [isAdmin])

  return { metrics, loading, error }
}
