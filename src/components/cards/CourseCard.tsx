'use client'

import { BookOpen, FileText } from 'lucide-react'
import { cn, truncate } from '@/lib/utils'
import type { Course } from '@/lib/types'

interface CourseCardProps {
  course: Course
  assignmentCount: number
  noteCount: number
  onClick: () => void
}

export default function CourseCard({
  course,
  assignmentCount,
  noteCount,
  onClick,
}: CourseCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg',
        'p-5 transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
        'animate-fade-in'
      )}
      style={{ borderLeftWidth: '4px', borderLeftColor: course.color }}
    >
      {/* Course Icon */}
      <div className="text-3xl mb-3">{course.icon}</div>

      {/* Title */}
      <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
        {course.title}
      </h3>

      {/* Description (truncated 2 lines) */}
      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
        {truncate(course.description, 100)}
      </p>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>
            {assignmentCount} assignment{assignmentCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>
            {noteCount} note{noteCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </button>
  )
}
