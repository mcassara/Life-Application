import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check for missing or placeholder environment variables
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' || 
    supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  throw new Error(`
    Missing or invalid Supabase environment variables. 
    
    Please update your .env file with your actual Supabase credentials:
    - VITE_SUPABASE_URL should be your Supabase project URL (e.g., https://your-project-ref.supabase.co)
    - VITE_SUPABASE_ANON_KEY should be your Supabase public API key
    
    You can find these values in your Supabase project dashboard under Settings > API.
    After updating the .env file, restart your development server.
  `)
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
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      })
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

  // Client Intakes (using clients table)
  async getClientIntakes(userId) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        needs_analyses(id, title, recommended_coverage, priority_score, status)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createClientIntake(userId, intakeData) {
    // Map intake data to client table structure
    const clientData = {
      first_name: intakeData.personal_info?.name?.split(' ')[0] || intakeData.client_name?.split(' ')[0] || '',
      last_name: intakeData.personal_info?.name?.split(' ').slice(1).join(' ') || intakeData.client_name?.split(' ').slice(1).join(' ') || '',
      email: intakeData.client_email || intakeData.personal_info?.email || '',
      phone: intakeData.client_phone || intakeData.personal_info?.phone || '',
      notes: JSON.stringify({
        personal_info: intakeData.personal_info || {},
        financial_info: intakeData.financial_info || {},
        family_info: intakeData.family_info || {},
        insurance_info: intakeData.insurance_info || {},
        completion_percentage: intakeData.completion_percentage || 0
      }),
      status: 'prospect'
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({ user_id: userId, ...clientData })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateClientIntake(id, updates) {
    // Map updates to client table structure
    const clientUpdates = {
      first_name: updates.personal_info?.name?.split(' ')[0] || updates.first_name,
      last_name: updates.personal_info?.name?.split(' ').slice(1).join(' ') || updates.last_name,
      email: updates.client_email || updates.email,
      phone: updates.client_phone || updates.phone,
      notes: updates.notes ? updates.notes : JSON.stringify({
        personal_info: updates.personal_info || {},
        financial_info: updates.financial_info || {},
        family_info: updates.family_info || {},
        insurance_info: updates.insurance_info || {},
        completion_percentage: updates.completion_percentage || 0
      })
    }

    const { data, error } = await supabase
      .from('clients')
      .update(clientUpdates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteClientIntake(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Import from Needs Analysis to Client Intake
  async importFromNeedsAnalysis(needsAnalysisId, userId) {
    const { data: analysis, error } = await supabase
    // Create client with data from needs analysis
      .from('needs_analyses')
    
        name: analysis.title || 'Client',
        age: analysis.metadata?.age,
        gender: analysis.metadata?.gender,
        maritalStatus: analysis.marital_status,
        occupation: analysis.metadata?.occupation,
        healthStatus: analysis.metadata?.healthStatus
      },
      financial_info: {
        annualIncome: analysis.annual_income,
        currentSavings: analysis.current_savings,
        monthlyExpenses: analysis.monthly_expenses,
        existingLifeInsurance: analysis.current_life_insurance
      },
      family_info: {
        numberOfChildren: analysis.number_of_dependents,
        childrenAges: analysis.children_ages,
        spouseAge: analysis.metadata?.spouseAge,
        spouseIncome: analysis.spouse_income
      },
      insurance_info: {
        currentLifeInsurance: analysis.current_life_insurance,
        currentHealthInsurance: analysis.metadata?.currentHealthInsurance,
        employerBenefits: analysis.employer_benefits
      },
      completion_percentage: 75 // Pre-filled from analysis
    }
    
    return this.createClientIntake(userId, intakeData)
  },

  // Client Documents
  async getClientDocuments(userId, clientId = null) {
    let query = supabase
      .from('client_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (clientId) {
      query = query.eq('client_id', clientId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async uploadClientDocument(userId, clientId, documentData) {
    const { data, error } = await supabase
      .from('client_documents')
      .insert({
        user_id: userId,
        client_id: clientId,
        ...documentData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Client Communications
  async getClientCommunications(userId, clientId = null) {
    let query = supabase
      .from('client_communications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (clientId) {
      query = query.eq('client_id', clientId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async createCommunication(userId, clientId, communicationData) {
    const { data, error } = await supabase
      .from('client_communications')
      .insert({
        user_id: userId,
        client_id: clientId,
        ...communicationData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Analysis Templates
  async getAnalysisTemplates(userId, includePublic = true) {
    let query = supabase
      .from('analysis_templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (includePublic) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`)
    } else {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async createAnalysisTemplate(userId, templateData) {
    const { data, error } = await supabase
      .from('analysis_templates')
      .insert({
        user_id: userId,
        ...templateData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
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
  },

  // Enhanced client operations
  async getClients(userId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createClient(userId, clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        ...clientData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateClient(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteClient(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}