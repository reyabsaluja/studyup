'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  LayoutGrid,
  List,
  Columns3,
  Search,
  X,
  Calendar,
  ChevronDown,
  InboxIcon,
} from 'lucide-react'
import { cn, formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'
import AssignmentCard from '@/components/cards/AssignmentCard'
import type { Assignment, AssignmentStatus, AssignmentPriority } from '@/lib/types'

// ===== Mock Data =====
const MOCK_COURSES = [
  { id: 'c1', title: 'Data Structures & Algorithms', color: '#8B5CF6' },
  { id: 'c2', title: 'Linear Algebra', color: '#3B82F6' },
  { id: 'c3', title: 'Operating Systems', color: '#10B981' },
  { id: 'c4', title: 'Machine Learning', color: '#F59E0B' },
  { id: 'c5', title: 'Database Systems', color: '#EC4899' },
]

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    course_id: 'c1',
    user_id: 'u1',
    title: 'Implement AVL Tree Rotations',
    description: 'Implement left, right, left-right, and right-left rotations for AVL trees. Include unit tests for each rotation type.',
    due_date: '2026-04-23T23:59:00Z',
    status: 'in_progress',
    priority: 'high',
    created_at: '2026-04-10T10:00:00Z',
    updated_at: '2026-04-18T14:30:00Z',
  },
  {
    id: 'a2',
    course_id: 'c2',
    user_id: 'u1',
    title: 'Eigenvalue Problem Set',
    description: 'Solve problems 3.1 through 3.15 on eigenvalues and eigenvectors. Show all work.',
    due_date: '2026-04-22T23:59:00Z',
    status: 'pending',
    priority: 'medium',
    created_at: '2026-04-12T09:00:00Z',
    updated_at: '2026-04-12T09:00:00Z',
  },
  {
    id: 'a3',
    course_id: 'c3',
    user_id: 'u1',
    title: 'Process Scheduling Simulation',
    description: 'Build a simulation of Round Robin, SJF, and Priority scheduling algorithms. Compare performance metrics.',
    due_date: '2026-04-25T23:59:00Z',
    status: 'pending',
    priority: 'high',
    created_at: '2026-04-14T11:00:00Z',
    updated_at: '2026-04-14T11:00:00Z',
  },
  {
    id: 'a4',
    course_id: 'c4',
    user_id: 'u1',
    title: 'Neural Network Backpropagation',
    description: 'Implement backpropagation from scratch using NumPy. Train on MNIST dataset and report accuracy.',
    due_date: '2026-04-28T23:59:00Z',
    status: 'pending',
    priority: 'medium',
    created_at: '2026-04-15T08:00:00Z',
    updated_at: '2026-04-15T08:00:00Z',
  },
  {
    id: 'a5',
    course_id: 'c5',
    user_id: 'u1',
    title: 'SQL Query Optimization Report',
    description: 'Analyze and optimize 5 slow queries. Document execution plans and indexing strategies used.',
    due_date: '2026-04-18T23:59:00Z',
    status: 'overdue',
    priority: 'high',
    created_at: '2026-04-05T09:00:00Z',
    updated_at: '2026-04-19T10:00:00Z',
  },
  {
    id: 'a6',
    course_id: 'c1',
    user_id: 'u1',
    title: 'Graph Traversal Homework',
    description: 'Implement BFS and DFS for directed and undirected graphs. Solve maze problem using both approaches.',
    due_date: '2026-04-15T23:59:00Z',
    status: 'completed',
    priority: 'medium',
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-14T16:00:00Z',
  },
  {
    id: 'a7',
    course_id: 'c2',
    user_id: 'u1',
    title: 'Matrix Transformations Quiz Prep',
    description: 'Review transformation matrices for rotation, scaling, and shearing. Practice with 3D matrices.',
    due_date: '2026-04-21T10:00:00Z',
    status: 'in_progress',
    priority: 'low',
    created_at: '2026-04-13T14:00:00Z',
    updated_at: '2026-04-19T09:00:00Z',
  },
  {
    id: 'a8',
    course_id: 'c3',
    user_id: 'u1',
    title: 'Memory Management Lab',
    description: 'Implement a page replacement algorithm simulator. Compare FIFO, LRU, and Optimal algorithms.',
    due_date: '2026-04-30T23:59:00Z',
    status: 'pending',
    priority: 'low',
    created_at: '2026-04-17T11:00:00Z',
    updated_at: '2026-04-17T11:00:00Z',
  },
  {
    id: 'a9',
    course_id: 'c4',
    user_id: 'u1',
    title: 'Decision Tree Classifier',
    description: 'Build a decision tree from scratch with ID3 algorithm. Visualize the tree and report accuracy on test set.',
    due_date: '2026-04-12T23:59:00Z',
    status: 'completed',
    priority: 'medium',
    created_at: '2026-03-28T10:00:00Z',
    updated_at: '2026-04-11T20:00:00Z',
  },
  {
    id: 'a10',
    course_id: 'c5',
    user_id: 'u1',
    title: 'ER Diagram for E-commerce System',
    description: 'Design a complete ER diagram for an e-commerce platform. Include normalization to 3NF.',
    due_date: '2026-04-19T23:59:00Z',
    status: 'overdue',
    priority: 'medium',
    created_at: '2026-04-08T09:00:00Z',
    updated_at: '2026-04-20T08:00:00Z',
  },
]

type ViewMode = 'list' | 'grid' | 'kanban'
type SortOption = 'due_date' | 'priority' | 'created_at'
type StatusFilter = 'all' | AssignmentStatus

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
]

const PRIORITY_OPTIONS: { value: AssignmentPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'created_at', label: 'Date Created' },
]

const KANBAN_COLUMNS: AssignmentStatus[] = ['pending', 'in_progress', 'completed', 'overdue']

function getCourseById(id: string) {
  return MOCK_COURSES.find((c) => c.id === id)
}

export default function AssignmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<AssignmentPriority | 'all'>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('due_date')
  const [showModal, setShowModal] = useState(false)

  // New assignment form state
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [newPriority, setNewPriority] = useState<AssignmentPriority>('medium')
  const [newStatus, setNewStatus] = useState<AssignmentStatus>('pending')

  const filteredAssignments = useMemo(() => {
    let result = [...MOCK_ASSIGNMENTS]

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }
    if (priorityFilter !== 'all') {
      result = result.filter((a) => a.priority === priorityFilter)
    }
    if (courseFilter !== 'all') {
      result = result.filter((a) => a.course_id === courseFilter)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'priority': {
          const order = { high: 0, medium: 1, low: 2 }
          return order[a.priority] - order[b.priority]
        }
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return result
  }, [statusFilter, priorityFilter, courseFilter, sortBy])

  const handleCreateAssignment = () => {
    // In production this would persist to the backend
    setShowModal(false)
    setNewTitle('')
    setNewDescription('')
    setNewDueDate('')
    setNewCourse('')
    setNewPriority('medium')
    setNewStatus('pending')
  }

  const handleCardClick = (id: string) => {
    window.location.href = `/assignments/${id}`
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
            Assignments
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-[var(--color-accent-primary)] text-white text-sm font-medium',
            'hover:bg-[var(--color-accent-primary)]/90 transition-all duration-200',
            'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          )}
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                statusFilter === opt.value
                  ? 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as AssignmentPriority | 'all')}
          className={cn(
            'px-3 py-2 rounded-lg text-xs font-medium',
            'bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]',
            'text-[var(--color-text-secondary)]',
            'focus:outline-none focus:border-[var(--color-accent-primary)]'
          )}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Course Filter */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className={cn(
            'px-3 py-2 rounded-lg text-xs font-medium',
            'bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]',
            'text-[var(--color-text-secondary)]',
            'focus:outline-none focus:border-[var(--color-accent-primary)]'
          )}
        >
          <option value="all">All Courses</option>
          {MOCK_COURSES.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className={cn(
            'px-3 py-2 rounded-lg text-xs font-medium',
            'bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]',
            'text-[var(--color-text-secondary)]',
            'focus:outline-none focus:border-[var(--color-accent-primary)]'
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        {/* View Toggle */}
        <div className="ml-auto flex items-center gap-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded-md transition-all duration-200',
              viewMode === 'list'
                ? 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded-md transition-all duration-200',
              viewMode === 'grid'
                ? 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              'p-1.5 rounded-md transition-all duration-200',
              viewMode === 'kanban'
                ? 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
            title="Kanban view"
          >
            <Columns3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {filteredAssignments.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-[var(--color-bg-tertiary)] p-4 mb-4">
            <InboxIcon className="w-8 h-8 text-[var(--color-text-tertiary)]" />
          </div>
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
            No assignments found
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Try adjusting your filters or create a new assignment.
          </p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban View */
        <div className="grid grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((status) => {
            const columnAssignments = filteredAssignments.filter((a) => a.status === status)
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded text-xs font-medium capitalize',
                      getStatusColor(status)
                    )}
                  >
                    {status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {columnAssignments.length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[200px] bg-[var(--color-bg-tertiary)]/30 rounded-lg p-2">
                  {columnAssignments.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px] text-xs text-[var(--color-text-tertiary)]">
                      No assignments
                    </div>
                  ) : (
                    columnAssignments.map((assignment) => {
                      const course = getCourseById(assignment.course_id)
                      return (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          courseName={course?.title}
                          courseColor={course?.color}
                          onClick={() => handleCardClick(assignment.id)}
                        />
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => {
            const course = getCourseById(assignment.course_id)
            return (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                courseName={course?.title}
                courseColor={course?.color}
                onClick={() => handleCardClick(assignment.id)}
              />
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredAssignments.map((assignment) => {
            const course = getCourseById(assignment.course_id)
            return (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                courseName={course?.title}
                courseColor={course?.color}
                onClick={() => handleCardClick(assignment.id)}
              />
            )
          })}
        </div>
      )}

      {/* New Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl shadow-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-[var(--color-text-primary)]">
                New Assignment
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Assignment title"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm',
                    'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                    'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                    'focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/50'
                  )}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the assignment..."
                  rows={3}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm resize-none',
                    'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                    'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                    'focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/50'
                  )}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm',
                    'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                    'text-[var(--color-text-primary)]',
                    'focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/50'
                  )}
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Course
                </label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm',
                    'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                    'text-[var(--color-text-primary)]',
                    'focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/50'
                  )}
                >
                  <option value="">Select a course</option>
                  {MOCK_COURSES.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Priority
                </label>
                <div className="flex items-center gap-4">
                  {(['low', 'medium', 'high'] as AssignmentPriority[]).map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={newPriority === p}
                        onChange={() => setNewPriority(p)}
                        className="w-3.5 h-3.5 text-[var(--color-accent-primary)] border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)] focus:ring-[var(--color-accent-primary)]"
                      />
                      <span
                        className={cn(
                          'text-xs font-medium capitalize px-2 py-0.5 rounded',
                          getPriorityColor(p)
                        )}
                      >
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AssignmentStatus)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm',
                    'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                    'text-[var(--color-text-primary)]',
                    'focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/50'
                  )}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border-subtle)]">
              <button
                onClick={() => setShowModal(false)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  'hover:bg-[var(--color-bg-tertiary)] transition-colors'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-[var(--color-accent-primary)] text-white',
                  'hover:bg-[var(--color-accent-primary)]/90 transition-all duration-200',
                  'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                )}
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
