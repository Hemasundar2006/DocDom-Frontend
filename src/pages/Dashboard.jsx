import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  GraduationCap, 
  Upload, 
  LogOut, 
  Filter, 
  X,
  Menu,
  FileText,
  User
} from 'lucide-react'
import SearchBar from '../components/SearchBar'
import Select from '../components/Select'
import Button from '../components/Button'
import FileCard from '../components/FileCard'
import FileUploadModal from '../components/FileUploadModal'
import { filesAPI, authAPI } from '../services/api'

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    semester: '',
    course: '',
    myUploads: false
  })

  // Mock data
  const semesters = [
    { value: '', label: 'All Semesters' },
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
    { value: '', label: 'All Courses' },
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


  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchFiles()
  }, [filters])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      console.log('Fetching files with filters:', filters)
      const data = await filesAPI.getAll(filters)
      console.log('Files API response:', data)
      setFiles(data.data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file) => {
    try {
      console.log('Downloading file:', file.fileName)
      
      const blob = await filesAPI.download(file._id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    setIsAuthenticated(false)
    navigate('/login')
  }

  const handleFilterChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value })
  }

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value })
  }

  const toggleMyUploads = () => {
    setFilters({ ...filters, myUploads: !filters.myUploads })
  }

  const clearFilters = () => {
    setFilters({ search: '', semester: '', course: '', myUploads: false })
  }

  const hasActiveFilters = filters.search || filters.semester || filters.course || filters.myUploads

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-dark-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-dark-border">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-100">DocDom</h1>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-100 font-medium truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {user?.email || 'student@university.edu'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-3">
                Quick Filters
              </h3>
              
              {semesters.slice(1).map((semester) => (
                <button
                  key={semester.value}
                  onClick={() => setFilters({ ...filters, semester: semester.value })}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filters.semester === semester.value
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-dark-hover'
                  }`}
                >
                  {semester.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Upload Button */}
          <div className="p-4 border-t border-dark-border">
            <Button
              onClick={() => setUploadModalOpen(true)}
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Upload File
            </Button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-dark-border">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-dark-card border-b border-dark-border p-4 lg:p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-300 hover:text-gray-100"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">
                Document Library
              </h2>
              <p className="text-gray-400 text-sm">
                Browse and download shared documents
              </p>
            </div>

            <Button
              onClick={() => setUploadModalOpen(true)}
              variant="primary"
              className="hidden lg:flex items-center gap-2"
            >
              <Upload size={20} />
              Upload
            </Button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-dark-card border-b border-dark-border p-4 lg:p-6">
          <div className="max-w-7xl">
            <div className="mb-4">
              <SearchBar
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search by file name or content..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={filters.semester}
                onChange={handleFilterChange('semester')}
                options={semesters}
                placeholder="Filter by semester"
              />

              <Select
                value={filters.course}
                onChange={handleFilterChange('course')}
                options={courses}
                placeholder="Filter by course"
              />

              <div className="flex gap-2">
                <Button
                  onClick={toggleMyUploads}
                  variant={filters.myUploads ? 'primary' : 'secondary'}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  My Uploads
                </Button>

                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <X size={18} />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-400">Loading files...</p>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="mx-auto text-gray-600 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No files available
                </h3>
                <p className="text-gray-400 mb-6">
                  {hasActiveFilters
                    ? 'Try adjusting your filters'
                    : 'No documents have been uploaded yet.'}
                </p>
                {!hasActiveFilters && (
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    variant="primary"
                  >
                    Upload First Document
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl">
              {files.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={() => {
          // Add a small delay to ensure the backend has processed the file
          setTimeout(() => {
            fetchFiles()
          }, 1000)
        }}
      />
    </div>
  )
}

