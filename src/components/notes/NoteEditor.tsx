"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Pin, PinOff, X, Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note } from "@/lib/types"

interface NoteEditorProps {
  note: Note
  onSave: (note: Partial<Note>) => void
  onSummarize?: () => void
}

export default function NoteEditor({ note, onSave, onSummarize }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags)
  const [tagInput, setTagInput] = useState("")
  const [isPinned, setIsPinned] = useState(note.is_pinned)
  const [summaryOpen, setSummaryOpen] = useState(true)

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  // Sync state when note prop changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags)
    setIsPinned(note.is_pinned)
  }, [note.id, note.title, note.content, note.tags, note.is_pinned])

  // Debounced autosave for title and content
  const debouncedSave = useCallback(
    (updates: Partial<Note>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(() => {
        onSave(updates)
      }, 1000)
    },
    [onSave]
  )

  // Autosave on title change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    debouncedSave({ title, content, tags, is_pinned: isPinned })
  }, [title, content]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handlePinToggle = () => {
    const newPinned = !isPinned
    setIsPinned(newPinned)
    onSave({ is_pinned: newPinned })
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag]
        setTags(updatedTags)
        onSave({ tags: updatedTags })
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove)
    setTags(updatedTags)
    onSave({ tags: updatedTags })
  }

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Header with pin toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span>
            Last edited{" "}
            {new Date(note.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <button
          onClick={handlePinToggle}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            isPinned
              ? "bg-accent-primary/15 text-accent-primary"
              : "text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary"
          )}
          title={isPinned ? "Unpin note" : "Pin note"}
        >
          {isPinned ? <Pin size={18} /> : <PinOff size={18} />}
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className={cn(
            "w-full bg-transparent border-none outline-none",
            "font-display text-2xl text-text-primary",
            "placeholder:text-text-tertiary",
            "focus:ring-0"
          )}
        />

        {/* Tags section */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-accent-primary/70 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={tags.length === 0 ? "Add tags..." : "+"}
            className={cn(
              "bg-transparent border-none outline-none text-xs",
              "text-text-secondary placeholder:text-text-tertiary",
              "min-w-[60px] max-w-[150px]",
              "focus:ring-0"
            )}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Content textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className={cn(
            "w-full min-h-[400px] bg-transparent border-none outline-none resize-none",
            "font-mono text-sm leading-relaxed text-text-primary",
            "placeholder:text-text-tertiary",
            "focus:ring-0"
          )}
        />

        {/* AI Summary section */}
        {note.summary ? (
          <div className="space-y-3">
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Sparkles size={14} className="text-accent-primary" />
              <span className="font-medium">AI Summary</span>
              <span className="text-text-tertiary text-xs">
                {summaryOpen ? "Hide" : "Show"}
              </span>
            </button>
            {summaryOpen && (
              <div className="border border-border-subtle rounded-lg bg-bg-tertiary p-4 space-y-3">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {note.summary}
                </p>
                {onSummarize && (
                  <button
                    onClick={onSummarize}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium",
                      "text-text-tertiary hover:text-accent-primary transition-colors"
                    )}
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          onSummarize && (
            <button
              onClick={onSummarize}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg",
                "bg-accent-primary/10 text-accent-primary text-sm font-medium",
                "hover:bg-accent-primary/20 transition-all duration-200",
                "border border-accent-primary/20"
              )}
            >
              <Sparkles size={14} />
              Summarize with AI
            </button>
          )
        )}
      </div>

      {/* Keyboard shortcuts footer */}
      <div className="px-6 py-3 border-t border-border-subtle">
        <div className="flex items-center justify-between text-[11px] text-text-tertiary">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-subtle font-mono">
                Tab
              </kbd>{" "}
              Indent
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-subtle font-mono">
                Ctrl+S
              </kbd>{" "}
              Save
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-subtle font-mono">
                Enter
              </kbd>{" "}
              Add tag
            </span>
          </div>
          <span className="opacity-60">Autosave enabled</span>
        </div>
      </div>
    </div>
  )
}
