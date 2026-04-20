'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Edit3,
  ChevronDown,
  Plus,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { cn, formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'
import NoteEditor from '@/components/notes/NoteEditor'
import FileUploadZone from '@/components/uploads/FileUploadZone'
import ChatPanel from '@/components/chat/ChatPanel'
import type { Assignment, AssignmentStatus, Note, FileUpload } from '@/lib/types'

// ===== Mock Data =====
const MOCK_COURSES = [
  { id: 'c1', title: 'Data Structures & Algorithms', color: '#8B5CF6' },
  { id: 'c2', title: 'Linear Algebra', color: '#3B82F6' },
  { id: 'c3', title: 'Operating Systems', color: '#10B981' },
  { id: 'c4', title: 'Machine Learning', color: '#F59E0B' },
  { id: 'c5', title: 'Database Systems', color: '#EC4899' },
]

const MOCK_ASSIGNMENTS: Record<string, Assignment> = {
  a1: {
    id: 'a1',
    course_id: 'c1',
    user_id: 'u1',
    title: 'Implement AVL Tree Rotations',
    description:
      'Implement left, right, left-right, and right-left rotations for AVL trees. Include unit tests for each rotation type.\n\nRequirements:\n- Implement all four rotation types\n- Handle insertion and deletion that triggers rebalancing\n- Write at least 10 unit tests covering edge cases\n- Document time complexity for each operation\n- Submit as a Git repository link',
    due_date: '2026-04-23T23:59:00Z',
    status: 'in_progress',
    priority: 'high',
    created_at: '2026-04-10T10:00:00Z',
    updated_at: '2026-04-18T14:30:00Z',
  },
  a2: {
    id: 'a2',
    course_id: 'c2',
    user_id: 'u1',
    title: 'Eigenvalue Problem Set',
    description:
      'Solve problems 3.1 through 3.15 on eigenvalues and eigenvectors. Show all work.\n\nTopics covered:\n- Characteristic polynomials\n- Diagonalization\n- Symmetric matrices\n- Applications to differential equations',
    due_date: '2026-04-22T23:59:00Z',
    status: 'pending',
    priority: 'medium',
    created_at: '2026-04-12T09:00:00Z',
    updated_at: '2026-04-12T09:00:00Z',
  },
  a3: {
    id: 'a3',
    course_id: 'c3',
    user_id: 'u1',
    title: 'Process Scheduling Simulation',
    description:
      'Build a simulation of Round Robin, SJF, and Priority scheduling algorithms. Compare performance metrics.\n\nDeliverables:\n- Working simulation in C or Python\n- Performance comparison report\n- Gantt charts for each algorithm\n- Analysis of average wait time and turnaround time',
    due_date: '2026-04-25T23:59:00Z',
    status: 'pending',
    priority: 'high',
    created_at: '2026-04-14T11:00:00Z',
    updated_at: '2026-04-14T11:00:00Z',
  },
  a5: {
    id: 'a5',
    course_id: 'c5',
    user_id: 'u1',
    title: 'SQL Query Optimization Report',
    description:
      'Analyze and optimize 5 slow queries. Document execution plans and indexing strategies used.\n\nRequirements:\n- Use EXPLAIN ANALYZE for each query\n- Propose at least 2 optimizations per query\n- Measure before/after performance\n- Include index recommendations',
    due_date: '2026-04-18T23:59:00Z',
    status: 'overdue',
    priority: 'high',
    created_at: '2026-04-05T09:00:00Z',
    updated_at: '2026-04-19T10:00:00Z',
  },
}

const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    user_id: 'u1',
    course_id: 'c1',
    assignment_id: 'a1',
    title: 'AVL Tree Rotation Notes',
    content: 'Left rotation: When right subtree is heavier...\nRight rotation: When left subtree is heavier...',
    tags: ['trees', 'algorithms', 'rotations'],
    summary: 'Notes on implementing AVL tree rotation operations with diagrams and pseudocode.',
    is_pinned: false,
    created_at: '2026-04-12T10:00:00Z',
    updated_at: '2026-04-17T15:00:00Z',
  },
  {
    id: 'n2',
    user_id: 'u1',
    course_id: 'c1',
    assignment_id: 'a1',
    title: 'Balance Factor Calculations',
    content: 'Balance factor = height(left) - height(right)\nIf BF > 1 or BF < -1, tree is unbalanced...',
    tags: ['avl', 'balance'],
    summary: null,
    is_pinned: true,
    created_at: '2026-04-14T09:00:00Z',
    updated_at: '2026-04-16T11:00:00Z',
  },
]

const MOCK_FILES: FileUpload[] = [
  {
    id: 'f1',
    user_id: 'u1',
    course_id: 'c1',
    assignment_id: 'a1',
    file_name: 'avl_tree_implementation.py',
    file_size: 8420,
    file_type: 'text/plain',
    storage_path: '/uploads/avl_tree_implementation.py',
    s3_key: null,
    created_at: '2026-04-16T14:00:00Z',
  },
  {
    id: 'f2',
    user_id: 'u1',
    course_id: 'c1',
    assignment_id: 'a1',
    file_name: 'test_rotations.pdf',
    file_size: 245000,
    file_type: 'application/pdf',
    storage_path: '/uploads/test_rotations.pdf',
    s3_key: null,
    created_at: '2026-04-17T10:00:00Z',
  },
]

type TabType = 'details' | 'notes' | 'files' | 'chat'

function getDaysUntilDue(dueDate: string): { text: string; isOverdue: boolean } {
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`, isOverdue: true }
  } else if (diffDays === 0) {
    return { text: 'Due today', isOverdue: false }
  } else if (diffDays === 1) {
    return { text: '1 day left', isOverdue: false }
  } else {
    return { text: `${diffDays} days left`, isOverdue: false }
  }
}

function getCourseById(id: string) {
  return MOCK_COURSES.find((c) => c.id === id)
}

export default function AssignmentDetailPage() {
  const params = useParams()
  const assignmentId = params.id as string

  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [chatOpen, setChatOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  const assignment = MOCK_ASSIGNMENTS[assignmentId]

  if (!assignment) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            Assignment not found
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            The assignment you are looking for does not exist.
          </p>
          <a
            href="/assignments"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-accent-primary)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to assignments
          </a>
        </div>
      </div>
    )
  }

  const course = getCourseById(assignment.course_id)
  const dueInfo = getDaysUntilDue(assignment.due_date)
  const assignmentNotes = MOCK_NOTES.filter((n) => n.assignment_id === assignmentId)
  const assignmentFiles = MOCK_FILES.filter((f) => f.assignment_id === assignmentId)

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'details', label: 'Details', icon: <FileText className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'files', label: 'Files', icon: <FileText className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  const handleStatusChange = (newStatus: AssignmentStatus) => {
    // In production, persist to backend
    setStatusDropdownOpen(false)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Back Link */}
      <a
        href="/assignments"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All Assignments
      </a>

      {/* Assignment Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-3">
              {assignment.title}
            </h1>
            <div className="flex items-center flex-wrap gap-3">
              {/* Course */}
              {course && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {course.title}
                  </span>
                </div>
              )}
              {/* Status Badge */}
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded text-xs font-medium capitalize',
                  getStatusColor(assignment.status)
                )}
              >
                {assignment.status.replace('_', ' ')}
              </span>
              {/* Priority Badge */}
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded text-xs font-medium capitalize',
                  getPriorityColor(assignment.priority)
                )}
              >
                {assignment.priority} priority
              </span>
            </div>
          </div>

          {/* Status Change Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                'bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'transition-colors'
              )}
            >
              Change Status
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg shadow-xl py-1 z-10">
                {(['pending', 'in_progress', 'completed', 'overdue'] as AssignmentStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm capitalize',
                        'hover:bg-[var(--color-bg-tertiary)] transition-colors',
                        assignment.status === status
                          ? 'text-[var(--color-accent-primary)]'
                          : 'text-[var(--color-text-secondary)]'
                      )}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Due Date with Countdown */}
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
            'bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]',
            dueInfo.isOverdue ? 'text-red-400' : 'text-[var(--color-text-secondary)]'
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>Due {formatDate(assignment.due_date, 'EEEE, MMM d, yyyy')}</span>
          <span className="text-[var(--color-border-subtle)]">|</span>
          <Clock className="w-3.5 h-3.5" />
          <span className={cn('font-medium', dueInfo.isOverdue && 'text-red-400')}>
            {dueInfo.text}
          </span>
          {dueInfo.isOverdue && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-subtle)] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200',
              activeTab === tab.id
                ? 'text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {activeTab === 'details' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
                Description
              </h3>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-5">
                <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {assignment.description}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Created</p>
                <p className="text-sm text-[var(--color-text-primary)]">
                  {formatDate(assignment.created_at)}
                </p>
              </div>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Last Updated</p>
                <p className="text-sm text-[var(--color-text-primary)]">
                  {formatDate(assignment.updated_at)}
                </p>
              </div>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Priority</p>
                <p className="text-sm text-[var(--color-text-primary)] capitalize">
                  {assignment.priority}
                </p>
              </div>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Status</p>
                <p className="text-sm text-[var(--color-text-primary)] capitalize">
                  {assignment.status.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                Notes ({assignmentNotes.length})
              </h3>
              <button
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                  'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]',
                  'hover:bg-[var(--color-accent-primary)]/20 transition-colors',
                  'border border-[var(--color-accent-primary)]/20'
                )}
              >
                <Plus className="w-3.5 h-3.5" />
                New Note
              </button>
            </div>

            {assignmentNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Edit3 className="w-8 h-8 text-[var(--color-text-tertiary)] mb-3" />
                <p className="text-sm text-[var(--color-text-secondary)]">
                  No notes for this assignment yet.
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                  Create a note to keep track of your progress.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignmentNotes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      'bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-4',
                      'hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                        {note.title}
                      </h4>
                      {note.is_pinned && (
                        <span className="text-[var(--color-accent-primary)]">
                          <Edit3 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-2">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto text-[10px] text-[var(--color-text-tertiary)]">
                        {formatDate(note.updated_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="animate-fade-in">
            <FileUploadZone
              onUpload={(files) => console.log('Uploaded:', files)}
              courseId={assignment.course_id}
              assignmentId={assignment.id}
              existingFiles={assignmentFiles}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="animate-fade-in">
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-6 text-center">
              <MessageSquare className="w-8 h-8 text-[var(--color-accent-primary)] mx-auto mb-3" />
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                AI Tutor Chat
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                Get help with this assignment from the AI tutor.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
                  'bg-[var(--color-accent-primary)] text-white',
                  'hover:bg-[var(--color-accent-primary)]/90 transition-all duration-200',
                  'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                )}
              >
                <MessageSquare className="w-4 h-4" />
                Open Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        contextType="assignment"
        contextId={assignment.id}
        contextTitle={assignment.title}
      />
    </div>
  )
}
