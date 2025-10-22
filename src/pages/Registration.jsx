import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import { validateCollegeEmail, validatePassword, validateName } from '../utils/validation'
import { authAPI, collegesAPI } from '../services/api'

export default function Registration({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [colleges, setColleges] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchColleges = async () => {
    try {
      // Mock data for colleges - replace with actual API call
      const mockColleges = [
        { value: '1', label: 'Qis College Of Engineering And Technology' },
        { value: '2', label: 'Gayatri Vidya Parishad College for Degree & P.G. Courses' },
        
        
      ]
      setColleges(mockColleges)
      
      // Uncomment when backend is ready
      // const data = await collegesAPI.getAll()
      // setColleges(data.map(c => ({ value: c.id, label: c.name })))
    } catch (error) {
      console.error('Error fetching colleges:', error)
    }
  }

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    const nameError = validateName(formData.name)
    if (nameError) newErrors.name = nameError

    // Email validation
    if (!formData.email) {
      newErrors.email = 'College email is required'
    } else if (!validateCollegeEmail(formData.email)) {
      newErrors.email = 'Please enter a valid college email (e.g., .edu, .ac.in)'
    }

    // Password validation
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    // College validation
    if (!formData.collegeId) {
      newErrors.collegeId = 'Please select your college'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authAPI.register(formData)
      
      // Store token and user data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Registration failed. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <GraduationCap size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Join DocDom
          </h1>
          <p className="text-gray-400">
            Create an account to start sharing and accessing documents
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-green-300 font-semibold mb-2">Quick Demo</h3>
          <p className="text-green-200 text-sm mb-3">
            Want to try the app quickly? Use the demo login instead:
          </p>
          <div className="text-sm text-green-200 space-y-1">
            <p><strong>Email:</strong> demo@university.edu</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
          <Link 
            to="/login" 
            className="mt-3 text-green-300 hover:text-green-200 text-sm underline"
          >
            Go to Login →
          </Link>
        </div>

        {/* Form */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              required
            />

            <Input
              label="College Email"
              type="email"
              placeholder="john.doe@university.edu"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
            />

            <Select
              label="College/University"
              value={formData.collegeId}
              onChange={handleChange('collegeId')}
              options={colleges}
              placeholder="Select your college"
              error={errors.collegeId}
              required
            />

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

