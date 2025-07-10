import { supabase } from './supabase'

export const analytics = {
  // Get user activity summary
  async getUserActivitySummary(userId, daysBack = 30) {
    try {
      const { data, error } = await supabase.rpc('get_user_activity_summary', {
        user_uuid: userId,
        days_back: daysBack
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user activity summary:', error)
      throw error
    }
  },

  // Calculate client engagement score
  async getClientEngagementScore(clientId) {
    try {
      const { data, error } = await supabase.rpc('calculate_client_engagement_score', {
        client_uuid: clientId
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error calculating client engagement score:', error)
      throw error
    }
  },

  // Get user analytics view
  async getUserAnalytics(userId) {
    try {
      const { data, error } = await supabase
        .from('user_activity_analytics')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      throw error
    }
  },

  // Get client lifecycle analytics
  async getClientLifecycleAnalytics(userId) {
    try {
      const { data, error } = await supabase
        .from('client_lifecycle_analytics')
        .select('*')
        .eq('user_id', userId)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching client lifecycle analytics:', error)
      throw error
    }
  },

  // Get system performance metrics (admin only)
  async getSystemPerformanceMetrics() {
    try {
      const { data, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching system performance metrics:', error)
      throw error
    }
  },

  // Update user last login
  async updateUserLastLogin(userId) {
    try {
      const { error } = await supabase.rpc('update_user_last_login', {
        user_uuid: userId
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error updating user last login:', error)
      // Don't throw error for this non-critical operation
    }
  },

  // Archive old analyses (admin only)
  async archiveOldAnalyses(daysOld = 365) {
    try {
      const { data, error } = await supabase.rpc('archive_old_analyses', {
        days_old: daysOld
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error archiving old analyses:', error)
      throw error
    }
  },

  // Cleanup expired data (admin only)
  async cleanupExpiredData() {
    try {
      const [notificationsResult, bannersResult] = await Promise.all([
        supabase.rpc('cleanup_expired_notifications'),
        supabase.rpc('cleanup_expired_banners')
      ])
      
      if (notificationsResult.error) throw notificationsResult.error
      if (bannersResult.error) throw bannersResult.error
      
      return {
        expiredNotifications: notificationsResult.data,
        expiredBanners: bannersResult.data
      }
    } catch (error) {
      console.error('Error cleaning up expired data:', error)
      throw error
    }
  }
}