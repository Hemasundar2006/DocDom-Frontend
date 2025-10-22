import { Download, FileText, Image, FileIcon } from 'lucide-react'
import { formatFileSize, formatDate } from '../utils/validation'
import Button from './Button'

export default function FileCard({ file, onDownload }) {
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FileText className="text-red-400" size={24} />
    if (fileType.includes('image')) return <Image className="text-blue-400" size={24} />
    return <FileIcon className="text-gray-400" size={24} />
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-5 hover:border-primary transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getFileIcon(file.fileType || file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-100 truncate group-hover:text-primary transition-colors">
              {file.fileName || file.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Uploaded by {file.uploader || 'Anonymous'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-primary/20 text-primary-light text-xs rounded-full">
          {file.semester}
        </span>
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
          {file.course || file.subject}
        </span>
      </div>

      {file.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {file.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <div className="text-sm text-gray-500">
          <span>{formatFileSize(file.fileSize || file.size)}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(file.uploadedAt || file.createdAt)}</span>
        </div>
        <Button
          onClick={() => onDownload(file)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download
        </Button>
      </div>
    </div>
  )
}

