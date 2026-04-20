'use client'

import { useState, useMemo } from 'react'
import {
  BarChart3,
  Clock,
  Flame,
  BookOpen,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts'
import type { AnalyticsData } from '@/lib/types'

// --- Mock Data: 30 days of study data ---
function generateStudyData(): AnalyticsData[] {
  const data: AnalyticsData[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    // Weekend = less study, weekdays = more
    const baseHours = dayOfWeek === 0 || dayOfWeek === 6 ? 1.5 : 3.5
    const variance = (Math.random() - 0.3) * 2
    const value = Math.max(0, Math.round((baseHours + variance) * 10) / 10)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value,
      label: `${value} hours`,
    })
  }
  return data
}

function generateActivityData(): AnalyticsData[] {
  const data: AnalyticsData[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const value = Math.floor(Math.random() * 8) + 1
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value,
      label: `${value} actions`,
    })
  }
  return data
}

const courseDistribution = [
  { name: 'Data Structures', value: 32, color: '#8B5CF6' },
  { name: 'Linear Algebra', value: 24, color: '#6366F1' },
  { name: 'Machine Learning', value: 20, color: '#3B82F6' },
  { name: 'Organic Chemistry', value: 14, color: '#10B981' },
  { name: 'English Literature', value: 10, color: '#F59E0B' },
]

const courseRankings = [
  { name: 'Data Structures', hours: 32, color: '#8B5CF6' },
  { name: 'Linear Algebra', hours: 24, color: '#6366F1' },
  { name: 'Machine Learning', hours: 20, color: '#3B82F6' },
  { name: 'Organic Chemistry', hours: 14, color: '#10B981' },
  { name: 'English Literature', hours: 10, color: '#F59E0B' },
]

type DateRange = 'week' | 'month' | 'semester' | 'custom'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('month')

  const studyData = useMemo(() => generateStudyData(), [])
  const activityData = useMemo(() => generateActivityData(), [])

  const totalHours = useMemo(
    () => Math.round(studyData.reduce((sum, d) => sum + d.value, 0) * 10) / 10,
    [studyData]
  )
  const avgDaily = useMemo(
    () => Math.round((totalHours / 30) * 10) / 10,
    [totalHours]
  )
  const longestStreak = 12
  const coursesActive = 5

  // Assignment completion
  const totalAssignments = 18
  const completedAssignments = 13
  const completionRate = Math.round((completedAssignments / totalAssignments) * 100)

  // Weekly goal
  const weeklyGoalHours = 25
  const weeklyActualHours = 19.5
  const weeklyProgress = Math.min(100, Math.round((weeklyActualHours / weeklyGoalHours) * 100))

  const stats = [
    {
      label: 'Total Study Hours',
      value: `${totalHours}h`,
      icon: Clock,
      color: 'text-[var(--accent-primary)]',
      bgColor: 'bg-[rgba(139,92,246,0.1)]',
    },
    {
      label: 'Average Daily',
      value: `${avgDaily}h`,
      icon: TrendingUp,
      color: 'text-[var(--accent-info)]',
      bgColor: 'bg-[rgba(59,130,246,0.1)]',
    },
    {
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      icon: Flame,
      color: 'text-[var(--accent-warning)]',
      bgColor: 'bg-[rgba(245,158,11,0.1)]',
    },
    {
      label: 'Courses Active',
      value: `${coursesActive}`,
      icon: BookOpen,
      color: 'text-[var(--accent-success)]',
      bgColor: 'bg-[rgba(16,185,129,0.1)]',
    },
  ]

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
    { value: 'custom', label: 'Custom' },
  ]

  // SVG circular progress
  const circleRadius = 54
  const circleCircumference = 2 * Math.PI * circleRadius
  const circleOffset = circleCircumference - (weeklyProgress / 100) * circleCircumference

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-[var(--accent-primary)]" />
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Analytics
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Track your study performance and progress
            </p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-0.5">
          {dateRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                dateRange === option.value
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 animate-fade-in',
                  `stagger-${index + 1}`
                )}
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      stat.bgColor
                    )}
                  >
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="animate-fade-in stagger-5" style={{ opacity: 0 }}>
          <AnalyticsCharts
            studyData={studyData}
            activityData={activityData}
            courseDistribution={courseDistribution}
          />
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Assignment Completion Rate */}
          <div
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-6"
            style={{ opacity: 0 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Assignment Completion
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">
                  {completedAssignments} of {totalAssignments} completed
                </span>
                <span className="text-sm font-medium text-[var(--accent-success)]">
                  {completionRate}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-success)] transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-[var(--accent-success)]">
                    {completedAssignments}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">Done</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[var(--accent-warning)]">
                    {totalAssignments - completedAssignments - 2}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[var(--text-secondary)]">2</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Most Studied Courses */}
          <div
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-7"
            style={{ opacity: 0 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Most Studied Courses
            </h3>
            <div className="space-y-3">
              {courseRankings.map((course, index) => (
                <div key={course.name} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-xs font-bold text-[var(--text-secondary)]">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {course.name}
                      </p>
                      <span className="text-xs text-[var(--text-tertiary)] ml-2">
                        {course.hours}h
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(course.hours / courseRankings[0].hours) * 100}%`,
                          backgroundColor: course.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-8"
            style={{ opacity: 0 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Weekly Goal
            </h3>
            <div className="flex flex-col items-center">
              {/* Circular Progress SVG */}
              <div className="relative">
                <svg width="140" height="140" className="-rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r={circleRadius}
                    fill="none"
                    stroke="var(--bg-tertiary)"
                    strokeWidth="10"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r={circleRadius}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleOffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">
                    {weeklyProgress}%
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    complete
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {weeklyActualHours}h
                  </span>{' '}
                  of {weeklyGoalHours}h goal
                </p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  {Math.round(weeklyGoalHours - weeklyActualHours)}h remaining
                  this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
