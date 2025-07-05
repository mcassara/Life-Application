import React, { useState } from 'react'
import { useAnalysisStore } from '../store/analysisStore'
import { 
  Calculator, 
  User, 
  DollarSign, 
  Calendar, 
  Users, 
  Home,
  GraduationCap,
  Heart,
  TrendingUp,
  FileText,
  Download,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'

const NeedsAnalysis = () => {
  const { addAnalysis } = useAnalysisStore()
  
  const [formData, setFormData] = useState({
    // Client Information
    clientName: '',
    age: '',
    gender: 'male',
    maritalStatus: 'single',
    
    // Financial Information
    annualIncome: '',
    currentSavings: '',
    monthlyExpenses: '',
    existingLifeInsurance: '',
    
    // Family Information
    numberOfChildren: '',
    childrenAges: '',
    spouseAge: '',
    spouseIncome: '',
    
    // Goals and Obligations
    mortgageBalance: '',
    otherDebts: '',
    educationFunds: '',
    retirementGoals: '',
    
    // Additional Factors
    healthStatus: 'excellent',
    occupation: '',
    riskTolerance: 'moderate'
  })

  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateNeeds = () => {
    if (!formData.clientName || !formData.age || !formData.annualIncome) {
      toast.error('Please fill in the required fields (Name, Age, Annual Income)')
      return
    }

    setIsCalculating(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      const income = parseFloat(formData.annualIncome) || 0
      const savings = parseFloat(formData.currentSavings) || 0
      const expenses = parseFloat(formData.monthlyExpenses) || 0
      const mortgage = parseFloat(formData.mortgageBalance) || 0
      const debts = parseFloat(formData.otherDebts) || 0
      const education = parseFloat(formData.educationFunds) || 0
      const existing = parseFloat(formData.existingLifeInsurance) || 0
      const children = parseInt(formData.numberOfChildren) || 0
      const spouseIncome = parseFloat(formData.spouseIncome) || 0

      // Income replacement calculation (10x annual income rule with adjustments)
      let incomeMultiplier = 10
      if (formData.age < 30) incomeMultiplier = 12
      if (formData.age > 50) incomeMultiplier = 8
      if (children > 0) incomeMultiplier += children * 1.5
      if (formData.maritalStatus === 'married' && spouseIncome > 0) {
        incomeMultiplier -= (spouseIncome / income) * 2
      }

      const incomeReplacement = income * incomeMultiplier

      // Debt coverage
      const debtCoverage = mortgage + debts

      // Education funding (estimated $50k per child)
      const educationCoverage = children * 50000 + education

      // Final expenses (funeral, etc.)
      const finalExpenses = 15000

      // Total needs
      const totalNeeds = incomeReplacement + debtCoverage + educationCoverage + finalExpenses

      // Coverage gap
      const coverageGap = Math.max(0, totalNeeds - existing - savings)

      // Monthly premium estimate (rough calculation)
      const ageMultiplier = formData.age < 30 ? 0.5 : formData.age < 40 ? 0.7 : formData.age < 50 ? 1.0 : 1.5
      const healthMultiplier = formData.healthStatus === 'excellent' ? 0.8 : formData.healthStatus === 'good' ? 1.0 : 1.3
      const estimatedPremium = (coverageGap / 1000) * 1.2 * ageMultiplier * healthMultiplier

      const calculationResults = {
        totalNeeds: Math.round(totalNeeds),
        incomeReplacement: Math.round(incomeReplacement),
        debtCoverage: Math.round(debtCoverage),
        educationCoverage: Math.round(educationCoverage),
        finalExpenses,
        existingCoverage: existing + savings,
        coverageGap: Math.round(coverageGap),
        estimatedPremium: Math.round(estimatedPremium),
        recommendations: generateRecommendations(coverageGap, formData)
      }

      setResults(calculationResults)
      setIsCalculating(false)
      
      // Save to store
      addAnalysis({
        clientName: formData.clientName,
        ...calculationResults,
        formData: { ...formData }
      })

      toast.success('Analysis completed successfully!')
    }, 2000)
  }

  const generateRecommendations = (gap, data) => {
    const recommendations = []
    
    if (gap > 500000) {
      recommendations.push({
        type: 'coverage',
        title: 'Consider Term Life Insurance',
        description: 'A 20-30 year term policy would provide substantial coverage at an affordable premium.',
        priority: 'high'
      })
    }
    
    if (data.age < 40 && gap > 200000) {
      recommendations.push({
        type: 'investment',
        title: 'Whole Life Insurance Option',
        description: 'Consider permanent insurance with cash value accumulation for long-term wealth building.',
        priority: 'medium'
      })
    }
    
    if (parseInt(data.numberOfChildren) > 0) {
      recommendations.push({
        type: 'education',
        title: 'Education Funding Strategy',
        description: 'Separate education savings plan (529) combined with term insurance for comprehensive protection.',
        priority: 'high'
      })
    }
    
    if (parseFloat(data.currentSavings) < parseFloat(data.annualIncome) * 0.5) {
      recommendations.push({
        type: 'savings',
        title: 'Emergency Fund Priority',
        description: 'Build emergency savings to 6 months of expenses before increasing insurance coverage.',
        priority: 'high'
      })
    }

    return recommendations
  }

  const resetForm = () => {
    setFormData({
      clientName: '',
      age: '',
      gender: 'male',
      maritalStatus: 'single',
      annualIncome: '',
      currentSavings: '',
      monthlyExpenses: '',
      existingLifeInsurance: '',
      numberOfChildren: '',
      childrenAges: '',
      spouseAge: '',
      spouseIncome: '',
      mortgageBalance: '',
      otherDebts: '',
      educationFunds: '',
      retirementGoals: '',
      healthStatus: 'excellent',
      occupation: '',
      riskTolerance: 'moderate'
    })
    setResults(null)
    toast.success('Form reset successfully')
  }

  const exportToPDF = () => {
    if (!results) return
    
    // Create a simple text-based report
    const reportContent = `
LIFE INSURANCE NEEDS ANALYSIS REPORT
=====================================

Client: ${formData.clientName}
Date: ${new Date().toLocaleDateString()}

ANALYSIS SUMMARY:
- Total Insurance Needs: $${results.totalNeeds.toLocaleString()}
- Existing Coverage: $${results.existingCoverage.toLocaleString()}
- Coverage Gap: $${results.coverageGap.toLocaleString()}
- Estimated Monthly Premium: $${results.estimatedPremium.toLocaleString()}

BREAKDOWN:
- Income Replacement: $${results.incomeReplacement.toLocaleString()}
- Debt Coverage: $${results.debtCoverage.toLocaleString()}
- Education Funding: $${results.educationCoverage.toLocaleString()}
- Final Expenses: $${results.finalExpenses.toLocaleString()}

RECOMMENDATIONS:
${results.recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n')}

Generated by LifeGuard Pro Insurance Analysis System
    `.trim()

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.clientName.replace(/\s+/g, '_')}_Insurance_Analysis.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Report exported successfully!')
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Life Insurance Needs Analysis
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                Comprehensive analysis to determine optimal insurance coverage
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={resetForm}
              className="btn-secondary flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            {results && (
              <button
                onClick={exportToPDF}
                className="btn-primary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Client Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter client's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter age"
                  min="18"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter occupation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Health Status
                </label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              Financial Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Annual Income *
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter annual income"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Current Savings
                </label>
                <input
                  type="number"
                  name="currentSavings"
                  value={formData.currentSavings}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter current savings"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Monthly Expenses
                </label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter monthly expenses"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Existing Life Insurance
                </label>
                <input
                  type="number"
                  name="existingLifeInsurance"
                  value={formData.existingLifeInsurance}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter existing coverage"
                />
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              Family Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Number of Children
                </label>
                <input
                  type="number"
                  name="numberOfChildren"
                  value={formData.numberOfChildren}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter number of children"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Children's Ages
                </label>
                <input
                  type="text"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., 5, 8, 12"
                />
              </div>
              
              {formData.maritalStatus === 'married' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Spouse Age
                    </label>
                    <input
                      type="number"
                      name="spouseAge"
                      value={formData.spouseAge}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter spouse age"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Spouse Income
                    </label>
                    <input
                      type="number"
                      name="spouseIncome"
                      value={formData.spouseIncome}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter spouse income"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Goals and Obligations */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <Home className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
              Goals & Obligations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Mortgage Balance
                </label>
                <input
                  type="number"
                  name="mortgageBalance"
                  value={formData.mortgageBalance}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter mortgage balance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Other Debts
                </label>
                <input
                  type="number"
                  name="otherDebts"
                  value={formData.otherDebts}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter other debts"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Education Fund Goals
                </label>
                <input
                  type="number"
                  name="educationFunds"
                  value={formData.educationFunds}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter education funding goals"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Risk Tolerance
                </label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <button
              onClick={calculateNeeds}
              disabled={isCalculating}
              className="w-full btn-primary flex items-center justify-center text-lg py-4"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Calculating Analysis...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-3" />
                  Calculate Insurance Needs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Summary Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  Analysis Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Needs</span>
                    <span className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      ${results.totalNeeds.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Existing Coverage</span>
                    <span className="text-lg font-bold text-green-900 dark:text-green-200">
                      ${results.existingCoverage.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">Coverage Gap</span>
                    <span className="text-lg font-bold text-red-900 dark:text-red-200">
                      ${results.coverageGap.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Est. Monthly Premium</span>
                    <span className="text-lg font-bold text-purple-900 dark:text-purple-200">
                      ${results.estimatedPremium.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  Needs Breakdown
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Income Replacement</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      ${results.incomeReplacement.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Debt Coverage</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      ${results.debtCoverage.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Education Funding</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      ${results.educationCoverage.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Final Expenses</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      ${results.finalExpenses.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  Recommendations
                </h3>
                
                <div className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' 
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    }`}>
                      <div className="flex items-start">
                        {rec.priority === 'high' ? (
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                        ) : (
                          <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className={`text-sm font-medium ${
                            rec.priority === 'high' 
                              ? 'text-red-800 dark:text-red-300' 
                              : 'text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {rec.title}
                          </h4>
                          <p className={`text-xs mt-1 ${
                            rec.priority === 'high' 
                              ? 'text-red-700 dark:text-red-400' 
                              : 'text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {rec.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                  Fill out the form and click "Calculate Insurance Needs" to see the analysis results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NeedsAnalysis
