'use client'

import { useState, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { CalendarEvent, Assignment } from '@/lib/types'

interface CalendarViewProps {
  events: CalendarEvent[]
  assignments: Assignment[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export default function CalendarView({
  events,
  assignments,
  onDateClick,
  onEventClick,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start_date), day))
  }

  const getAssignmentsForDay = (day: Date) => {
    return assignments.filter((assignment) =>
      isSameDay(new Date(assignment.due_date), day)
    )
  }

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDay(day)
    const dayAssignments = getAssignmentsForDay(day)

    if (dayEvents.length > 0 || dayAssignments.length > 0) {
      setSelectedDate(isSameDay(day, selectedDate ?? new Date(0)) ? null : day)
    } else {
      setSelectedDate(null)
    }

    onDateClick(day)
  }

  const getEventDotColor = (eventType: string) => {
    switch (eventType) {
      case 'assignment_due':
        return 'bg-red-400'
      case 'study_session':
        return 'bg-blue-400'
      case 'custom':
        return 'bg-purple-400'
      default:
        return 'bg-zinc-400'
    }
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="w-full">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-[var(--color-text-secondary)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dayEvents = getEventsForDay(day)
          const dayAssignments = getAssignmentsForDay(day)
          const hasItems = dayEvents.length > 0 || dayAssignments.length > 0
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isDayToday = isToday(day)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

          return (
            <div key={day.toISOString()} className="relative">
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  'w-full aspect-square flex flex-col items-center justify-start p-1.5 rounded-lg transition-all',
                  'hover:bg-[var(--color-bg-tertiary)]',
                  !isCurrentMonth && 'text-[var(--color-text-disabled)]',
                  isCurrentMonth && 'text-[var(--color-text-primary)]',
                  isDayToday &&
                    'ring-2 ring-[var(--color-accent-primary)] ring-inset',
                  isSelected && 'bg-[var(--color-bg-tertiary)]'
                )}
              >
                <span className="text-sm font-medium">{format(day, 'd')}</span>

                {/* Event dots */}
                {hasItems && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          getEventDotColor(event.event_type)
                        )}
                      />
                    ))}
                    {dayAssignments.slice(0, 3).map((assignment) => (
                      <span
                        key={assignment.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#EF4444' }}
                      />
                    ))}
                  </div>
                )}
              </button>

              {/* Popover for selected date */}
              {isSelected && hasItems && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 w-56 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg shadow-lg p-3">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                    {formatDate(day, 'MMM d, yyyy')}
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {dayEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                        className="w-full text-left flex items-center gap-2 p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            getEventDotColor(event.event_type)
                          )}
                        />
                        <span className="text-xs text-[var(--color-text-primary)] truncate">
                          {event.title}
                        </span>
                      </button>
                    ))}
                    {dayAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-2 p-1.5 rounded"
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0 bg-red-400" />
                        <span className="text-xs text-[var(--color-text-primary)] truncate">
                          {assignment.title} (due)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
