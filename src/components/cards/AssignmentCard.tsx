'use client'

import { Calendar, Circle, CheckCircle2 } from 'lucide-react'
import { cn, formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'
import type { Assignment } from '@/lib/types'

interface AssignmentCardProps {
  assignment: Assignment
  courseName?: string
  courseColor?: string
  onClick: () => void
}

export default function AssignmentCard({
  assignment,
  courseName,
  courseColor,
  onClick,
}: AssignmentCardProps) {
  const isOverdue = assignment.status === 'overdue'
  const isCompleted = assignment.status === 'completed'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg',
        'p-4 transition-all duration-200 hover:bg-[var(--color-bg-tertiary)]',
        isOverdue && 'border-l-4 border-l-red-500'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox-style status toggle area */}
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle
              className={cn(
                'w-5 h-5',
                isOverdue ? 'text-red-400' : 'text-[var(--color-text-secondary)]'
              )}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row: badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                getStatusColor(assignment.status)
              )}
            >
              {assignment.status.replace('_', ' ')}
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                getPriorityColor(assignment.priority)
              )}
            >
              {assignment.priority}
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              'text-sm font-medium mb-1',
              isCompleted
                ? 'text-[var(--color-text-secondary)] line-through'
                : 'text-[var(--color-text-primary)]'
            )}
          >
            {assignment.title}
          </h3>

          {/* Course name */}
          {courseName && (
            <div className="flex items-center gap-1.5 mb-1.5">
              {courseColor && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: courseColor }}
                />
              )}
              <span className="text-xs text-[var(--color-text-secondary)]">
                {courseName}
              </span>
            </div>
          )}

          {/* Due date */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Calendar className="w-3.5 h-3.5" />
            <span className={cn(isOverdue && 'text-red-400')}>
              {formatDate(assignment.due_date)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
