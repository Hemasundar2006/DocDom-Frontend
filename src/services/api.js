import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://docdom-backend.onrender.com/api'
// Export API origin to build absolute URLs for file downloads when backend returns relative paths
export const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin
  } catch (_e) {
    return ''
  }
})()

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 600000, // 10 minutes timeout for large file uploads
  maxContentLength: 50 * 1024 * 1024, // 50MB max content length
  maxBodyLength: 50 * 1024 * 1024, // 50MB max body length
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
    const response = await api.post('/register', userData)
    return response.data
  },
  
  login: async (credentials) => {
    const response = await api.post('/login', credentials)
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/user/me')
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
  
  upload: async (formData, onProgress) => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 600000, // 10 minutes timeout for large file uploads
      maxContentLength: 50 * 1024 * 1024, // 50MB max content length
      maxBodyLength: 50 * 1024 * 1024, // 50MB max body length
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent)
        }
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Upload Progress: ${percentCompleted}%`)
      }
    })
    return response.data
  },
  
  getById: async (fileId) => {
    const response = await api.get(`/files/${fileId}`)
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

