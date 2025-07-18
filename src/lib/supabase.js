import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const db = {
  // Auth operations
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Needs Analysis operations
  async getNeedsAnalyses(userId) {
    try {
      const { data, error } = await supabase
        .from('needs_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching needs analyses:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error in getNeedsAnalyses:', error)
      return []
    }
  },

  async createNeedsAnalysis(userId, analysisData) {
    const { data, error } = await supabase
      .from('needs_analyses')
      .insert([{
        user_id: userId,
        client_name: analysisData.clientName,
        client_age: analysisData.clientAge,
        annual_income: analysisData.annualIncome,
        current_savings: analysisData.currentSavings,
        monthly_expenses: analysisData.monthlyExpenses,
        dependents: analysisData.dependents,
        existing_life_insurance: analysisData.existingLifeInsurance,
        existing_disability_insurance: analysisData.existingDisabilityInsurance,
        debt_obligations: analysisData.debtObligations,
        financial_goals: analysisData.financialGoals,
        risk_tolerance: analysisData.riskTolerance,
        life_insurance_need: analysisData.lifeInsuranceNeed,
        disability_insurance_need: analysisData.disabilityInsuranceNeed,
        coverage_gap: analysisData.coverageGap,
        recommendations: analysisData.recommendations
      }])
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

  // Client operations
  async getClientIntakes(userId) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching clients:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error in getClientIntakes:', error)
      return []
    }
  },

  async createClientIntake(userId, intakeData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        user_id: userId,
        first_name: intakeData.firstName || '',
        last_name: intakeData.lastName || '',
        email: intakeData.email || '',
        phone: intakeData.phone || '',
        status: intakeData.status || 'prospect',
        notes: JSON.stringify({
          completion_percentage: intakeData.completion_percentage || 0,
          personal_info: intakeData.personal_info || {},
          financial_info: intakeData.financial_info || {},
          family_info: intakeData.family_info || {},
          insurance_info: intakeData.insurance_info || {}
        })
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateClientIntake(id, updates) {
    const updateData = {
      first_name: updates.firstName,
      last_name: updates.lastName,
      email: updates.email,
      phone: updates.phone,
      status: updates.status,
      notes: JSON.stringify({
        completion_percentage: updates.completion_percentage || 0,
        personal_info: updates.personal_info || {},
        financial_info: updates.financial_info || {},
        family_info: updates.family_info || {},
        insurance_info: updates.insurance_info || {}
      })
    }

    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
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

  async importFromNeedsAnalysis(analysisId, userId) {
    // Get the analysis data
    const { data: analysis, error: analysisError } = await supabase
      .from('needs_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (analysisError) throw analysisError

    // Create client from analysis data
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        user_id: userId,
        first_name: analysis.client_name?.split(' ')[0] || '',
        last_name: analysis.client_name?.split(' ').slice(1).join(' ') || '',
        email: '',
        phone: '',
        status: 'prospect',
        notes: JSON.stringify({
          completion_percentage: 75,
          imported_from_analysis: analysisId,
          analysis_data: {
            annual_income: analysis.annual_income,
            current_savings: analysis.current_savings,
            monthly_expenses: analysis.monthly_expenses,
            dependents: analysis.dependents
          }
        })
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export default supabase
