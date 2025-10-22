import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import { validateCollegeEmail } from '../utils/validation'
import { authAPI } from '../services/api'

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'College email is required'
    } else if (!validateCollegeEmail(formData.email)) {
      newErrors.email = 'Please enter a valid college email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Demo credentials - bypass API for demo
      if (formData.email === 'demo@university.edu' && formData.password === 'demo123') {
        const demoUser = {
          id: 'demo-user-1',
          name: 'Demo Student',
          email: 'demo@university.edu',
          college: 'Demo University'
        }
        
        localStorage.setItem('authToken', 'demo-token-123')
        localStorage.setItem('user', JSON.stringify(demoUser))
        
        setIsAuthenticated(true)
        navigate('/dashboard')
        return
      }

      // Real API call for other credentials
      const response = await authAPI.login(formData)
      
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Invalid email or password' 
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
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your documents
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-blue-300 font-semibold mb-2">Demo Credentials</h3>
          <div className="text-sm text-blue-200 space-y-1">
            <p><strong>Email:</strong> demo@university.edu</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData({
                email: 'demo@university.edu',
                password: 'demo123'
              })
            }}
            className="mt-3 text-blue-300 hover:text-blue-200 text-sm underline"
          >
            Fill Demo Credentials
          </button>
        </div>

        {/* Form */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
            />

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="mb-6 text-right">
              <a href="#" className="text-sm text-primary hover:text-primary-light transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-light transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

