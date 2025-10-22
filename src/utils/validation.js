// Email validation for college domains
export const validateCollegeEmail = (email) => {
  const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in|edu\.in)$/
  return collegeEmailRegex.test(email)
}

// Password validation (min 8 chars, at least one letter and one number)
export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return 'Password must contain at least one letter and one number'
  }
  return null
}

// Name validation
export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long'
  }
  return null
}

// File validation
export const validateFile = (file, maxSize = 50 * 1024 * 1024) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ]

  if (!file) {
    return 'Please select a file'
  }

  if (!allowedTypes.includes(file.type)) {
    return 'File type not allowed. Please upload PDF, DOCX, or image files'
  }

  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`
  }

  return null
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

