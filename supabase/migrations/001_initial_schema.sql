-- StudyUp Initial Database Schema
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Function for auto-updating updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Profiles table
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Courses table
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT NOT NULL DEFAULT '📚',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Assignments table
-- ============================================
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Notes table
-- ============================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Chat Messages table
-- ============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context_type TEXT NOT NULL DEFAULT 'general' CHECK (context_type IN ('course', 'assignment', 'general')),
  context_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Study Sessions table
-- ============================================
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- File Uploads table
-- ============================================
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  s3_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Study Plans table
-- ============================================
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  plan JSONB NOT NULL DEFAULT '[]',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Calendar Events table
-- ============================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'custom' CHECK (event_type IN ('assignment_due', 'study_session', 'custom')),
  related_id UUID,
  color TEXT NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Activity Logs table
-- ============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_courses_user_id ON courses(user_id);
CREATE INDEX idx_courses_created_at ON courses(created_at);

CREATE INDEX idx_assignments_user_id ON assignments(user_id);
CREATE INDEX idx_assignments_course_id ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_created_at ON assignments(created_at);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_course_id ON notes(course_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_course_id ON study_sessions(course_id);

CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_course_id ON file_uploads(course_id);

CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX idx_study_plans_course_id ON study_plans(course_id);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_date ON calendar_events(start_date);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own courses"
  ON courses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses"
  ON courses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
  ON courses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
  ON courses FOR DELETE USING (auth.uid() = user_id);

-- Assignments
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assignments"
  ON assignments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assignments"
  ON assignments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments"
  ON assignments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assignments"
  ON assignments FOR DELETE USING (auth.uid() = user_id);

-- Notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE USING (auth.uid() = user_id);

-- Chat Messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
  ON chat_messages FOR DELETE USING (auth.uid() = user_id);

-- Study Sessions
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sessions"
  ON study_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions"
  ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON study_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions"
  ON study_sessions FOR DELETE USING (auth.uid() = user_id);

-- File Uploads
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own file uploads"
  ON file_uploads FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file uploads"
  ON file_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads"
  ON file_uploads FOR DELETE USING (auth.uid() = user_id);

-- Study Plans
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study plans"
  ON study_plans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study plans"
  ON study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
  ON study_plans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
  ON study_plans FOR DELETE USING (auth.uid() = user_id);

-- Calendar Events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calendar events"
  ON calendar_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs"
  ON activity_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity logs"
  ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
