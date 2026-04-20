'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileText,
  Calendar,
  BarChart3,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/lib/stores/app-store'
import { useCourseStore } from '@/lib/stores/course-store'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Courses', href: '/courses', icon: <BookOpen size={20} /> },
  { label: 'Assignments', href: '/assignments', icon: <ClipboardList size={20} /> },
  { label: 'Notes', href: '/notes', icon: <FileText size={20} /> },
  { label: 'Calendar', href: '/calendar', icon: <Calendar size={20} /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Uploads', href: '/uploads', icon: <Upload size={20} /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleCollapsed } = useAppStore()
  const { courses } = useCourseStore()

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40
        bg-bg-secondary border-r border-border-subtle
        flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-[60px]' : 'w-[260px]'}
      `}
    >
      {/* Logo / Brand */}
      <div className="flex items-center h-[56px] px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <span
              className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              StudyUp
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)]
                    transition-all duration-150 group
                    ${isActive
                      ? 'bg-bg-active text-text-primary'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-accent-primary" />
                  )}
                  <span className="shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Courses Section */}
        {!sidebarCollapsed && courses.length > 0 && (
          <div className="mt-6 px-3">
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
              Courses
            </p>
            <ul className="space-y-1">
              {courses.map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/courses/${course.id}`}
                    className={`
                      flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)]
                      text-sm transition-all duration-150 truncate
                      ${pathname === `/courses/${course.id}`
                        ? 'text-text-primary bg-bg-active'
                        : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                      }
                    `}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="truncate">{course.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 p-2 border-t border-border-subtle space-y-2">
        {/* AI Tutor Button */}
        <Link
          href="/ai-tutor"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
            bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10
            border border-accent-primary/20
            text-text-primary hover:from-accent-primary/20 hover:to-accent-secondary/20
            transition-all duration-200 group
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <Sparkles size={18} className="text-accent-primary shrink-0 group-hover:animate-pulse" />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">AI Tutor</span>
          )}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapsed}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] w-full
            text-text-tertiary hover:text-text-secondary hover:bg-bg-hover
            transition-all duration-150
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && (
            <span className="text-xs">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  )
}
