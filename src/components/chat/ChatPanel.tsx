'use client'

import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { ArrowUp, X, Sparkles, BookOpen, FileText, BrainCircuit } from 'lucide-react'
import { useChatStore } from '@/lib/stores/chat-store'
import { cn } from '@/lib/utils'
import { ChatContextType } from '@/lib/types'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
  contextType?: ChatContextType
  contextId?: string | null
  contextTitle?: string
}

const quickActions = [
  { label: 'Generate Study Plan', icon: BookOpen },
  { label: 'Summarize Notes', icon: FileText },
  { label: 'Quiz Me', icon: BrainCircuit },
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-text-secondary animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-text-secondary animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-text-secondary animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default function ChatPanel({
  isOpen,
  onClose,
  contextType = 'general',
  contextId = null,
  contextTitle,
}: ChatPanelProps) {
  const { messages, loading, setContext, sendMessage } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setContext(contextType, contextId)
  }, [contextType, contextId, setContext])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`
    }
  }, [input])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setInput('')
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (label: string) => {
    setInput(label)
    textareaRef.current?.focus()
  }

  const contextBadgeLabel = contextTitle
    ? `Chatting about: ${contextTitle}`
    : contextType === 'general'
      ? 'General Chat'
      : `Chatting about: ${contextType}`

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 z-50 flex w-[400px] flex-col',
        'bg-bg-secondary border-l border-border-subtle shadow-2xl',
        'animate-slide-in-right'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-primary" />
          <h2 className="text-sm font-semibold text-text-primary">AI Tutor</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Context Badge */}
      <div className="px-4 py-2 border-b border-border-subtle">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          {contextBadgeLabel}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="rounded-full bg-accent-primary/10 p-4 mb-4">
              <Sparkles className="h-8 w-8 text-accent-primary" />
            </div>
            <p className="text-sm text-text-secondary mb-1">Ask your AI tutor anything...</p>
            <p className="text-xs text-text-tertiary">
              Get help with concepts, study plans, and more.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'animate-fade-in max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'ml-auto bg-accent-primary/15 text-text-primary'
                    : 'mr-auto bg-bg-tertiary text-text-primary'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="mr-auto max-w-[85%] rounded-xl bg-bg-tertiary">
                <TypingIndicator />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 px-4 pb-2 flex-wrap">
        {quickActions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleQuickAction(label)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5',
              'bg-bg-tertiary border border-border-default text-xs text-text-secondary',
              'hover:border-accent-primary hover:text-accent-primary transition-colors'
            )}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-border-subtle px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message your AI tutor..."
            rows={1}
            className={cn(
              'flex-1 resize-none rounded-lg px-3 py-2 text-sm',
              'bg-bg-tertiary border border-border-default text-text-primary',
              'placeholder:text-text-tertiary',
              'focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/50',
              'transition-colors'
            )}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
              input.trim() && !loading
                ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
                : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
