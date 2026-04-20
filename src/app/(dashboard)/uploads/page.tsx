'use client'

import { useState, useMemo } from 'react'
import {
  FolderOpen,
  Search,
  FileText,
  Image,
  File,
  Grid3X3,
  List,
  HardDrive,
  Filter,
} from 'lucide-react'
import { cn, fileSize, formatDate, generateId } from '@/lib/utils'
import FileUploadZone from '@/components/uploads/FileUploadZone'
import type { FileUpload } from '@/lib/types'

// --- Mock Data ---
const mockFiles: FileUpload[] = [
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-1',
    assignment_id: null,
    file_name: 'Lecture_Notes_Week5.pdf',
    file_size: 2_450_000,
    file_type: 'application/pdf',
    storage_path: '/uploads/course-1/lecture-notes-week5.pdf',
    s3_key: 'uploads/user-1/lecture-notes-week5.pdf',
    created_at: '2026-04-15T10:30:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-1',
    assignment_id: 'assignment-1',
    file_name: 'Problem_Set_4_Solution.docx',
    file_size: 890_000,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    storage_path: '/uploads/course-1/problem-set-4-solution.docx',
    s3_key: 'uploads/user-1/problem-set-4-solution.docx',
    created_at: '2026-04-14T14:20:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-2',
    assignment_id: null,
    file_name: 'Linear_Algebra_Cheat_Sheet.pdf',
    file_size: 1_200_000,
    file_type: 'application/pdf',
    storage_path: '/uploads/course-2/linear-algebra-cheat-sheet.pdf',
    s3_key: 'uploads/user-1/linear-algebra-cheat-sheet.pdf',
    created_at: '2026-04-12T09:15:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-2',
    assignment_id: null,
    file_name: 'Matrix_Transformations_Diagram.png',
    file_size: 3_800_000,
    file_type: 'image/png',
    storage_path: '/uploads/course-2/matrix-transformations-diagram.png',
    s3_key: 'uploads/user-1/matrix-transformations-diagram.png',
    created_at: '2026-04-10T16:45:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-3',
    assignment_id: null,
    file_name: 'Neural_Network_Architecture.png',
    file_size: 5_100_000,
    file_type: 'image/png',
    storage_path: '/uploads/course-3/neural-network-architecture.png',
    s3_key: 'uploads/user-1/neural-network-architecture.png',
    created_at: '2026-04-08T11:00:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-3',
    assignment_id: 'assignment-3',
    file_name: 'ML_Project_Proposal.pdf',
    file_size: 1_650_000,
    file_type: 'application/pdf',
    storage_path: '/uploads/course-3/ml-project-proposal.pdf',
    s3_key: 'uploads/user-1/ml-project-proposal.pdf',
    created_at: '2026-04-06T13:30:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-4',
    assignment_id: null,
    file_name: 'Reaction_Mechanisms_Notes.txt',
    file_size: 45_000,
    file_type: 'text/plain',
    storage_path: '/uploads/course-4/reaction-mechanisms-notes.txt',
    s3_key: 'uploads/user-1/reaction-mechanisms-notes.txt',
    created_at: '2026-04-04T08:20:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-4',
    assignment_id: null,
    file_name: 'Lab_Report_Template.docx',
    file_size: 520_000,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    storage_path: '/uploads/course-4/lab-report-template.docx',
    s3_key: 'uploads/user-1/lab-report-template.docx',
    created_at: '2026-04-02T15:10:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-5',
    assignment_id: null,
    file_name: 'Modernist_Literature_Essay_Draft.pdf',
    file_size: 980_000,
    file_type: 'application/pdf',
    storage_path: '/uploads/course-5/modernist-literature-essay-draft.pdf',
    s3_key: 'uploads/user-1/modernist-literature-essay-draft.pdf',
    created_at: '2026-03-28T10:00:00Z',
  },
  {
    id: generateId(),
    user_id: 'user-1',
    course_id: 'course-5',
    assignment_id: null,
    file_name: 'Poetry_Analysis_Scan.jpg',
    file_size: 4_200_000,
    file_type: 'image/jpeg',
    storage_path: '/uploads/course-5/poetry-analysis-scan.jpg',
    s3_key: 'uploads/user-1/poetry-analysis-scan.jpg',
    created_at: '2026-03-25T12:30:00Z',
  },
]

const courseNames: Record<string, string> = {
  'course-1': 'Data Structures',
  'course-2': 'Linear Algebra',
  'course-3': 'Machine Learning',
  'course-4': 'Organic Chemistry',
  'course-5': 'English Literature',
}

type ViewMode = 'grid' | 'list'
type FileTypeFilter = 'all' | 'pdf' | 'doc' | 'image' | 'text'

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) {
    return <Image className="h-5 w-5 text-blue-400" />
  }
  if (fileType === 'application/pdf') {
    return <FileText className="h-5 w-5 text-red-400" />
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <FileText className="h-5 w-5 text-indigo-400" />
  }
  if (fileType === 'text/plain') {
    return <FileText className="h-5 w-5 text-emerald-400" />
  }
  return <File className="h-5 w-5 text-[var(--text-tertiary)]" />
}

function getFileTypeLabel(fileType: string): string {
  if (fileType.startsWith('image/')) return 'Image'
  if (fileType === 'application/pdf') return 'PDF'
  if (fileType.includes('word') || fileType.includes('document')) return 'DOCX'
  if (fileType === 'text/plain') return 'TXT'
  return 'File'
}

export default function UploadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>('all')
  const [files] = useState<FileUpload[]>(mockFiles)

  const totalStorageUsed = useMemo(
    () => files.reduce((sum, f) => sum + f.file_size, 0),
    [files]
  )
  const storageLimit = 500_000_000 // 500 MB
  const storagePercent = Math.round((totalStorageUsed / storageLimit) * 100)

  const filteredFiles = useMemo(() => {
    let filtered = files

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (f) =>
          f.file_name.toLowerCase().includes(q) ||
          (f.course_id && courseNames[f.course_id]?.toLowerCase().includes(q))
      )
    }

    // Apply type filter
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter((f) => {
        switch (fileTypeFilter) {
          case 'pdf':
            return f.file_type === 'application/pdf'
          case 'doc':
            return f.file_type.includes('word') || f.file_type.includes('document')
          case 'image':
            return f.file_type.startsWith('image/')
          case 'text':
            return f.file_type === 'text/plain'
          default:
            return true
        }
      })
    }

    return filtered
  }, [files, searchQuery, fileTypeFilter])

  // Group files by course
  const groupedFiles = useMemo(() => {
    const groups: Record<string, FileUpload[]> = {}
    filteredFiles.forEach((file) => {
      const courseKey = file.course_id || 'uncategorized'
      if (!groups[courseKey]) groups[courseKey] = []
      groups[courseKey].push(file)
    })
    return groups
  }, [filteredFiles])

  const handleUpload = (uploadedFiles: File[]) => {
    // In production, this would upload to S3
    console.log('Uploading files:', uploadedFiles)
  }

  const filterOptions: { value: FileTypeFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'DOCX' },
    { value: 'image', label: 'Images' },
    { value: 'text', label: 'Text' },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-6 w-6 text-[var(--accent-primary)]" />
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Files & Uploads
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Manage your course materials and documents
            </p>
          </div>
        </div>

        {/* Storage Indicator */}
        <div className="flex items-center gap-3">
          <HardDrive className="h-4 w-4 text-[var(--text-tertiary)]" />
          <div className="w-40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--text-tertiary)]">
                {fileSize(totalStorageUsed)} / {fileSize(storageLimit)}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">
                {storagePercent}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-all"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Upload Zone */}
        <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <FileUploadZone onUpload={handleUpload} />
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 animate-fade-in stagger-2" style={{ opacity: 0 }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
            />
          </div>

          {/* File Type Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-0.5">
            <Filter className="ml-2 h-3.5 w-3.5 text-[var(--text-tertiary)]" />
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFileTypeFilter(option.value)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  fileTypeFilter === option.value
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Files grouped by course */}
        <div className="space-y-6 animate-fade-in stagger-3" style={{ opacity: 0 }}>
          {Object.entries(groupedFiles).map(([courseId, courseFiles]) => (
            <div key={courseId}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                {courseNames[courseId] || 'Uncategorized'}
              </h3>

              {viewMode === 'list' ? (
                <div className="space-y-2">
                  {courseFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 transition-colors hover:bg-[var(--bg-tertiary)]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getFileIcon(file.file_type)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {file.file_name}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)]">
                            {fileSize(file.file_size)} &middot;{' '}
                            {getFileTypeLabel(file.file_type)} &middot;{' '}
                            {formatDate(file.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className="ml-4 rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
                        {courseNames[file.course_id || ''] || 'No course'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {courseFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition-colors hover:bg-[var(--bg-tertiary)]"
                    >
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                        {getFileIcon(file.file_type)}
                      </div>
                      <p className="w-full text-center text-sm font-medium text-[var(--text-primary)] truncate">
                        {file.file_name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                        {fileSize(file.file_size)}
                      </p>
                      <p className="text-xs text-[var(--text-disabled)]">
                        {formatDate(file.created_at, 'MMM d')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="mb-3 h-10 w-10 text-[var(--text-disabled)]" />
              <p className="text-sm text-[var(--text-tertiary)]">
                No files found matching your search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
