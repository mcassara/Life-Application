import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database helper functions
export const db = {
  // User Profiles
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Needs Analyses
  async getNeedsAnalyses(userId) {
    const { data, error } = await supabase
      .from('needs_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createNeedsAnalysis(userId, analysisData) {
    const { data, error } = await supabase
      .from('needs_analyses')
      .insert({
        user_id: userId,
        ...analysisData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateNeedsAnalysis(id, updates) {
    const { data, error } = await supabase
      .from('needs_analyses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteNeedsAnalysis(id) {
    const { error } = await supabase
      .from('needs_analyses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Client Intakes
  async getClientIntakes(userId) {
    const { data, error } = await supabase
      .from('client_intakes')
      .select(`
        *,
        needs_analysis:needs_analyses(id, client_name, total_needs, coverage_gap)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createClientIntake(userId, intakeData) {
    const { data, error } = await supabase
      .from('client_intakes')
      .insert({
        user_id: userId,
        ...intakeData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateClientIntake(id, updates) {
    const { data, error } = await supabase
      .from('client_intakes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteClientIntake(id) {
    const { error } = await supabase
      .from('client_intakes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Import from Needs Analysis to Client Intake
  async importFromNeedsAnalysis(needsAnalysisId, userId) {
    const { data: analysis, error } = await supabase
      .from('needs_analyses')
      .select('*')
      .eq('id', needsAnalysisId)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    
    // Create client intake with data from needs analysis
    const intakeData = {
      needs_analysis_id: analysis.id,
      client_name: analysis.client_name,
      client_email: analysis.client_data?.email || '',
      client_phone: analysis.client_data?.phone || '',
      personal_info: {
        name: analysis.client_name,
        age: analysis.client_data?.age,
        gender: analysis.client_data?.gender,
        maritalStatus: analysis.client_data?.maritalStatus,
        occupation: analysis.client_data?.occupation,
        healthStatus: analysis.client_data?.healthStatus
      },
      financial_info: {
        annualIncome: analysis.client_data?.annualIncome,
        currentSavings: analysis.client_data?.currentSavings,
        monthlyExpenses: analysis.client_data?.monthlyExpenses,
        existingLifeInsurance: analysis.client_data?.existingLifeInsurance
      },
      family_info: {
        numberOfChildren: analysis.client_data?.numberOfChildren,
        childrenAges: analysis.client_data?.childrenAges,
        spouseAge: analysis.client_data?.spouseAge,
        spouseIncome: analysis.client_data?.spouseIncome
      },
      insurance_info: {
        currentLifeInsurance: analysis.client_data?.existingLifeInsurance,
        currentHealthInsurance: analysis.client_data?.currentHealthInsurance,
        employerBenefits: analysis.client_data?.employerBenefits
      },
      completion_percentage: 75 // Pre-filled from analysis
    }
    
    return this.createClientIntake(userId, intakeData)
  },

  // System Banners
  async getActiveBanners() {
    const { data, error } = await supabase
      .from('system_banners')
      .select('*')
      .eq('active', true)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createBanner(userId, bannerData) {
    const { data, error } = await supabase
      .from('system_banners')
      .insert({
        created_by: userId,
        ...bannerData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteBanner(id) {
    const { error } = await supabase
      .from('system_banners')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // User Notifications
  async getUserNotifications(userId) {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async markNotificationAsRead(id) {
    const { error } = await supabase
      .from('user_notifications')
      .update({ read: true })
      .eq('id', id)
    
    if (error) throw error
  }
}