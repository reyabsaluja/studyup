import { v4 as uuidv4 } from 'uuid'
import { format, formatDistanceToNow } from 'date-fns'

import type { AssignmentStatus, AssignmentPriority } from './types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, formatStr)
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function getStatusColor(status: AssignmentStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
    case 'in_progress':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
    case 'overdue':
      return 'bg-red-500/15 text-red-400 border border-red-500/20'
    default:
      return 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
  }
}

export function getPriorityColor(priority: AssignmentPriority): string {
  switch (priority) {
    case 'low':
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
    case 'medium':
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
    case 'high':
      return 'bg-red-500/15 text-red-400 border border-red-500/20'
    default:
      return 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '\u2026'
}

export function generateId(): string {
  return uuidv4()
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

export function fileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export const COURSE_COLORS = [
  '#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4',
  '#10B981', '#F59E0B', '#EF4444', '#EC4899',
  '#F97316', '#14B8A6', '#A855F7', '#6D28D9',
]

export const COURSE_ICONS = [
  '📚', '🧪', '🔬', '💻', '🎨', '📐', '🌍', '📊',
  '🎵', '🏛️', '⚡', '🧠', '📝', '🔢', '🧬', '🌱',
]
