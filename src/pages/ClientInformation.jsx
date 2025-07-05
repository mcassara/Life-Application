import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  Heart,
  TrendingUp,
  Shield,
  PieChart,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const ClientInformation = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Financial Information
    annualIncome: '',
    monthlyExpenses: '',
    existingDebts: '',
    savingsGoal: '',
    
    // Family Information
    maritalStatus: '',
    numberOfChildren: '',
    dependents: '',
    
    // Insurance Information
    currentLifeInsurance: '',
    currentHealthInsurance: '',
    employerBenefits: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process form data
    console.log('Form submitted:', formData)
    navigate('/needs-analysis')
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length
    return Math.round((filledFields / totalFields) * 100)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                >
                  <option value="" className="text-gray-400">Select state</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <DollarSign className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Financial Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income *
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="75000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses *
                </label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="4500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Debts
                </label>
                <input
                  type="number"
                  name="existingDebts"
                  value={formData.existingDebts}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="25000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savings Goal
                </label>
                <input
                  type="number"
                  name="savingsGoal"
                  value={formData.savingsGoal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="100000"
                />
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Family Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status *
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                >
                  <option value="" className="text-gray-400">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Children
                </label>
                <input
                  type="number"
                  name="numberOfChildren"
                  value={formData.numberOfChildren}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Dependents
                </label>
                <textarea
                  name="dependents"
                  value={formData.dependents}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="List any other dependents (parents, siblings, etc.)"
                />
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Current Insurance</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Life Insurance Coverage
                </label>
                <input
                  type="number"
                  name="currentLifeInsurance"
                  value={formData.currentLifeInsurance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="250000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Health Insurance
                </label>
                <input
                  type="text"
                  name="currentHealthInsurance"
                  value={formData.currentHealthInsurance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Provider name and plan type"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Benefits
                </label>
                <textarea
                  name="employerBenefits"
                  value={formData.employerBenefits}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Describe any employer-provided insurance benefits"
                />
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Client Information
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please provide your information to help us create a personalized insurance analysis
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {getCompletionPercentage()}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {currentStep === totalSteps ? (
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  Complete Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sidebar - Only visible on xl screens and larger */}
        <div className="hidden xl:block space-y-6">
          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Provide accurate income information for better recommendations
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Include all dependents in your family information
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Review existing coverage details carefully
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientInformation
