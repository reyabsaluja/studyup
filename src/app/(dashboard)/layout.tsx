'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import ChatPanel from '@/components/chat/ChatPanel'
import { useAppStore } from '@/lib/stores/app-store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarCollapsed } = useAppStore()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'ml-[60px]' : 'ml-[260px]'
        )}
      >
        <div className="h-screen overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Chat Panel Overlay */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating AI Tutor Button */}
      <button
        onClick={() => setChatOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-30',
          'flex items-center justify-center w-14 h-14 rounded-full',
          'bg-gradient-to-br from-accent-primary to-accent-secondary',
          'text-white shadow-lg',
          'hover:scale-105 active:scale-95',
          'transition-transform duration-200',
          'animate-pulse-glow',
          chatOpen && 'hidden'
        )}
        aria-label="Open AI Tutor"
      >
        <Sparkles size={22} />
      </button>
    </div>
  )
}
