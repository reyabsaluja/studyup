// ===== StudyUp Type Definitions =====

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
  created_at: string
}

export interface Course {
  id: string
  user_id: string
  title: string
  description: string
  color: string // hex
  icon: string // emoji
  created_at: string
  updated_at: string
}

export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type AssignmentPriority = 'low' | 'medium' | 'high'

export interface Assignment {
  id: string
  course_id: string
  user_id: string
  title: string
  description: string
  due_date: string
  status: AssignmentStatus
  priority: AssignmentPriority
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  course_id: string | null
  assignment_id: string | null
  title: string
  content: string
  tags: string[]
  summary: string | null // AI generated
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export type ChatRole = 'user' | 'assistant'
export type ChatContextType = 'course' | 'assignment' | 'general'

export interface ChatMessage {
  id: string
  user_id: string
  role: ChatRole
  content: string
  context_type: ChatContextType
  context_id: string | null
  created_at: string
}

export interface StudySession {
  id: string
  user_id: string
  course_id: string | null
  started_at: string
  ended_at: string | null
  duration_minutes: number
  notes: string | null
}

export interface FileUpload {
  id: string
  user_id: string
  course_id: string | null
  assignment_id: string | null
  file_name: string
  file_size: number
  file_type: string
  storage_path: string
  s3_key: string | null
  created_at: string
}

export interface StudyPlanItem {
  topic: string
  duration: number
  priority: string
  completed: boolean
}

export interface StudyPlan {
  id: string
  user_id: string
  course_id: string | null
  title: string
  plan: StudyPlanItem[]
  generated_at: string
  created_at: string
}

export type CalendarEventType = 'assignment_due' | 'study_session' | 'custom'

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  description: string
  start_date: string
  end_date: string
  event_type: CalendarEventType
  related_id: string | null
  color: string
  created_at: string
}

export interface AnalyticsData {
  date: string
  value: number
  label: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown>
  created_at: string
}
