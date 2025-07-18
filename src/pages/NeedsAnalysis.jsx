import React, { useState } from 'react'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import { 
  Calculator, 
  User, 
  DollarSign, 
  Users, 
  GraduationCap,
  Heart,
  FileText,
  Download,
  RotateCcw,
  AlertCircle,
  Info,
  Phone,
  Calendar,
  TrendingUp,
  Shield,
  Target,
  PiggyBank
} from 'lucide-react'
import toast from 'react-hot-toast'

const NeedsAnalysis = () => {
  const { createAnalysis, isLoading: analysisLoading } = useAnalysisStore()
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    // Client Information
    clientName: '',
    age: '',
    gender: 'male',
    maritalStatus: 'single',
    occupation: '',
    healthStatus: 'excellent',
    
    // D.I.M.E Analysis - Debt
    mortgageBalance: '',
    creditCardDebt: '',
    autoLoans: '',
    studentLoans: '',
    otherDebts: '',
    
    // D.I.M.E Analysis - Income
    annualIncome: '',
    yearsToReplaceIncome: '10',
    spouseAnnualIncome: '',
    spouseYearsToReplace: '10',
    
    // D.I.M.E Analysis - Mortgage
    mortgagePayoffDesired: 'yes',
    remainingMortgageYears: '',
    
    // D.I.M.E Analysis - Education
    numberOfChildren: '',
    childrenAges: '',
    educationGoalPerChild: '100000',
    
    // Existing Coverage
    existingLifeInsurance: '',
    existingSpouseInsurance: '',
    
    // Final Expenses
    finalExpenseGoal: '15000'
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

  const calculateDIMEAnalysis = () => {
    if (!formData.clientName || !formData.age || !formData.annualIncome) {
      toast.error('Please fill in the required fields (Name, Age, Annual Income)')
      return
    }

    setIsCalculating(true)
    
    setTimeout(() => {
      // D.I.M.E Calculations
      const debt = calculateDebtNeeds()
      const income = calculateIncomeNeeds()
      const mortgage = calculateMortgageNeeds()
      const education = calculateEducationNeeds()
      
      // Personal Needs
      const personalNeeds = {
        debtCoverage: debt.personal,
        incomeReplacement: income.personal,
        mortgagePayoff: mortgage.personal,
        finalExpenses: parseFloat(formData.finalExpenseGoal) || 15000,
        total: debt.personal + income.personal + mortgage.personal + (parseFloat(formData.finalExpenseGoal) || 15000)
      }

      // Spouse Needs (if married)
      const spouseNeeds = formData.maritalStatus === 'married' ? {
        incomeReplacement: income.spouse,
        finalExpenses: parseFloat(formData.finalExpenseGoal) || 15000,
        total: income.spouse + (parseFloat(formData.finalExpenseGoal) || 15000)
      } : null

      // Children's Needs
      const childrenNeeds = {
        educationFunding: education.total,
        total: education.total
      }

      // Total Family Needs
      const totalFamilyNeeds = personalNeeds.total + (spouseNeeds?.total || 0) + childrenNeeds.total

      // Existing Coverage
      const existingPersonal = parseFloat(formData.existingLifeInsurance) || 0
      const existingSpouse = parseFloat(formData.existingSpouseInsurance) || 0
      const totalExisting = existingPersonal + existingSpouse

      // Coverage Gaps
      const personalGap = Math.max(0, personalNeeds.total - existingPersonal)
      const spouseGap = spouseNeeds ? Math.max(0, spouseNeeds.total - existingSpouse) : 0
      const childrenGap = childrenNeeds.total // Usually no existing coverage for education
      const totalGap = Math.max(0, totalFamilyNeeds - totalExisting)

      const analysisResults = {
        dimeBreakdown: { debt, income, mortgage, education },
        personalNeeds,
        spouseNeeds,
        childrenNeeds,
        totalFamilyNeeds,
        existingCoverage: {
          personal: existingPersonal,
          spouse: existingSpouse,
          total: totalExisting
        },
        coverageGaps: {
          personal: personalGap,
          spouse: spouseGap,
          children: childrenGap,
          total: totalGap
        },
        recommendations: generateDIMERecommendations(personalGap, spouseGap, childrenGap, formData)
      }

      setResults(analysisResults)
      setIsCalculating(false)
      
      toast.success('D.I.M.E Analysis completed successfully!')
    }, 2000)
  }

  const calculateDebtNeeds = () => {
    const mortgage = parseFloat(formData.mortgageBalance) || 0
    const creditCard = parseFloat(formData.creditCardDebt) || 0
    const auto = parseFloat(formData.autoLoans) || 0
    const student = parseFloat(formData.studentLoans) || 0
    const other = parseFloat(formData.otherDebts) || 0
    
    return {
      personal: mortgage + creditCard + auto + student + other,
      breakdown: { mortgage, creditCard, auto, student, other }
    }
  }

  const calculateIncomeNeeds = () => {
    const personalIncome = parseFloat(formData.annualIncome) || 0
    const personalYears = parseFloat(formData.yearsToReplaceIncome) || 10
    const spouseIncome = parseFloat(formData.spouseAnnualIncome) || 0
    const spouseYears = parseFloat(formData.spouseYearsToReplace) || 10

    return {
      personal: personalIncome * personalYears,
      spouse: formData.maritalStatus === 'married' ? spouseIncome * spouseYears : 0
    }
  }

  const calculateMortgageNeeds = () => {
    if (formData.mortgagePayoffDesired === 'no') return { personal: 0 }
    
    // This would typically use remaining balance, but for simplicity using mortgage balance
    const mortgageBalance = parseFloat(formData.mortgageBalance) || 0
    return { personal: mortgageBalance }
  }

  const calculateEducationNeeds = () => {
    const children = parseInt(formData.numberOfChildren) || 0
    const costPerChild = parseFloat(formData.educationGoalPerChild) || 100000
    
    return {
      total: children * costPerChild,
      perChild: costPerChild,
      numberOfChildren: children
    }
  }

  const generateDIMERecommendations = (personalGap, spouseGap, childrenGap, data) => {
    const recommendations = []
    
    if (personalGap > 0) {
      recommendations.push({
        type: 'personal',
        title: 'Personal Life Insurance Coverage',
        description: `Consider a ${personalGap > 500000 ? 'term life insurance policy' : 'whole life or universal life policy'} to cover your personal protection needs.`,
        priority: 'high',
        amount: personalGap
      })
    }
    
    if (spouseGap > 0) {
      recommendations.push({
        type: 'spouse',
        title: 'Spouse Life Insurance Coverage',
        description: 'Protect your spouse\'s income contribution with appropriate life insurance coverage.',
        priority: 'high',
        amount: spouseGap
      })
    }
    
    if (childrenGap > 0) {
      recommendations.push({
        type: 'education',
        title: 'Children\'s Education Funding',
        description: 'Consider Index Universal Life (IUL) or Whole Life insurance policies for tax-advantaged education funding with life insurance benefits.',
        priority: 'medium',
        amount: childrenGap
      })
    }
    
    if (parseInt(data.numberOfChildren) > 0 && childrenGap > 0) {
      recommendations.push({
        type: 'strategy',
        title: 'Education Funding Strategy',
        description: 'IUL and Whole Life policies offer tax-free growth potential and flexible access to funds for education expenses.',
        priority: 'medium'
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
      occupation: '',
      healthStatus: 'excellent',
      mortgageBalance: '',
      creditCardDebt: '',
      autoLoans: '',
      studentLoans: '',
      otherDebts: '',
      annualIncome: '',
      yearsToReplaceIncome: '10',
      spouseAnnualIncome: '',
      spouseYearsToReplace: '10',
      mortgagePayoffDesired: 'yes',
      remainingMortgageYears: '',
      numberOfChildren: '',
      childrenAges: '',
      educationGoalPerChild: '100000',
      existingLifeInsurance: '',
      existingSpouseInsurance: '',
      finalExpenseGoal: '15000'
    })
    setResults(null)
    toast.success('Form reset successfully')
  }

  const exportToPDF = async () => {
    if (!results) return
    
    const reportContent = `
D.I.M.E LIFE INSURANCE NEEDS ANALYSIS REPORT
============================================

Client: ${formData.clientName}
Age: ${formData.age}
Date: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
Total Family Insurance Needs: $${results.totalFamilyNeeds.toLocaleString()}
Total Existing Coverage: $${results.existingCoverage.total.toLocaleString()}
Total Coverage Gap: $${results.coverageGaps.total.toLocaleString()}

D.I.M.E ANALYSIS BREAKDOWN
==========================

DEBT ELIMINATION NEEDS
- Mortgage Balance: $${results.dimeBreakdown.debt.breakdown.mortgage.toLocaleString()}
- Credit Card Debt: $${results.dimeBreakdown.debt.breakdown.creditCard.toLocaleString()}
- Auto Loans: $${results.dimeBreakdown.debt.breakdown.auto.toLocaleString()}
- Student Loans: $${results.dimeBreakdown.debt.breakdown.student.toLocaleString()}
- Other Debts: $${results.dimeBreakdown.debt.breakdown.other.toLocaleString()}
Total Debt Coverage Needed: $${results.dimeBreakdown.debt.personal.toLocaleString()}

INCOME REPLACEMENT NEEDS
- Personal Income Replacement: $${results.dimeBreakdown.income.personal.toLocaleString()}
${formData.maritalStatus === 'married' ? `- Spouse Income Replacement: $${results.dimeBreakdown.income.spouse.toLocaleString()}` : ''}

MORTGAGE PROTECTION
- Mortgage Payoff Goal: ${formData.mortgagePayoffDesired === 'yes' ? 'Yes' : 'No'}
- Coverage Amount: $${results.dimeBreakdown.mortgage.personal.toLocaleString()}

EDUCATION FUNDING
- Number of Children: ${formData.numberOfChildren || 0}
- Education Goal per Child: $${formData.educationGoalPerChild}
- Total Education Funding Needed: $${results.dimeBreakdown.education.total.toLocaleString()}

FAMILY NEEDS SUMMARY
===================

YOUR PERSONAL NEEDS:
- Debt Coverage: $${results.personalNeeds.debtCoverage.toLocaleString()}
- Income Replacement: $${results.personalNeeds.incomeReplacement.toLocaleString()}
- Mortgage Payoff: $${results.personalNeeds.mortgagePayoff.toLocaleString()}
- Final Expenses: $${results.personalNeeds.finalExpenses.toLocaleString()}
- TOTAL PERSONAL NEEDS: $${results.personalNeeds.total.toLocaleString()}
- Personal Coverage Gap: $${results.coverageGaps.personal.toLocaleString()}

${results.spouseNeeds ? `
YOUR SPOUSE'S NEEDS:
- Income Replacement: $${results.spouseNeeds.incomeReplacement.toLocaleString()}
- Final Expenses: $${results.spouseNeeds.finalExpenses.toLocaleString()}
- TOTAL SPOUSE NEEDS: $${results.spouseNeeds.total.toLocaleString()}
- Spouse Coverage Gap: $${results.coverageGaps.spouse.toLocaleString()}
` : ''}

YOUR CHILDREN'S NEEDS:
- Education Funding (IUL/Whole Life): $${results.childrenNeeds.educationFunding.toLocaleString()}
- TOTAL CHILDREN'S NEEDS: $${results.childrenNeeds.total.toLocaleString()}

PROFESSIONAL RECOMMENDATIONS
============================
${results.recommendations.map(rec => `
${rec.title}:
${rec.description}
${rec.amount ? `Recommended Coverage: $${rec.amount.toLocaleString()}` : ''}
Priority: ${rec.priority.toUpperCase()}
`).join('\n')}

NEXT STEPS - TAKE ACTION NOW!
============================

Your D.I.M.E analysis reveals important protection gaps that need immediate attention. 
Don't leave your family's financial future to chance.

🔥 URGENT: Schedule Your FREE Financial Strategy Call Today!

During this personalized consultation, we will:
✓ Review your complete D.I.M.E analysis in detail
✓ Explore IUL and Whole Life options for education funding
✓ Design a customized insurance portfolio for your family
✓ Show you tax-advantaged strategies to maximize your coverage
✓ Provide specific product recommendations and pricing

📞 CALL NOW: [Your Phone Number]
📅 BOOK ONLINE: [Your Scheduling Link]
📧 EMAIL: [Your Email]

Time is critical - every day without proper coverage puts your family at risk.
Let's secure your family's financial future together!

Generated by LifeGuard Pro D.I.M.E Analysis System
Report Date: ${new Date().toLocaleDateString()}
    `.trim()

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.clientName.replace(/\s+/g, '_')}_DIME_Analysis_Report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('D.I.M.E Analysis Report exported successfully!')
    
    // Save to database if user is logged in
    if (user && results) {
      try {
        await createAnalysis({
          title: `D.I.M.E Analysis - ${formData.clientName}`,
          client_name: formData.clientName,
          annual_income: parseFloat(formData.annualIncome) || 0,
          current_savings: 0,
          monthly_expenses: 0,
          current_life_insurance: parseFloat(formData.existingLifeInsurance) || 0,
          spouse_income: parseFloat(formData.spouseAnnualIncome) || 0,
          number_of_dependents: parseInt(formData.numberOfChildren) || 0,
          coverage_gap: results.coverageGaps.total,
          recommended_coverage: results.totalFamilyNeeds,
          metadata: {
            dime_analysis: true,
            form_data: formData,
            results: results
          }
        })
      } catch (error) {
        console.error('Failed to save analysis:', error)
      }
    }
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
                D.I.M.E Life Insurance Needs Analysis
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                Industry-standard Debt, Income, Mortgage, Education analysis framework
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
                Export D.I.M.E Report
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* D.I.M.E Analysis Form */}
        <div className="xl:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Client Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter client's full name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Age"
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
                    className="input-field w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Health Status
                  </label>
                  <select
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
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
                  className="input-field w-full"
                  placeholder="Enter occupation"
                />
              </div>
            </div>
          </div>

          {/* D - Debt Elimination */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              D - Debt Elimination
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Mortgage Balance
                </label>
                <input
                  type="number"
                  name="mortgageBalance"
                  value={formData.mortgageBalance}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter mortgage balance"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Credit Card Debt
                  </label>
                  <input
                    type="number"
                    name="creditCardDebt"
                    value={formData.creditCardDebt}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Credit cards"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Auto Loans
                  </label>
                  <input
                    type="number"
                    name="autoLoans"
                    value={formData.autoLoans}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Auto loans"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Student Loans
                  </label>
                  <input
                    type="number"
                    name="studentLoans"
                    value={formData.studentLoans}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Student loans"
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
                    className="input-field w-full"
                    placeholder="Other debts"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* I - Income Replacement */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              I - Income Replacement
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Your Annual Income *
                  </label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Annual income"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Years to Replace
                  </label>
                  <select
                    name="yearsToReplaceIncome"
                    value={formData.yearsToReplaceIncome}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="5">5 years</option>
                    <option value="10">10 years</option>
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="25">25 years</option>
                  </select>
                </div>
              </div>
              
              {formData.maritalStatus === 'married' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Spouse Annual Income
                    </label>
                    <input
                      type="number"
                      name="spouseAnnualIncome"
                      value={formData.spouseAnnualIncome}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Spouse income"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Years to Replace
                    </label>
                    <select
                      name="spouseYearsToReplace"
                      value={formData.spouseYearsToReplace}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="5">5 years</option>
                      <option value="10">10 years</option>
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="25">25 years</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* M - Mortgage Protection */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
              M - Mortgage Protection
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Do you want to pay off mortgage upon death?
                </label>
                <select
                  name="mortgagePayoffDesired"
                  value={formData.mortgagePayoffDesired}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="yes">Yes - Pay off mortgage</option>
                  <option value="no">No - Keep mortgage payments</option>
                </select>
              </div>
              
              {formData.mortgagePayoffDesired === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Remaining Mortgage Years
                  </label>
                  <input
                    type="number"
                    name="remainingMortgageYears"
                    value={formData.remainingMortgageYears}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Years remaining on mortgage"
                  />
                </div>
              )}
            </div>
          </div>

          {/* E - Education Funding */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              E - Education Funding (IUL/Whole Life)
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Number of children"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Education Goal per Child
                  </label>
                  <select
                    name="educationGoalPerChild"
                    value={formData.educationGoalPerChild}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="50000">$50,000</option>
                    <option value="75000">$75,000</option>
                    <option value="100000">$100,000</option>
                    <option value="150000">$150,000</option>
                    <option value="200000">$200,000</option>
                  </select>
                </div>
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
                  className="input-field w-full"
                  placeholder="e.g., 5, 8, 12"
                />
              </div>
            </div>
          </div>

          {/* Existing Coverage */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Existing Coverage & Final Expenses
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Your Existing Life Insurance
                </label>
                <input
                  type="number"
                  name="existingLifeInsurance"
                  value={formData.existingLifeInsurance}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Current life insurance coverage"
                />
              </div>
              
              {formData.maritalStatus === 'married' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Spouse's Existing Life Insurance
                  </label>
                  <input
                    type="number"
                    name="existingSpouseInsurance"
                    value={formData.existingSpouseInsurance}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Spouse's current coverage"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Final Expense Goal
                </label>
                <select
                  name="finalExpenseGoal"
                  value={formData.finalExpenseGoal}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="10000">$10,000</option>
                  <option value="15000">$15,000</option>
                  <option value="20000">$20,000</option>
                  <option value="25000">$25,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <button
              onClick={calculateDIMEAnalysis}
              disabled={isCalculating}
              className="w-full btn-primary flex items-center justify-center text-lg py-4"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Calculating D.I.M.E Analysis...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-3" />
                  Calculate D.I.M.E Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-3 space-y-6">
          {results ? (
            <>
              {/* Family Needs Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Needs */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                  <div className="text-center">
                    <User className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Your Needs</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${results.personalNeeds.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      Coverage Gap: ${results.coverageGaps.personal.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Spouse Needs */}
                {results.spouseNeeds && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Spouse's Needs</h3>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${results.spouseNeeds.total.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        Coverage Gap: ${results.coverageGaps.spouse.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Children's Needs */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                  <div className="text-center">
                    <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Children's Needs</h3>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      ${results.childrenNeeds.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      Education Funding (IUL/Whole Life)
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Family Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Total Family Protection Needs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Needs</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${results.totalFamilyNeeds.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Existing Coverage</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${results.existingCoverage.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Coverage Gap</p>
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        ${results.coverageGaps.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* D.I.M.E Breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  D.I.M.E Analysis Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-slate-300">Debt Elimination</span>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        ${results.dimeBreakdown.debt.personal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-slate-300">Income Replacement</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${results.dimeBreakdown.income.personal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-slate-300">Mortgage Protection</span>
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        ${results.dimeBreakdown.mortgage.personal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-slate-300">Education Funding</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        ${results.dimeBreakdown.education.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Recommendations */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  Professional Recommendations
                </h3>
                
                <div className="space-y-4">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' 
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    }`}>
                      <div className="flex items-start">
                        {rec.priority === 'high' ? (
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                        ) : (
                          <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-2 ${
                            rec.priority === 'high' 
                              ? 'text-red-800 dark:text-red-300' 
                              : 'text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {rec.title}
                          </h4>
                          <p className={`text-sm mb-2 ${
                            rec.priority === 'high' 
                              ? 'text-red-700 dark:text-red-400' 
                              : 'text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {rec.description}
                          </p>
                          {rec.amount && (
                            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                              Recommended Coverage: ${rec.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Ready to Secure Your Family's Future?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Your D.I.M.E analysis reveals important protection gaps. Let's create a customized strategy with IUL and Whole Life solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Schedule Strategy Call
                    </button>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center justify-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-12">
              <div className="text-center">
                <Calculator className="h-16 w-16 text-gray-400 dark:text-slate-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Ready for D.I.M.E Analysis
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-lg max-w-md mx-auto">
                  Complete the D.I.M.E analysis form to see your family's comprehensive insurance needs breakdown with personalized recommendations.
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
