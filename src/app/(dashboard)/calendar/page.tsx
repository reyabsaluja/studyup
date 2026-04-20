'use client'

import { useState, useMemo } from 'react'
import { format, addDays, startOfMonth, setHours, setMinutes } from 'date-fns'
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  BookOpen,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn, formatDate, generateId } from '@/lib/utils'
import CalendarView from '@/components/calendar/CalendarView'
import type { CalendarEvent, Assignment } from '@/lib/types'

// --- Mock Data ---
const now = new Date()
const monthStart = startOfMonth(now)

const mockEvents: CalendarEvent[] = [
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Study Group: Linear Algebra',
    description: 'Review eigenvalues and eigenvectors with study group.',
    start_date: addDays(monthStart, 2).toISOString(),
    end_date: addDays(monthStart, 2).toISOString(),
    event_type: 'study_session',
    related_id: null,
    color: '#3B82F6',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Midterm: Data Structures',
    description: 'CS201 midterm exam covering trees, graphs, and hash maps.',
    start_date: addDays(monthStart, 7).toISOString(),
    end_date: addDays(monthStart, 7).toISOString(),
    event_type: 'assignment_due',
    related_id: null,
    color: '#EF4444',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Office Hours: Prof. Chen',
    description: 'Discuss final project topic for AI course.',
    start_date: addDays(monthStart, 10).toISOString(),
    end_date: addDays(monthStart, 10).toISOString(),
    event_type: 'custom',
    related_id: null,
    color: '#8B5CF6',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Deep Work: Neural Networks',
    description: 'Focus session on backpropagation and gradient descent.',
    start_date: addDays(monthStart, 14).toISOString(),
    end_date: addDays(monthStart, 14).toISOString(),
    event_type: 'study_session',
    related_id: null,
    color: '#3B82F6',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Lab Report Due',
    description: 'Physics lab report on electromagnetic induction.',
    start_date: addDays(monthStart, 18).toISOString(),
    end_date: addDays(monthStart, 18).toISOString(),
    event_type: 'assignment_due',
    related_id: null,
    color: '#EF4444',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Study Session: Organic Chemistry',
    description: 'Review reaction mechanisms and stereochemistry.',
    start_date: addDays(monthStart, 21).toISOString(),
    end_date: addDays(monthStart, 21).toISOString(),
    event_type: 'study_session',
    related_id: null,
    color: '#3B82F6',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Project Presentation',
    description: 'Final project presentation for Software Engineering.',
    start_date: addDays(monthStart, 25).toISOString(),
    end_date: addDays(monthStart, 25).toISOString(),
    event_type: 'assignment_due',
    related_id: null,
    color: '#EF4444',
    created_at: now.toISOString(),
  },
  {
    id: generateId(),
    user_id: 'user-1',
    title: 'Flashcard Review',
    description: 'Spaced repetition review for vocabulary.',
    start_date: addDays(monthStart, 28).toISOString(),
    end_date: addDays(monthStart, 28).toISOString(),
    event_type: 'study_session',
    related_id: null,
    color: '#3B82F6',
    created_at: now.toISOString(),
  },
]

const mockAssignments: Assignment[] = [
  {
    id: generateId(),
    course_id: 'course-1',
    user_id: 'user-1',
    title: 'Problem Set 4: Recursion',
    description: 'Complete all recursive algorithm exercises.',
    due_date: addDays(monthStart, 5).toISOString(),
    status: 'pending',
    priority: 'high',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  },
  {
    id: generateId(),
    course_id: 'course-2',
    user_id: 'user-1',
    title: 'Essay: Modernist Literature',
    description: '2000-word essay on stream of consciousness narrative.',
    due_date: addDays(monthStart, 12).toISOString(),
    status: 'in_progress',
    priority: 'medium',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  },
  {
    id: generateId(),
    course_id: 'course-3',
    user_id: 'user-1',
    title: 'Calculus Integration Quiz',
    description: 'Online quiz covering integration by parts.',
    due_date: addDays(monthStart, 20).toISOString(),
    status: 'pending',
    priority: 'medium',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  },
]

type ViewMode = 'month' | 'week'

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDate, setFormDate] = useState(format(now, 'yyyy-MM-dd'))
  const [formTime, setFormTime] = useState('09:00')
  const [formType, setFormType] = useState<'custom' | 'study_session'>('custom')
  const [formDescription, setFormDescription] = useState('')

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return events.filter((event) => {
      const eventDate = new Date(event.start_date)
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      )
    })
  }, [selectedDate, events])

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => new Date(event.start_date) >= now)
      .sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      )
      .slice(0, 5)
  }, [events])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    // Could open event detail modal
  }

  const handleCreateEvent = () => {
    if (!formTitle.trim()) return

    const [hours, minutes] = formTime.split(':').map(Number)
    const eventDate = setMinutes(setHours(new Date(formDate), hours), minutes)

    const newEvent: CalendarEvent = {
      id: generateId(),
      user_id: 'user-1',
      title: formTitle,
      description: formDescription,
      start_date: eventDate.toISOString(),
      end_date: eventDate.toISOString(),
      event_type: formType,
      related_id: null,
      color: formType === 'study_session' ? '#3B82F6' : '#8B5CF6',
      created_at: now.toISOString(),
    }

    setEvents((prev) => [...prev, newEvent])
    setFormTitle('')
    setFormDate(format(now, 'yyyy-MM-dd'))
    setFormTime('09:00')
    setFormType('custom')
    setFormDescription('')
    setShowCreateForm(false)
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'study_session':
        return <BookOpen className="h-3.5 w-3.5" />
      case 'assignment_due':
        return <Clock className="h-3.5 w-3.5" />
      default:
        return <CalendarIcon className="h-3.5 w-3.5" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'study_session':
        return 'text-blue-400'
      case 'assignment_due':
        return 'text-red-400'
      default:
        return 'text-purple-400'
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-[var(--accent-primary)]" />
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Calendar
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {format(now, 'MMMM yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-0.5">
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'month'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'week'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              Week
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <CalendarView
            events={events}
            assignments={mockAssignments}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />

          {/* Upcoming Events (mobile quick view) */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 transition-colors hover:bg-[var(--bg-tertiary)]"
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]',
                      getEventTypeColor(event.event_type)
                    )}
                  >
                    {getEventTypeIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {formatDate(event.start_date, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--text-disabled)]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Date Events */}
        <div className="w-[300px] border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 overflow-y-auto animate-slide-in-right stagger-2" style={{ opacity: 0 }}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            {selectedDate
              ? formatDate(selectedDate, 'EEEE, MMM d')
              : 'Select a Date'}
          </h3>

          {selectedDate && eventsForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-3"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="mt-1 h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-tertiary)] line-clamp-2">
                        {event.description}
                      </p>
                      <p className="mt-2 text-xs text-[var(--text-secondary)]">
                        {formatDate(event.start_date, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="mb-3 h-8 w-8 text-[var(--text-disabled)]" />
              <p className="text-sm text-[var(--text-tertiary)]">
                No events on this date
              </p>
              <button
                onClick={() => {
                  setFormDate(format(selectedDate, 'yyyy-MM-dd'))
                  setShowCreateForm(true)
                }}
                className="mt-3 text-xs font-medium text-[var(--accent-primary)] hover:underline"
              >
                + Add an event
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="mb-3 h-8 w-8 text-[var(--text-disabled)]" />
              <p className="text-sm text-[var(--text-tertiary)]">
                Click a date to see events
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Creation Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-lg animate-scale-in">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Create Event
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-md p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Event title..."
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Type
                </label>
                <select
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as 'custom' | 'study_session')
                  }
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  <option value="custom">Custom Event</option>
                  <option value="study_session">Study Session</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!formTitle.trim()}
                  className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
