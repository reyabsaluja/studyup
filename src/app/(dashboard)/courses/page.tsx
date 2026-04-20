'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, BookOpen, X } from 'lucide-react'
import { cn, COURSE_COLORS, COURSE_ICONS } from '@/lib/utils'
import type { Course } from '@/lib/types'
import CourseCard from '@/components/cards/CourseCard'

// Mock data
const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    user_id: 'user-1',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive study of fundamental data structures and algorithm design techniques including sorting, searching, and graph algorithms.',
    color: '#8B5CF6',
    icon: '💻',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-04-18T14:30:00Z',
  },
  {
    id: 'course-2',
    user_id: 'user-1',
    title: 'Organic Chemistry',
    description: 'Study of carbon-based compounds, their structures, properties, reactions, and synthesis mechanisms.',
    color: '#10B981',
    icon: '🧪',
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-04-17T11:00:00Z',
  },
  {
    id: 'course-3',
    user_id: 'user-1',
    title: 'World History: Modern Era',
    description: 'Exploration of major historical events, movements, and transformations from the 18th century to present day.',
    color: '#F59E0B',
    icon: '🌍',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-04-16T16:45:00Z',
  },
  {
    id: 'course-4',
    user_id: 'user-1',
    title: 'Linear Algebra',
    description: 'Vector spaces, linear transformations, matrices, determinants, eigenvalues and eigenvectors.',
    color: '#3B82F6',
    icon: '🔢',
    created_at: '2026-02-10T12:00:00Z',
    updated_at: '2026-04-15T09:20:00Z',
  },
  {
    id: 'course-5',
    user_id: 'user-1',
    title: 'Molecular Biology',
    description: 'DNA replication, transcription, translation, gene regulation and modern molecular techniques.',
    color: '#EC4899',
    icon: '🧬',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-04-14T13:10:00Z',
  },
]

const MOCK_STATS: Record<string, { assignments: number; notes: number }> = {
  'course-1': { assignments: 8, notes: 12 },
  'course-2': { assignments: 5, notes: 7 },
  'course-3': { assignments: 3, notes: 9 },
  'course-4': { assignments: 6, notes: 4 },
  'course-5': { assignments: 4, notes: 6 },
}

type FilterType = 'all' | 'active' | 'archived'

export default function CoursesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [showNewCourseModal, setShowNewCourseModal] = useState(false)

  // New course form state
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newColor, setNewColor] = useState(COURSE_COLORS[0])
  const [newIcon, setNewIcon] = useState(COURSE_ICONS[0])

  const filteredCourses = useMemo(() => {
    let courses = MOCK_COURSES

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    }

    // Filter logic (mock: all courses are "active" for now)
    if (filter === 'archived') {
      courses = []
    }

    return courses
  }, [searchQuery, filter])

  const handleCreateCourse = () => {
    // In a real app, this would call an API
    setShowNewCourseModal(false)
    setNewTitle('')
    setNewDescription('')
    setNewColor(COURSE_COLORS[0])
    setNewIcon(COURSE_ICONS[0])
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Courses</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your courses and materials
          </p>
        </div>
        <button
          onClick={() => setShowNewCourseModal(true)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-accent-primary text-white text-sm font-medium',
            'hover:bg-accent-primary/90 transition-all duration-200',
            'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          )}
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-lg text-sm',
              'bg-bg-secondary border border-border-subtle text-text-primary',
              'placeholder:text-text-tertiary',
              'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50',
              'transition-colors'
            )}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className={cn(
            'px-4 py-2.5 rounded-lg text-sm',
            'bg-bg-secondary border border-border-subtle text-text-primary',
            'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50',
            'transition-colors appearance-none cursor-pointer'
          )}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              assignmentCount={MOCK_STATS[course.id]?.assignments ?? 0}
              noteCount={MOCK_STATS[course.id]?.notes ?? 0}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="rounded-full bg-bg-secondary p-6 mb-4">
            <BookOpen className="w-10 h-10 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            No courses yet
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            Create your first course to get started
          </p>
          <button
            onClick={() => setShowNewCourseModal(true)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg',
              'bg-accent-primary text-white text-sm font-medium',
              'hover:bg-accent-primary/90 transition-all duration-200'
            )}
          >
            <Plus className="w-4 h-4" />
            Create your first course
          </button>
        </div>
      )}

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewCourseModal(false)}
          />

          {/* Modal */}
          <div
            className={cn(
              'relative w-full max-w-lg rounded-xl',
              'bg-bg-secondary/80 backdrop-blur-xl border border-border-subtle',
              'shadow-[0_0_60px_rgba(139,92,246,0.15)]',
              'animate-scale-in p-6'
            )}
          >
            {/* Close button */}
            <button
              onClick={() => setShowNewCourseModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Create New Course
            </h2>

            <div className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Introduction to Physics"
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg text-sm',
                    'bg-bg-primary border border-border-subtle text-text-primary',
                    'placeholder:text-text-tertiary',
                    'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50',
                    'transition-colors'
                  )}
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description of the course..."
                  rows={3}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg text-sm resize-none',
                    'bg-bg-primary border border-border-subtle text-text-primary',
                    'placeholder:text-text-tertiary',
                    'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50',
                    'transition-colors'
                  )}
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COURSE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={cn(
                        'w-9 h-9 rounded-lg transition-all duration-150',
                        newColor === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-secondary scale-110'
                          : 'hover:scale-105'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COURSE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewIcon(icon)}
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-150',
                        'bg-bg-primary border',
                        newIcon === icon
                          ? 'border-accent-primary bg-accent-primary/10 scale-110'
                          : 'border-border-subtle hover:border-border-default hover:scale-105'
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNewCourseModal(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium',
                    'text-text-secondary hover:text-text-primary',
                    'hover:bg-bg-tertiary transition-colors'
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  disabled={!newTitle.trim()}
                  className={cn(
                    'px-5 py-2.5 rounded-lg text-sm font-medium',
                    'bg-accent-primary text-white',
                    'hover:bg-accent-primary/90 transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
