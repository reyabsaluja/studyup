'use client'

import {
  Settings,
  User,
  Palette,
  LayoutDashboard,
  Brain,
  Database,
  Cloud,
  Server,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Mock User Data ---
const mockUser = {
  full_name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatar_url: '',
}

interface IntegrationStatus {
  name: string
  description: string
  icon: React.ReactNode
  status: 'connected' | 'disconnected' | 'pending'
}

const integrations: IntegrationStatus[] = [
  {
    name: 'Supabase',
    description: 'PostgreSQL database and auth',
    icon: <Database className="h-5 w-5" />,
    status: 'connected',
  },
  {
    name: 'AWS S3',
    description: 'File storage and CDN',
    icon: <Cloud className="h-5 w-5" />,
    status: 'connected',
  },
  {
    name: 'Redis',
    description: 'Caching and rate limiting',
    icon: <Server className="h-5 w-5" />,
    status: 'disconnected',
  },
]

function getStatusBadge(status: IntegrationStatus['status']) {
  switch (status) {
    case 'connected':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" />
          Connected
        </span>
      )
    case 'disconnected':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 border border-red-500/20">
          <XCircle className="h-3 w-3" />
          Disconnected
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
          Pending
        </span>
      )
  }
}

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-6 py-4 animate-fade-in">
        <Settings className="h-6 w-6 text-[var(--accent-primary)]" />
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Settings
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-3xl">
        {/* Profile Section */}
        <div
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-1"
          style={{ opacity: 0 }}
        >
          <h2 className="mb-5 text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <User className="h-5 w-5 text-[var(--text-secondary)]" />
            Profile
          </h2>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-xl font-bold text-white">
              {mockUser.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                {mockUser.full_name}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {mockUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-2"
          style={{ opacity: 0 }}
        >
          <h2 className="mb-5 text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Palette className="h-5 w-5 text-[var(--text-secondary)]" />
            Preferences
          </h2>
          <div className="space-y-5">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Theme
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Choose your visual preference
                </p>
              </div>
              <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-0.5">
                <button className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  Light
                </button>
                <button className="rounded-md bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-medium text-white">
                  Dark
                </button>
                <button className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  System
                </button>
              </div>
            </div>

            {/* Default View */}
            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-5">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Default View
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Landing page after login
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-3 py-1.5">
                <LayoutDashboard className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  Dashboard
                </span>
              </div>
            </div>

            {/* AI Model */}
            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-5">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  AI Model
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Model used for AI-powered features
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-3 py-1.5">
                <Brain className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  Claude Sonnet 4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-3"
          style={{ opacity: 0 }}
        >
          <h2 className="mb-5 text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Server className="h-5 w-5 text-[var(--text-secondary)]" />
            Integrations
          </h2>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                    {integration.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {integration.name}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {integration.description}
                    </p>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className="rounded-xl border border-red-500/20 bg-[var(--bg-secondary)] p-6 animate-fade-in stagger-4"
          style={{ opacity: 0 }}
        >
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            Danger Zone
          </h2>
          <p className="mb-4 text-sm text-[var(--text-tertiary)]">
            Irreversible actions that permanently affect your account.
          </p>
          <button
            disabled
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 opacity-60 cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
          <p className="mt-2 text-xs text-[var(--text-disabled)]">
            Account deletion is currently disabled during beta.
          </p>
        </div>
      </div>
    </div>
  )
}
