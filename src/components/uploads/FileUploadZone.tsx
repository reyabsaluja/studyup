'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, FileText, Image, File, Trash2 } from 'lucide-react'

import { cn, fileSize, formatDate } from '@/lib/utils'
import type { FileUpload } from '@/lib/types'

interface FileUploadZoneProps {
  onUpload: (files: File[]) => void
  courseId?: string
  assignmentId?: string
  existingFiles?: FileUpload[]
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
]

const ACCEPTED_EXTENSIONS = ['PDF', 'DOCX', 'TXT', 'PNG', 'JPG', 'GIF', 'WEBP']

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) {
    return <Image className="h-5 w-5 text-[#A1A1AA]" />
  }
  if (fileType === 'application/pdf' || fileType === 'text/plain' || fileType.includes('word')) {
    return <FileText className="h-5 w-5 text-[#A1A1AA]" />
  }
  return <File className="h-5 w-5 text-[#A1A1AA]" />
}

export default function FileUploadZone({
  onUpload,
  courseId,
  assignmentId,
  existingFiles = [],
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter((file) =>
        ACCEPTED_TYPES.includes(file.type)
      )

      if (validFiles.length === 0) return

      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setUploadProgress(null), 500)
            return 100
          }
          return prev + 10
        })
      }, 150)

      onUpload(validFiles)
    },
    [onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [processFiles]
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all',
          isDragging
            ? 'border-[#8B5CF6] bg-[rgba(139,92,246,0.05)]'
            : 'border-[rgba(255,255,255,0.1)] bg-[#141420] hover:border-[rgba(255,255,255,0.2)] hover:bg-[#1A1A2E]'
        )}
      >
        <Upload
          className={cn(
            'mb-3 h-10 w-10',
            isDragging ? 'text-[#8B5CF6]' : 'text-[#71717A]'
          )}
        />
        <p className="mb-1 text-sm font-medium text-[#FAFAFA]">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-[#71717A]">
          Supported: {ACCEPTED_EXTENSIONS.join(', ')}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
          data-course-id={courseId}
          data-assignment-id={assignmentId}
        />
      </div>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#141420] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-[#A1A1AA]">Uploading...</span>
            <span className="text-sm font-medium text-[#FAFAFA]">{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-full rounded-full bg-[#8B5CF6] transition-all duration-150 ease-linear"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Existing Files List */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#A1A1AA]">Uploaded Files</h4>
          <div className="space-y-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#141420] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.file_type)}
                  <div>
                    <p className="text-sm font-medium text-[#FAFAFA]">{file.file_name}</p>
                    <p className="text-xs text-[#71717A]">
                      {fileSize(file.file_size)} &middot; {formatDate(file.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md p-2 text-[#71717A] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-red-400"
                  aria-label={`Delete ${file.file_name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
