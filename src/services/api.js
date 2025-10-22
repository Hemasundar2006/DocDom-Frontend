import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }
}

// Colleges API
export const collegesAPI = {
  getAll: async () => {
    const response = await api.get('/colleges')
    return response.data
  },
  
  search: async (query) => {
    const response = await api.get(`/colleges/search?q=${query}`)
    return response.data
  }
}

// Files API
export const filesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.semester) params.append('semester', filters.semester)
    if (filters.course) params.append('course', filters.course)
    if (filters.search) params.append('search', filters.search)
    if (filters.myUploads) params.append('myUploads', 'true')
    
    const response = await api.get(`/files?${params.toString()}`)
    return response.data
  },
  
  upload: async (formData) => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  
  download: async (fileId) => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob'
    })
    return response.data
  },
  
  delete: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`)
    return response.data
  }
}

// Courses API
export const coursesAPI = {
  getAll: async () => {
    const response = await api.get('/courses')
    return response.data
  },
  
  getBySemester: async (semester) => {
    const response = await api.get(`/courses?semester=${semester}`)
    return response.data
  }
}

export default api

