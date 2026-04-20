'use client'

import { useMemo } from 'react'
import {
  BookOpen,
  ClipboardList,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Plus,
  Play,
  PenLine,
  GraduationCap,
  CheckCircle2,
  Upload,
  MessageSquare,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { cn, formatDate, formatRelativeTime } from '@/lib/utils'
import AssignmentCard from '@/components/cards/AssignmentCard'
import type { Assignment, Course } from '@/lib/types'

// --- Mock Data ---

const mockUser = {
  full_name: 'Alex',
}

const mockCourses: Course[] = [
  {
    id: 'c1',
    user_id: 'u1',
    title: 'Data Structures & Algorithms',
    description: 'CS 301 - Advanced data structures',
    color: '#8B5CF6',
    icon: '💻',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-04-18T10:00:00Z',
  },
  {
    id: 'c2',
    user_id: 'u1',
    title: 'Linear Algebra',
    description: 'MATH 220 - Vectors and matrices',
    color: '#3B82F6',
    icon: '📐',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-04-17T14:00:00Z',
  },
  {
    id: 'c3',
    user_id: 'u1',
    title: 'Organic Chemistry',
    description: 'CHEM 210 - Molecular structures',
    color: '#10B981',
    icon: '🧪',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-04-19T09:30:00Z',
  },
  {
    id: 'c4',
    user_id: 'u1',
    title: 'Modern History',
    description: 'HIST 150 - 20th Century events',
    color: '#F59E0B',
    icon: '🏛️',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-04-16T11:00:00Z',
  },
]

const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    course_id: 'c1',
    user_id: 'u1',
    title: 'Implement AVL Tree Rotations',
    description: 'Implement all four rotation cases for AVL trees',
    due_date: '2026-04-22T23:59:00Z',
    status: 'in_progress',
    priority: 'high',
    created_at: '2026-04-10T08:00:00Z',
    updated_at: '2026-04-18T15:00:00Z',
  },
  {
    id: 'a2',
    course_id: 'c2',
    user_id: 'u1',
    title: 'Eigenvalue Problem Set',
    description: 'Compute eigenvalues and eigenvectors for given matrices',
    due_date: '2026-04-23T23:59:00Z',
    status: 'pending',
    priority: 'medium',
    created_at: '2026-04-12T08:00:00Z',
    updated_at: '2026-04-12T08:00:00Z',
  },
  {
    id: 'a3',
    course_id: 'c3',
    user_id: 'u1',
    title: 'Lab Report: Synthesis of Aspirin',
    description: 'Complete write-up for aspirin synthesis lab',
    due_date: '2026-04-24T17:00:00Z',
    status: 'pending',
    priority: 'medium',
    created_at: '2026-04-14T08:00:00Z',
    updated_at: '2026-04-14T08:00:00Z',
  },
  {
    id: 'a4',
    course_id: 'c4',
    user_id: 'u1',
    title: 'Essay: Cold War Impact on Europe',
    description: '2000-word essay on post-WWII European reconstruction',
    due_date: '2026-04-25T23:59:00Z',
    status: 'pending',
    priority: 'low',
    created_at: '2026-04-11T08:00:00Z',
    updated_at: '2026-04-11T08:00:00Z',
  },
  {
    id: 'a5',
    course_id: 'c1',
    user_id: 'u1',
    title: 'Graph Traversal Quiz',
    description: 'Online quiz covering BFS and DFS',
    due_date: '2026-04-27T12:00:00Z',
    status: 'pending',
    priority: 'high',
    created_at: '2026-04-15T08:00:00Z',
    updated_at: '2026-04-15T08:00:00Z',
  },
  {
    id: 'a6',
    course_id: 'c2',
    user_id: 'u1',
    title: 'Matrix Transformations Homework',
    description: 'Homework on linear transformations and matrix representations',
    due_date: '2026-04-21T23:59:00Z',
    status: 'overdue',
    priority: 'high',
    created_at: '2026-04-05T08:00:00Z',
    updated_at: '2026-04-20T08:00:00Z',
  },
]

const mockActivities = [
  {
    id: 'act1',
    icon: CheckCircle2,
    label: 'Completed "Linked List Implementation"',
    time: '2026-04-20T09:15:00Z',
    color: 'text-emerald-400',
  },
  {
    id: 'act2',
    icon: Upload,
    label: 'Uploaded lecture notes for Organic Chemistry',
    time: '2026-04-19T22:30:00Z',
    color: 'text-blue-400',
  },
  {
    id: 'act3',
    icon: PenLine,
    label: 'Created note "Eigenvalues Summary"',
    time: '2026-04-19T18:45:00Z',
    color: 'text-purple-400',
  },
  {
    id: 'act4',
    icon: MessageSquare,
    label: 'AI Tutor session: Graph Theory basics',
    time: '2026-04-19T14:00:00Z',
    color: 'text-amber-400',
  },
  {
    id: 'act5',
    icon: Play,
    label: 'Studied Linear Algebra for 45 minutes',
    time: '2026-04-18T20:00:00Z',
    color: 'text-cyan-400',
  },
]

const mockStudyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.0 },
  { day: 'Fri', hours: 4.1 },
  { day: 'Sat', hours: 1.5 },
  { day: 'Sun', hours: 2.8 },
]

// --- Component ---

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendUp,
  className,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  value: string | number
  label: string
  trend: string
  trendUp: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-bg-secondary border border-border-subtle rounded-lg p-5',
        'transition-all duration-200 hover:border-border-default',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon size={18} className="text-text-tertiary" />
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trendUp ? 'text-emerald-400' : 'text-red-400'
          )}
        >
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trend}</span>
        </div>
      </div>
      <p className="text-2xl font-semibold text-text-primary mb-1">{value}</p>
      <p className="text-xs text-text-tertiary">{label}</p>
    </div>
  )
}

export default function DashboardPage() {
  const greeting = useMemo(() => getGreeting(), [])
  const todayFormatted = format(new Date(), 'EEEE, MMMM d, yyyy')

  const upcomingAssignments = useMemo(
    () =>
      [...mockAssignments]
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        .slice(0, 5),
    []
  )

  const getCourseForAssignment = (courseId: string) =>
    mockCourses.find((c) => c.id === courseId)

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <section className="mb-8 opacity-0 animate-fade-in stagger-1">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          {greeting}, {mockUser.full_name}
        </h1>
        <p className="text-sm text-text-secondary">{todayFormatted}</p>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 opacity-0 animate-fade-in stagger-2">
        <StatCard
          icon={BookOpen}
          value={mockCourses.length}
          label="Total Courses"
          trend="+1 this month"
          trendUp={true}
        />
        <StatCard
          icon={ClipboardList}
          value={mockAssignments.filter((a) => a.status !== 'completed').length}
          label="Active Assignments"
          trend="+3 this week"
          trendUp={true}
        />
        <StatCard
          icon={Clock}
          value="17.9"
          label="Study Hours This Week"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={FileText}
          value={24}
          label="Notes Created"
          trend="+5 this week"
          trendUp={true}
        />
      </section>

      {/* Middle Row: Recent Activity + Study Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-bg-secondary border border-border-subtle rounded-lg p-5 opacity-0 animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
            <button className="text-xs text-accent-primary hover:text-accent-primary-hover transition-colors">
              View all
            </button>
          </div>
          <ul className="space-y-3">
            {mockActivities.map((activity) => {
              const IconComp = activity.icon
              return (
                <li key={activity.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg bg-bg-tertiary',
                      activity.color
                    )}
                  >
                    <IconComp size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{activity.label}</p>
                  </div>
                  <span className="text-xs text-text-tertiary whitespace-nowrap">
                    {formatRelativeTime(activity.time)}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Study Progress Chart */}
        <section className="bg-bg-secondary border border-border-subtle rounded-lg p-5 opacity-0 animate-fade-in stagger-4">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Study Hours (7 days)</h2>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockStudyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#studyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-text-tertiary">
            {mockStudyData.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </section>
      </div>

      {/* Upcoming Assignments */}
      <section className="mb-8 opacity-0 animate-fade-in stagger-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Upcoming Assignments</h2>
          <button className="text-xs text-accent-primary hover:text-accent-primary-hover transition-colors">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {upcomingAssignments.map((assignment) => {
            const course = getCourseForAssignment(assignment.course_id)
            return (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                courseName={course?.title}
                courseColor={course?.color}
                onClick={() => {}}
              />
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="opacity-0 animate-fade-in stagger-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors duration-150 group">
            <Plus size={20} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              New Course
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors duration-150 group">
            <ClipboardList size={20} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              New Assignment
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors duration-150 group">
            <PenLine size={20} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              New Note
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-tertiary hover:bg-bg-hover rounded-lg transition-colors duration-150 group">
            <GraduationCap size={20} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              Start Study Session
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
