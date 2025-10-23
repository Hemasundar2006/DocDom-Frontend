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
import { filesAPI, authAPI, API_ORIGIN, downloadFile } from '../services/api'

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [downloadingFile, setDownloadingFile] = useState(null)
  const [viewingFile, setViewingFile] = useState(null)
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
      const list = data.data || data || []

      // Apply client-side filtering
      let filtered = list

      // Filter by search term (file name and description)
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim()
        filtered = filtered.filter((file) => {
          const fileName = (file.fileName || file.name || '').toLowerCase()
          const description = (file.description || '').toLowerCase()
          return fileName.includes(searchTerm) || description.includes(searchTerm)
        })
      }

      // Apply client-side filter for My Uploads to prevent leakage
      if (filters.myUploads) {
        const stored = localStorage.getItem('user')
        let currentUserId = null
        try {
          const u = stored ? JSON.parse(stored) : null
          currentUserId = u?._id || u?.user?._id || u?.data?._id || null
        } catch (_e) {}

        if (currentUserId) {
          filtered = filtered.filter((f) => {
            // uploader may be an object or an id/string, or there may be uploaderId
            const uploader = f.uploader
            const uploaderId = f.uploaderId || (typeof uploader === 'object' ? uploader?._id : uploader)
            return String(uploaderId || '').trim() === String(currentUserId).trim()
          })
        }
      }

      setFiles(filtered)
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file) => {
    try {
      setDownloadingFile(file._id)
      console.log('Downloading file:', file)

      // Get filename from file object
      let fileName = file.fileName || file.name || 'document'
      if (!fileName.includes('.')) fileName = `${fileName}.pdf`

      // Try the new download endpoint first
      try {
        await downloadFile(file._id, fileName)
        setDownloadingFile(null)
        return
      } catch (downloadError) {
        console.warn('New download endpoint failed, trying fallback approach:', downloadError)
        
        // Fallback to using fileUrl like the view function does
        let fileUrl = file.fileUrl
        console.log('Initial fileUrl for download:', fileUrl)
        
        if (!fileUrl) {
          try {
            console.log('Fetching file metadata for download ID:', file._id)
            const meta = await filesAPI.getById(file._id)
            console.log('Download metadata response:', meta)
            const metaData = meta.data || meta
            fileUrl = metaData?.fileUrl
            if (!fileName && metaData?.fileName) fileName = metaData.fileName
            console.log('Resolved fileUrl for download:', fileUrl)
          } catch (e) {
            console.warn('Failed to load file metadata for download', e)
          }
        }

        if (!fileUrl) {
          throw new Error('No downloadable URL available')
        }

        // Build absolute URL if backend returns a relative path
        let absoluteUrl = fileUrl.startsWith('http') ? fileUrl : `${API_ORIGIN}${fileUrl}`
        console.log('Final download URL:', absoluteUrl)

        // Use direct download approach
        const a = document.createElement('a')
        a.href = absoluteUrl
        a.download = fileName
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()

        setTimeout(() => {
          document.body.removeChild(a)
          setDownloadingFile(null)
        }, 100)
      }

    } catch (error) {
      console.error('Error downloading file:', error)
      setDownloadingFile(null)
      alert(`Failed to download file: ${error.message}. Please try again.`)
    }
  }

  const handleView = async (file) => {
    try {
      setViewingFile(file._id)
      console.log('Attempting to view file:', file)
      
      // Try to use fileUrl directly; otherwise fetch metadata
      let fileUrl = file.fileUrl
      console.log('Initial fileUrl:', fileUrl)
      
      if (!fileUrl) {
        try {
          console.log('Fetching file metadata for ID:', file._id)
          const meta = await filesAPI.getById(file._id)
          console.log('File metadata response:', meta)
          const metaData = meta.data || meta
          fileUrl = metaData?.fileUrl
          console.log('Resolved fileUrl from metadata:', fileUrl)
        } catch (e) {
          console.warn('Failed to load file metadata for view', e)
        }
      }

      if (!fileUrl) {
        console.error('No fileUrl found in file object:', file)
        throw new Error('No viewable URL available')
      }

      let absoluteUrl = fileUrl.startsWith('http') ? fileUrl : `${API_ORIGIN}${fileUrl}`
      console.log('Final absolute URL:', absoluteUrl)

      // For PDF files, try multiple approaches to ensure proper viewing
      const fileType = file.fileType || file.type || ''
      const isPDF = fileType.includes('pdf') || (file.fileName || file.name || '').toLowerCase().includes('.pdf')
      
      // For all file types, use direct opening to ensure viewing, not downloading
      console.log('Opening file for viewing:', absoluteUrl)
      
      // Method 1: Direct window.open (most reliable for viewing)
      const newWindow = window.open(absoluteUrl, '_blank', 'noopener,noreferrer')
      
      // Method 2: If window.open fails, try with link element
      if (!newWindow || newWindow.closed) {
        console.log('Window.open failed, trying link method...')
        
        const link = document.createElement('a')
        link.href = absoluteUrl
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.style.display = 'none'
        
        // Add to DOM, click, and remove
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      // Method 3: For PDFs, try with proper content-disposition header
      if (isPDF) {
        console.log('PDF detected, ensuring proper viewing...')
        
        // Try to fetch with proper headers to prevent download
        fetch(absoluteUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache'
          }
        })
        .then(response => {
          if (response.ok) {
            // Check if response has content-disposition header that forces download
            const contentDisposition = response.headers.get('content-disposition')
            if (contentDisposition && contentDisposition.includes('attachment')) {
              console.log('Server is forcing download, using blob approach...')
              return response.blob()
            } else {
              console.log('Server allows viewing, using direct URL')
              window.open(absoluteUrl, '_blank', 'noopener,noreferrer')
            }
          }
        })
        .then(blob => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob)
            window.open(blobUrl, '_blank', 'noopener,noreferrer')
            // Clean up blob URL after some time
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
          }
        })
        .catch(error => {
          console.warn('Fetch approach failed:', error)
          // Final fallback to direct URL
          window.open(absoluteUrl, '_blank', 'noopener,noreferrer')
        })
      }
      
      // Reset viewing state after a short delay
      setTimeout(() => setViewingFile(null), 1000)

    } catch (error) {
      console.error('Error opening file:', error)
      setViewingFile(null)
      
      // Provide more specific error messages
      let errorMessage = 'Unable to open the file. '
      if (error.message.includes('fetch')) {
        errorMessage += 'The file may be protected or the server is not responding. '
      } else if (error.message.includes('No viewable URL')) {
        errorMessage += 'File URL is not available. '
      } else {
        errorMessage += error.message + '. '
      }
      errorMessage += 'Please try downloading the file instead.'
      
      alert(errorMessage)
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
    <div className="min-h-screen flex overflow-x-hidden">
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
            <h1 className="text-xl font-bold text-gray-100">DocDomt💙</h1>
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
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="bg-dark-card border-b border-dark-border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-300 hover:text-gray-100 p-1"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100 mb-1 truncate">
                DocDomt💙
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                Browse and download shared documents
              </p>
            </div>

            <Button
              onClick={() => setUploadModalOpen(true)}
              variant="primary"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
            >
              <Upload size={16} className="sm:hidden" />
              <Upload size={20} className="hidden sm:block" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-dark-card border-b border-dark-border p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 sm:mb-4">
              <SearchBar
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search by file name..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              <Select
                value={filters.semester}
                onChange={handleFilterChange('semester')}
                options={semesters}
                placeholder="Semester"
              />

              <Select
                value={filters.course}
                onChange={handleFilterChange('course')}
                options={courses}
                placeholder="Course"
              />

              <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                <Button
                  onClick={toggleMyUploads}
                  variant={filters.myUploads ? 'primary' : 'secondary'}
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <FileText size={16} className="sm:hidden" />
                  <FileText size={18} className="hidden sm:block" />
                  <span className="hidden sm:inline">My Uploads</span>
                  <span className="sm:hidden">Mine</span>
                </Button>

                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
                  >
                    <X size={16} className="sm:hidden" />
                    <X size={18} className="hidden sm:block" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden scrollbar-thin pb-20 lg:pb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {files.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDownload={handleDownload}
                  onView={handleView}
                  isDownloading={downloadingFile === file._id}
                  isViewing={viewingFile === file._id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setUploadModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden bg-primary hover:bg-primary-light text-white p-4 rounded-full shadow-lg z-50 transition-colors"
      >
        <Upload size={24} />
      </button>

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

