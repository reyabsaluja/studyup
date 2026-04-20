'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Upload,
  MessageCircle,
  LayoutGrid,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, formatDate, COURSE_COLORS, COURSE_ICONS } from '@/lib/utils'
import type { Course, Assignment, Note, FileUpload } from '@/lib/types'
import AssignmentCard from '@/components/cards/AssignmentCard'
import NoteEditor from '@/components/notes/NoteEditor'
import FileUploadZone from '@/components/uploads/FileUploadZone'
import ChatPanel from '@/components/chat/ChatPanel'

// Mock course data
const MOCK_COURSES: Record<string, Course> = {
  'course-1': {
    id: 'course-1',
    user_id: 'user-1',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive study of fundamental data structures and algorithm design techniques including sorting, searching, and graph algorithms.',
    color: '#8B5CF6',
    icon: '💻',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-04-18T14:30:00Z',
  },
  'course-2': {
    id: 'course-2',
    user_id: 'user-1',
    title: 'Organic Chemistry',
    description: 'Study of carbon-based compounds, their structures, properties, reactions, and synthesis mechanisms.',
    color: '#10B981',
    icon: '🧪',
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-04-17T11:00:00Z',
  },
  'course-3': {
    id: 'course-3',
    user_id: 'user-1',
    title: 'World History: Modern Era',
    description: 'Exploration of major historical events, movements, and transformations from the 18th century to present day.',
    color: '#F59E0B',
    icon: '🌍',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-04-16T16:45:00Z',
  },
  'course-4': {
    id: 'course-4',
    user_id: 'user-1',
    title: 'Linear Algebra',
    description: 'Vector spaces, linear transformations, matrices, determinants, eigenvalues and eigenvectors.',
    color: '#3B82F6',
    icon: '🔢',
    created_at: '2026-02-10T12:00:00Z',
    updated_at: '2026-04-15T09:20:00Z',
  },
  'course-5': {
    id: 'course-5',
    user_id: 'user-1',
    title: 'Molecular Biology',
    description: 'DNA replication, transcription, translation, gene regulation and modern molecular techniques.',
    color: '#EC4899',
    icon: '🧬',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-04-14T13:10:00Z',
  },
}

// Mock assignments
const MOCK_ASSIGNMENTS: Record<string, Assignment[]> = {
  'course-1': [
    {
      id: 'a1',
      course_id: 'course-1',
      user_id: 'user-1',
      title: 'Implement Binary Search Tree',
      description: 'Build a BST with insert, delete, and search operations',
      due_date: '2026-04-25T23:59:00Z',
      status: 'in_progress',
      priority: 'high',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-18T14:30:00Z',
    },
    {
      id: 'a2',
      course_id: 'course-1',
      user_id: 'user-1',
      title: 'Graph Traversal Problems',
      description: 'Solve 5 BFS/DFS problems from the problem set',
      due_date: '2026-04-28T23:59:00Z',
      status: 'pending',
      priority: 'medium',
      created_at: '2026-04-05T10:00:00Z',
      updated_at: '2026-04-10T09:00:00Z',
    },
    {
      id: 'a3',
      course_id: 'course-1',
      user_id: 'user-1',
      title: 'Sorting Algorithm Analysis',
      description: 'Compare time complexity of QuickSort, MergeSort, and HeapSort',
      due_date: '2026-04-10T23:59:00Z',
      status: 'completed',
      priority: 'medium',
      created_at: '2026-03-20T10:00:00Z',
      updated_at: '2026-04-09T22:00:00Z',
    },
    {
      id: 'a4',
      course_id: 'course-1',
      user_id: 'user-1',
      title: 'Dynamic Programming Assignment',
      description: 'Solve the knapsack problem and longest common subsequence',
      due_date: '2026-04-15T23:59:00Z',
      status: 'overdue',
      priority: 'high',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-15T23:59:00Z',
    },
  ],
  'course-2': [
    {
      id: 'a5',
      course_id: 'course-2',
      user_id: 'user-1',
      title: 'Reaction Mechanisms Lab Report',
      description: 'Write up findings from the substitution reactions lab',
      due_date: '2026-04-22T23:59:00Z',
      status: 'in_progress',
      priority: 'high',
      created_at: '2026-04-10T10:00:00Z',
      updated_at: '2026-04-18T11:00:00Z',
    },
    {
      id: 'a6',
      course_id: 'course-2',
      user_id: 'user-1',
      title: 'Stereochemistry Problem Set',
      description: 'Complete exercises on chirality and optical activity',
      due_date: '2026-04-30T23:59:00Z',
      status: 'pending',
      priority: 'medium',
      created_at: '2026-04-15T10:00:00Z',
      updated_at: '2026-04-15T10:00:00Z',
    },
  ],
}

// Mock notes
const MOCK_NOTES: Record<string, Note[]> = {
  'course-1': [
    {
      id: 'n1',
      user_id: 'user-1',
      course_id: 'course-1',
      assignment_id: null,
      title: 'Binary Trees - Key Concepts',
      content: 'A binary tree is a tree data structure where each node has at most two children...\n\nTraversal methods:\n- In-order: Left, Root, Right\n- Pre-order: Root, Left, Right\n- Post-order: Left, Right, Root',
      tags: ['trees', 'traversal', 'data-structures'],
      summary: 'Overview of binary tree structure and three main traversal methods (in-order, pre-order, post-order).',
      is_pinned: true,
      created_at: '2026-03-15T10:00:00Z',
      updated_at: '2026-04-18T14:30:00Z',
    },
    {
      id: 'n2',
      user_id: 'user-1',
      course_id: 'course-1',
      assignment_id: null,
      title: 'Big-O Notation Cheat Sheet',
      content: 'Time Complexity Rankings:\nO(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)',
      tags: ['complexity', 'big-o'],
      summary: null,
      is_pinned: false,
      created_at: '2026-02-20T10:00:00Z',
      updated_at: '2026-03-10T09:00:00Z',
    },
    {
      id: 'n3',
      user_id: 'user-1',
      course_id: 'course-1',
      assignment_id: null,
      title: 'Graph Algorithms Notes',
      content: 'Dijkstra\'s Algorithm:\n1. Initialize distances\n2. Visit unvisited node with smallest distance\n3. Update neighbors\n4. Repeat until all visited',
      tags: ['graphs', 'algorithms', 'dijkstra'],
      summary: 'Step-by-step breakdown of Dijkstra\'s shortest path algorithm.',
      is_pinned: false,
      created_at: '2026-04-05T10:00:00Z',
      updated_at: '2026-04-12T15:00:00Z',
    },
  ],
  'course-2': [
    {
      id: 'n4',
      user_id: 'user-1',
      course_id: 'course-2',
      assignment_id: null,
      title: 'SN1 vs SN2 Reactions',
      content: 'SN1: Two-step, carbocation intermediate, racemization\nSN2: One-step, backside attack, inversion of configuration',
      tags: ['reactions', 'substitution'],
      summary: 'Comparison of SN1 and SN2 nucleophilic substitution mechanisms.',
      is_pinned: true,
      created_at: '2026-03-20T10:00:00Z',
      updated_at: '2026-04-01T11:00:00Z',
    },
  ],
}

// Mock files
const MOCK_FILES: Record<string, FileUpload[]> = {
  'course-1': [
    {
      id: 'f1',
      user_id: 'user-1',
      course_id: 'course-1',
      assignment_id: null,
      file_name: 'DSA_Lecture_Notes_Week8.pdf',
      file_size: 2450000,
      file_type: 'application/pdf',
      storage_path: '/uploads/course-1/dsa-notes.pdf',
      s3_key: null,
      created_at: '2026-04-10T10:00:00Z',
    },
    {
      id: 'f2',
      user_id: 'user-1',
      course_id: 'course-1',
      assignment_id: null,
      file_name: 'algorithm_complexity_chart.png',
      file_size: 850000,
      file_type: 'image/png',
      storage_path: '/uploads/course-1/complexity-chart.png',
      s3_key: null,
      created_at: '2026-04-08T14:00:00Z',
    },
  ],
  'course-2': [
    {
      id: 'f3',
      user_id: 'user-1',
      course_id: 'course-2',
      assignment_id: null,
      file_name: 'Lab_Report_Template.docx',
      file_size: 125000,
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      storage_path: '/uploads/course-2/lab-template.docx',
      s3_key: null,
      created_at: '2026-03-15T09:00:00Z',
    },
  ],
}

type TabType = 'overview' | 'assignments' | 'notes' | 'files' | 'chat'
type AssignmentFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const course = MOCK_COURSES[courseId]
  const assignments = MOCK_ASSIGNMENTS[courseId] || []
  const notes = MOCK_NOTES[courseId] || []
  const files = MOCK_FILES[courseId] || []

  const filteredAssignments = useMemo(() => {
    if (assignmentFilter === 'all') return assignments
    return assignments.filter((a) => a.status === assignmentFilter)
  }, [assignments, assignmentFilter])

  // Stats
  const completedCount = assignments.filter((a) => a.status === 'completed').length
  const overdueCount = assignments.filter((a) => a.status === 'overdue').length
  const inProgressCount = assignments.filter((a) => a.status === 'in_progress').length

  if (!course) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-text-secondary text-lg">Course not found</p>
          <button
            onClick={() => router.push('/courses')}
            className="mt-4 text-sm text-accent-primary hover:underline"
          >
            Back to courses
          </button>
        </div>
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'files', label: 'Files', icon: Upload },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Color Accent Bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: course.color }}
      />

      {/* Course Header */}
      <div className="px-6 md:px-8 py-6 border-b border-border-subtle">
        <button
          onClick={() => router.push('/courses')}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to courses
        </button>

        <div className="flex items-start gap-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-xl text-3xl"
            style={{ backgroundColor: `${course.color}20` }}
          >
            {course.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{course.title}</h1>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl">
              {course.description}
            </p>
            <p className="text-xs text-text-tertiary mt-2">
              Last updated {formatDate(course.updated_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 md:px-8 border-b border-border-subtle">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === id
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-6 md:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-bg-secondary border border-border-subtle rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{assignments.length}</p>
                    <p className="text-xs text-text-secondary">Total Assignments</p>
                  </div>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-subtle rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{completedCount}</p>
                    <p className="text-xs text-text-secondary">Completed</p>
                  </div>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-subtle rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{inProgressCount}</p>
                    <p className="text-xs text-text-secondary">In Progress</p>
                  </div>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-subtle rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{overdueCount}</p>
                    <p className="text-xs text-text-secondary">Overdue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Assignments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-text-primary">Recent Assignments</h2>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs text-accent-primary hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {assignments.slice(0, 3).map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onClick={() => setActiveTab('assignments')}
                  />
                ))}
                {assignments.length === 0 && (
                  <p className="text-sm text-text-tertiary py-4 text-center">No assignments yet</p>
                )}
              </div>
            </div>

            {/* Recent Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-text-primary">Recent Notes</h2>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="text-xs text-accent-primary hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notes.slice(0, 4).map((note) => (
                  <div
                    key={note.id}
                    className="bg-bg-secondary border border-border-subtle rounded-lg p-4 hover:bg-bg-tertiary transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedNote(note)
                      setActiveTab('notes')
                    }}
                  >
                    <h4 className="text-sm font-medium text-text-primary mb-1 truncate">
                      {note.title}
                    </h4>
                    <p className="text-xs text-text-secondary line-clamp-2">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-text-tertiary py-4 text-center col-span-2">No notes yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="animate-fade-in">
            {/* Status Filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(['all', 'pending', 'in_progress', 'completed', 'overdue'] as AssignmentFilter[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setAssignmentFilter(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      assignmentFilter === status
                        ? 'bg-accent-primary/15 text-accent-primary border border-accent-primary/30'
                        : 'bg-bg-secondary text-text-secondary border border-border-subtle hover:text-text-primary'
                    )}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            {/* Assignments List */}
            <div className="space-y-2">
              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onClick={() => {}}
                />
              ))}
              {filteredAssignments.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                  <BookOpen className="w-8 h-8 text-text-tertiary mb-2" />
                  <p className="text-sm text-text-secondary">No assignments match this filter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="animate-fade-in">
            {selectedNote ? (
              <div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to notes
                </button>
                <div className="bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden">
                  <NoteEditor
                    note={selectedNote}
                    onSave={(updates) => {
                      setSelectedNote((prev) =>
                        prev ? { ...prev, ...updates } : null
                      )
                    }}
                    onSummarize={() => {}}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={cn(
                      'w-full text-left bg-bg-secondary border border-border-subtle rounded-lg p-4',
                      'hover:bg-bg-tertiary transition-colors',
                      note.is_pinned && 'ring-1 ring-accent-primary/30'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {note.is_pinned && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary font-medium">
                          Pinned
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-text-primary mb-1 truncate">
                      {note.title}
                    </h4>
                    <p className="text-xs text-text-secondary line-clamp-3 mb-3">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-text-tertiary mt-2">
                      {formatDate(note.updated_at)}
                    </p>
                  </button>
                ))}
                {notes.length === 0 && (
                  <div className="col-span-full flex flex-col items-center py-12 text-center">
                    <FileText className="w-8 h-8 text-text-tertiary mb-2" />
                    <p className="text-sm text-text-secondary">No notes yet for this course</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="animate-fade-in max-w-2xl">
            <FileUploadZone
              courseId={courseId}
              onUpload={(uploadedFiles) => {
                // In a real app, handle file upload
                console.log('Files uploaded:', uploadedFiles)
              }}
              existingFiles={files}
            />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in">
            <div className="relative border border-border-subtle rounded-lg overflow-hidden h-[600px] [&>div]:!static [&>div]:!w-full [&>div]:!h-full [&>div]:!shadow-none">
              <ChatPanel
                isOpen={true}
                onClose={() => setActiveTab('overview')}
                contextType="course"
                contextId={courseId}
                contextTitle={course.title}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
