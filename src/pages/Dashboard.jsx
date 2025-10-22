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

  // Sample files data with engineering courses
  const mockFiles = [
    {
      id: '1',
      fileName: 'Data Structures and Algorithms Notes',
      uploader: 'Alex Kumar',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 2457600,
      fileType: 'application/pdf',
      semester: 'Semester 3',
      course: 'Computer Science and Engineering (CSE)',
      description: 'Comprehensive notes covering arrays, linked lists, trees, and graph algorithms'
    },
    {
      id: '2',
      fileName: 'Machine Learning Fundamentals',
      uploader: 'Priya Sharma',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 3145728,
      fileType: 'application/pdf',
      semester: 'Semester 6',
      course: 'CSE (Artificial Intelligence and Machine Learning)',
      description: 'Introduction to supervised and unsupervised learning algorithms'
    },
    {
      id: '3',
      fileName: 'Database Management Systems Lab',
      uploader: 'Rahul Singh',
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 1048576,
      fileType: 'application/pdf',
      semester: 'Semester 4',
      course: 'Computer Science and Engineering (CSE)',
      description: 'SQL queries, normalization, and database design principles'
    },
    {
      id: '4',
      fileName: 'Digital Signal Processing',
      uploader: 'Anita Patel',
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 5242880,
      fileType: 'application/pdf',
      semester: 'Semester 5',
      course: 'Electronics and Communication Engineering (ECE)',
      description: 'Signal analysis, filtering, and Fourier transforms'
    },
    {
      id: '5',
      fileName: 'Software Engineering Project Report',
      uploader: 'Vikram Reddy',
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 524288,
      fileType: 'application/pdf',
      semester: 'Semester 7',
      course: 'Computer Science and Engineering (CSE)',
      description: 'Complete project documentation with UML diagrams and code'
    },
    {
      id: '6',
      fileName: 'Computer Networks Assignment',
      uploader: 'Sneha Gupta',
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 1572864,
      fileType: 'application/pdf',
      semester: 'Semester 5',
      course: 'Computer Science and Engineering (CSE)',
      description: 'OSI model, TCP/IP protocols, and network security'
    },
    {
      id: '7',
      fileName: 'Artificial Intelligence Lab Manual',
      uploader: 'Rajesh Kumar',
      uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 2097152,
      fileType: 'application/pdf',
      semester: 'Semester 6',
      course: 'Artificial Intelligence (AI)',
      description: 'Python implementations of AI algorithms and neural networks'
    },
    {
      id: '8',
      fileName: 'Microprocessor and Microcontroller',
      uploader: 'Deepika Singh',
      uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 3145728,
      fileType: 'application/pdf',
      semester: 'Semester 4',
      course: 'Electronics and Communication Engineering (ECE)',
      description: '8086 architecture, assembly programming, and interfacing'
    },
    {
      id: '9',
      fileName: 'Data Science Project',
      uploader: 'Arjun Mehta',
      uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 4194304,
      fileType: 'application/pdf',
      semester: 'Semester 7',
      course: 'CSE (Data Science)',
      description: 'Complete data analysis project with Python and R implementations'
    },
    {
      id: '10',
      fileName: 'Information Security Notes',
      uploader: 'Kavya Nair',
      uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      fileSize: 2621440,
      fileType: 'application/pdf',
      semester: 'Semester 6',
      course: 'CSE (Internet of Things & Cyber Security Including Blockchain Technology)',
      description: 'Cryptography, network security, and blockchain fundamentals'
    }
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter mock data
      let filteredFiles = [...mockFiles]
      
      if (filters.search) {
        filteredFiles = filteredFiles.filter(file =>
          file.fileName.toLowerCase().includes(filters.search.toLowerCase()) ||
          file.description?.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      
      if (filters.semester) {
        filteredFiles = filteredFiles.filter(file =>
          file.semester === `Semester ${filters.semester}`
        )
      }
      
      if (filters.course) {
        filteredFiles = filteredFiles.filter(file =>
          file.course.toLowerCase() === courses.find(c => c.value === filters.course)?.label.toLowerCase()
        )
      }
      
      setFiles(filteredFiles)
      
      // Uncomment when backend is ready
      // const data = await filesAPI.getAll(filters)
      // setFiles(data)
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file) => {
    try {
      console.log('Downloading file:', file.fileName)
      
      // For demo purposes, create a sample PDF blob
      const sampleContent = `Sample PDF Content for ${file.fileName}
      
Course: ${file.course}
Semester: ${file.semester}
Uploaded by: ${file.uploader}
Description: ${file.description || 'No description provided'}

This is a demo file to demonstrate the download functionality.
In a real application, this would be the actual file content.`
      
      const blob = new Blob([sampleContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.fileName}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Uncomment when backend is ready
      // const blob = await filesAPI.download(file.id)
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = file.fileName
      // document.body.appendChild(a)
      // a.click()
      // window.URL.revokeObjectURL(url)
      // document.body.removeChild(a)
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
                  No files found
                </h3>
                <p className="text-gray-400 mb-6">
                  {hasActiveFilters
                    ? 'Try adjusting your filters'
                    : 'Be the first to upload a document!'}
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
                  key={file.id}
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
        onUploadSuccess={fetchFiles}
      />
    </div>
  )
}

