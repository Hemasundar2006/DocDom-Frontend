import { useState, useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import Modal from './Modal'
import Input from './Input'
import Select from './Select'
import Button from './Button'
import { validateFile, formatFileSize } from '../utils/validation'
import { filesAPI } from '../services/api'

export default function FileUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    fileName: '',
    semester: '',
    course: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  // Mock data - replace with API call
  const semesters = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' },
  ]

  const courses = [
    { value: 'cse', label: 'Computer Science and Engineering (CSE)' },
    { value: 'cse-ds', label: 'CSE (Data Science)' },
    { value: 'cse-bs', label: 'CSE and Business Systems' },
    { value: 'cse-aiml', label: 'CSE (Artificial Intelligence and Machine Learning)' },
    { value: 'cse-iot', label: 'CSE (Internet of Things & Cyber Security Including Blockchain Technology)' },
    { value: 'csit', label: 'Computer Science and Information Technology (CSIT)' },
    { value: 'ai', label: 'Artificial Intelligence (AI)' },
    { value: 'ai-ds', label: 'Artificial Intelligence and Data Science (AI & DS)' },
    { value: 'it', label: 'Information Technology (IT)' },
    { value: 'ece', label: 'Electronics and Communication Engineering (ECE)' },
    { value: 'vlsi', label: 'Electronics Engineering (VLSI Design and Technology)' },
    { value: 'eee', label: 'Electrical and Electronics Engineering (EEE)' },
    { value: 'ce', label: 'Civil Engineering (CE)' },
    { value: 'me', label: 'Mechanical Engineering (ME)' },
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file) => {
    const error = validateFile(file)
    if (error) {
      setErrors({ ...errors, file: error })
      return
    }

    setSelectedFile(file)
    if (!formData.fileName) {
      setFormData({ ...formData, fileName: file.name.replace(/\.[^/.]+$/, '') })
    }
    setErrors({ ...errors, file: null })
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload'
    }

    if (!formData.fileName.trim()) {
      newErrors.fileName = 'File name is required'
    }

    if (!formData.semester) {
      newErrors.semester = 'Please select a semester'
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setUploadProgress(0)

    try {
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('fileName', formData.fileName)
      uploadData.append('semester', formData.semester)
      uploadData.append('course', formData.course)
      uploadData.append('description', formData.description)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await filesAPI.upload(uploadData)
      console.log('Upload response:', response)
      
      setUploadProgress(100)
      clearInterval(progressInterval)

      // Reset form
      setSelectedFile(null)
      setFormData({ fileName: '', semester: '', course: '', description: '' })
      setErrors({})
      
      // Call the success callback to refresh the files list
      onUploadSuccess()
      setTimeout(() => {
        onClose()
        setUploadProgress(0)
      }, 500)
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Upload failed. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document" size="md">
      <form onSubmit={handleSubmit}>
        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/10'
              : errors.file
              ? 'border-red-500 bg-red-500/5'
              : 'border-dark-border'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" size={24} />
                <div className="text-left">
                  <p className="text-gray-100 font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-300 mb-2">
                Drag and drop your file here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  browse
                </button>
              </p>
              <p className="text-gray-500 text-sm">
                Supported formats: PDF, DOCX, JPG, PNG, GIF, WEBP (Max 50MB)
              </p>
            </>
          )}
        </div>

        {errors.file && (
          <p className="mt-2 text-sm text-red-400">{errors.file}</p>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="mt-6">
          <Input
            label="File Name"
            type="text"
            placeholder="e.g., Linear Algebra Notes"
            value={formData.fileName}
            onChange={handleChange('fileName')}
            error={errors.fileName}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Semester"
              value={formData.semester}
              onChange={handleChange('semester')}
              options={semesters}
              placeholder="Select semester"
              error={errors.semester}
              required
            />

            <Select
              label="Course/Subject"
              value={formData.course}
              onChange={handleChange('course')}
              options={courses}
              placeholder="Select course"
              error={errors.course}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Add notes or description about this document..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Upload
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

