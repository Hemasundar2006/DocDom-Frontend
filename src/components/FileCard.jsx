import { Download, FileText, Image, FileIcon } from 'lucide-react'
import { formatFileSize, formatDate } from '../utils/validation'
import Button from './Button'

export default function FileCard({ file, onDownload, onView, isDownloading = false }) {
  // Debug: Log the file object to see its structure
  console.log('FileCard received file:', file)
  
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FileText className="text-red-400" size={24} />
    if (fileType.includes('image')) return <Image className="text-blue-400" size={24} />
    return <FileIcon className="text-gray-400" size={24} />
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-3 sm:p-5 hover:border-primary transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getFileIcon(file.fileType || file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-100 truncate group-hover:text-primary transition-colors">
              {file.fileName || file.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
              Uploaded by {typeof file.uploader === 'object' ? file.uploader?.name || 'Anonymous' : file.uploader || 'Anonymous'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        <span className="px-2 py-1 bg-primary/20 text-primary-light text-xs rounded-full truncate">
          {file.semester}
        </span>
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full truncate">
          {typeof file.course === 'object' ? file.course?.name || 'Unknown Course' : file.course || file.subject || 'Unknown Course'}
        </span>
      </div>

      {file.description && (
        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">
          {file.description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-dark-border gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
          <span>{formatFileSize(file.fileSize || file.size)}</span>
          <span className="mx-1 sm:mx-2">•</span>
          <span>{formatDate(file.uploadedAt || file.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            onClick={() => onView?.(file)}
            variant="secondary"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            <span className="hidden sm:inline">View</span>
            <span className="sm:hidden">👁</span>
          </Button>
          <Button
            onClick={() => onDownload(file)}
            variant="primary"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            disabled={isDownloading}
            loading={isDownloading}
          >
            <Download size={14} className="sm:hidden" />
            <Download size={16} className="hidden sm:block" />
            <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download'}</span>
            <span className="sm:hidden">{isDownloading ? '...' : '↓'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

