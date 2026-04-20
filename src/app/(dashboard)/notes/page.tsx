'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Pin,
  FileText,
  SortAsc,
  ChevronDown,
  X,
} from 'lucide-react'
import { cn, formatDate, formatRelativeTime, truncate } from '@/lib/utils'
import NoteEditor from '@/components/notes/NoteEditor'
import type { Note } from '@/lib/types'

// ===== Mock Data =====
const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    user_id: 'u1',
    course_id: 'c1',
    assignment_id: 'a1',
    title: 'AVL Tree Rotation Notes',
    content:
      'Left rotation: When the right subtree becomes heavier than the left, we perform a left rotation to rebalance.\n\nSteps:\n1. Let the right child become the new root\n2. The old root becomes the left child of the new root\n3. The left subtree of the new root becomes the right subtree of the old root\n\nRight rotation is the mirror operation.\n\nDouble rotations (LR and RL) combine both operations.',
    tags: ['trees', 'algorithms', 'data-structures'],
    summary:
      'Comprehensive notes on AVL tree rotation operations including left, right, left-right, and right-left rotations with step-by-step procedures.',
    is_pinned: true,
    created_at: '2026-04-12T10:00:00Z',
    updated_at: '2026-04-19T15:00:00Z',
  },
  {
    id: 'n2',
    user_id: 'u1',
    course_id: 'c2',
    assignment_id: null,
    title: 'Eigenvalues and Eigenvectors',
    content:
      'Definition: Av = lambda * v where A is a matrix, v is the eigenvector, and lambda is the eigenvalue.\n\nTo find eigenvalues:\n1. Solve det(A - lambda*I) = 0\n2. This gives the characteristic polynomial\n3. Roots of the polynomial are the eigenvalues\n\nTo find eigenvectors:\n- For each eigenvalue, solve (A - lambda*I)x = 0\n- The solution space gives the eigenvectors',
    tags: ['linear-algebra', 'eigenvalues', 'exam-prep'],
    summary:
      'Key definitions and procedures for computing eigenvalues via the characteristic polynomial and finding corresponding eigenvectors.',
    is_pinned: true,
    created_at: '2026-04-10T14:00:00Z',
    updated_at: '2026-04-18T11:00:00Z',
  },
  {
    id: 'n3',
    user_id: 'u1',
    course_id: 'c3',
    assignment_id: null,
    title: 'Process Scheduling Algorithms',
    content:
      'Round Robin (RR):\n- Time quantum based\n- Fair but high context switching overhead\n- Good for interactive systems\n\nShortest Job First (SJF):\n- Optimal for average wait time\n- Starvation possible for long jobs\n- Requires knowing burst time in advance\n\nPriority Scheduling:\n- Each process assigned a priority\n- Can be preemptive or non-preemptive\n- Aging solves starvation problem',
    tags: ['os', 'scheduling', 'algorithms'],
    summary: null,
    is_pinned: false,
    created_at: '2026-04-14T09:00:00Z',
    updated_at: '2026-04-17T16:00:00Z',
  },
  {
    id: 'n4',
    user_id: 'u1',
    course_id: 'c4',
    assignment_id: null,
    title: 'Backpropagation Derivation',
    content:
      'Chain rule application in neural networks:\n\ndL/dw = dL/da * da/dz * dz/dw\n\nwhere:\n- L = loss function\n- a = activation output\n- z = weighted sum\n- w = weight\n\nFor multi-layer networks, propagate gradients backwards through each layer.\n\nKey insight: Each layer only needs the gradient from the layer above it.',
    tags: ['ml', 'neural-networks', 'calculus'],
    summary:
      'Mathematical derivation of backpropagation using the chain rule, showing how gradients flow backwards through neural network layers.',
    is_pinned: false,
    created_at: '2026-04-15T11:00:00Z',
    updated_at: '2026-04-16T20:00:00Z',
  },
  {
    id: 'n5',
    user_id: 'u1',
    course_id: 'c5',
    assignment_id: null,
    title: 'Database Normalization Cheatsheet',
    content:
      '1NF: No repeating groups, atomic values only\n2NF: 1NF + no partial dependencies (all non-key attributes depend on the full key)\n3NF: 2NF + no transitive dependencies\nBCNF: Every determinant is a candidate key\n\nDenormalization trade-offs:\n- Faster reads (fewer joins)\n- Slower writes (data duplication)\n- Risk of update anomalies',
    tags: ['database', 'normalization', 'cheatsheet'],
    summary: null,
    is_pinned: true,
    created_at: '2026-04-08T13:00:00Z',
    updated_at: '2026-04-15T09:00:00Z',
  },
  {
    id: 'n6',
    user_id: 'u1',
    course_id: 'c1',
    assignment_id: null,
    title: 'Big O Notation Quick Reference',
    content:
      'Common complexities (best to worst):\n\nO(1) - Constant: Hash table lookup\nO(log n) - Logarithmic: Binary search\nO(n) - Linear: Array traversal\nO(n log n) - Linearithmic: Merge sort\nO(n^2) - Quadratic: Bubble sort\nO(2^n) - Exponential: Recursive Fibonacci\nO(n!) - Factorial: Permutations\n\nSpace vs Time trade-off is key to optimization.',
    tags: ['algorithms', 'complexity', 'reference'],
    summary:
      'Quick reference guide for Big O notation covering common time complexities from constant to factorial with examples.',
    is_pinned: false,
    created_at: '2026-04-05T10:00:00Z',
    updated_at: '2026-04-13T14:00:00Z',
  },
  {
    id: 'n7',
    user_id: 'u1',
    course_id: 'c4',
    assignment_id: null,
    title: 'Decision Trees - ID3 Algorithm',
    content:
      'Information Gain = Entropy(parent) - weighted avg Entropy(children)\n\nEntropy(S) = -sum(p_i * log2(p_i))\n\nID3 Steps:\n1. Calculate entropy of the target attribute\n2. For each feature, calculate information gain\n3. Select feature with highest information gain\n4. Create a node for that feature\n5. Recurse on each branch\n\nStopping conditions:\n- All examples same class\n- No more features\n- Tree depth limit reached',
    tags: ['ml', 'decision-trees', 'id3'],
    summary: null,
    is_pinned: false,
    created_at: '2026-04-03T16:00:00Z',
    updated_at: '2026-04-11T12:00:00Z',
  },
  {
    id: 'n8',
    user_id: 'u1',
    course_id: 'c3',
    assignment_id: null,
    title: 'Virtual Memory and Page Tables',
    content:
      'Page Table Entry (PTE) contains:\n- Frame number (physical address)\n- Valid/invalid bit\n- Protection bits (read/write/execute)\n- Dirty bit (modified)\n- Reference bit (accessed)\n\nTLB (Translation Lookaside Buffer):\n- Cache for page table entries\n- Speeds up address translation\n- TLB miss triggers page table walk\n\nPage fault handling:\n1. Check if reference is valid\n2. Find a free frame\n3. Read page from disk\n4. Update page table\n5. Restart the instruction',
    tags: ['os', 'memory', 'virtual-memory'],
    summary:
      'Detailed notes on virtual memory implementation including page table entries, TLB caching, and page fault handling procedures.',
    is_pinned: false,
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-04-09T17:00:00Z',
  },
]

type SortOption = 'updated_at' | 'title' | 'course'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'course', label: 'Course' },
]

const ALL_TAGS = Array.from(new Set(MOCK_NOTES.flatMap((n) => n.tags))).sort()

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(MOCK_NOTES[0]?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('updated_at')
  const [showTagFilter, setShowTagFilter] = useState(false)

  const filteredNotes = useMemo(() => {
    let result = [...notes]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((n) => n.tags.includes(selectedTag))
    }

    // Sort
    result.sort((a, b) => {
      // Pinned always first
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1

      switch (sortBy) {
        case 'updated_at':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'course':
          return (a.course_id ?? '').localeCompare(b.course_id ?? '')
        default:
          return 0
      }
    })

    return result
  }, [notes, searchQuery, selectedTag, sortBy])

  const pinnedNotes = filteredNotes.filter((n) => n.is_pinned)
  const unpinnedNotes = filteredNotes.filter((n) => !n.is_pinned)
  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null

  const handleSaveNote = (updates: Partial<Note>) => {
    if (!selectedNoteId) return
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, ...updates, updated_at: new Date().toISOString() } : n
      )
    )
  }

  const handleNewNote = () => {
    const newNote: Note = {
      id: `n${Date.now()}`,
      user_id: 'u1',
      course_id: null,
      assignment_id: null,
      title: 'Untitled',
      content: '',
      tags: [],
      summary: null,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
  }

  const handleSummarize = () => {
    if (!selectedNoteId) return
    // In production, call AI endpoint
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? { ...n, summary: 'AI-generated summary of the note content.', updated_at: new Date().toISOString() }
          : n
      )
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 lg:px-8 py-6 border-b border-[var(--color-border-subtle)]">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
            Notes
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleNewNote}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-[var(--color-accent-primary)] text-white text-sm font-medium',
            'hover:bg-[var(--color-accent-primary)]/90 transition-all duration-200',
            'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          )}
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Two Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Note List */}
        <div className="w-[300px] flex-shrink-0 border-r border-[var(--color-border-subtle)] flex flex-col overflow-hidden">
          {/* Search & Filter */}
          <div className="p-3 space-y-2 border-b border-[var(--color-border-subtle)]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className={cn(
                  'w-full pl-9 pr-3 py-2 rounded-lg text-xs',
                  'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                  'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                  'focus:outline-none focus:border-[var(--color-accent-primary)]'
                )}
              />
            </div>

            {/* Tag Filter + Sort */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <button
                  onClick={() => setShowTagFilter(!showTagFilter)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium',
                    'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                    selectedTag
                      ? 'text-[var(--color-accent-primary)]'
                      : 'text-[var(--color-text-secondary)]',
                    'hover:border-[var(--color-accent-primary)] transition-colors'
                  )}
                >
                  {selectedTag ?? 'Tags'}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="ml-1 p-0.5 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {showTagFilter && (
                  <div className="absolute left-0 top-full mt-1 w-48 max-h-48 overflow-y-auto bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg shadow-xl py-1 z-20">
                    {ALL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTag(tag)
                          setShowTagFilter(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 text-xs',
                          'hover:bg-[var(--color-bg-tertiary)] transition-colors',
                          selectedTag === tag
                            ? 'text-[var(--color-accent-primary)]'
                            : 'text-[var(--color-text-secondary)]'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={cn(
                  'px-2 py-1.5 rounded-md text-[11px] font-medium',
                  'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                  'text-[var(--color-text-secondary)]',
                  'focus:outline-none focus:border-[var(--color-accent-primary)]'
                )}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <FileText className="w-8 h-8 text-[var(--color-text-tertiary)] mb-3" />
                <p className="text-sm text-[var(--color-text-secondary)]">No notes yet.</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                  Start writing!
                </p>
              </div>
            ) : (
              <div>
                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Pinned
                    </div>
                    {pinnedNotes.map((note) => (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        isActive={note.id === selectedNoteId}
                        onClick={() => setSelectedNoteId(note.id)}
                      />
                    ))}
                  </div>
                )}

                {/* All Notes Section */}
                {unpinnedNotes.length > 0 && (
                  <div>
                    {pinnedNotes.length > 0 && (
                      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                        All Notes
                      </div>
                    )}
                    {unpinnedNotes.map((note) => (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        isActive={note.id === selectedNoteId}
                        onClick={() => setSelectedNoteId(note.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Note Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onSummarize={handleSummarize}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-10 h-10 text-[var(--color-text-tertiary)] mb-3" />
              <p className="text-sm text-[var(--color-text-secondary)]">Select a note to edit</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Or create a new note to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== Note List Item Component =====
interface NoteListItemProps {
  note: Note
  isActive: boolean
  onClick: () => void
}

function NoteListItem({ note, isActive, onClick }: NoteListItemProps) {
  const firstLine = note.content.split('\n')[0] || ''

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-3 border-b border-[var(--color-border-subtle)] transition-all duration-150',
        isActive
          ? 'bg-[var(--color-accent-primary)]/10 border-l-2 border-l-[var(--color-accent-primary)]'
          : 'hover:bg-[var(--color-bg-tertiary)]'
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-1.5">
            {note.is_pinned && (
              <Pin className="w-3 h-3 text-[var(--color-accent-primary)] flex-shrink-0" />
            )}
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {note.title}
            </h4>
          </div>

          {/* Preview */}
          <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
            {truncate(firstLine, 60)}
          </p>

          {/* Bottom row: tags + time */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {/* Tag dots */}
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)]/60"
                title={tag}
              />
            ))}
            {note.tags.length > 3 && (
              <span className="text-[9px] text-[var(--color-text-tertiary)]">
                +{note.tags.length - 3}
              </span>
            )}
            <span className="ml-auto text-[10px] text-[var(--color-text-tertiary)]">
              {formatRelativeTime(note.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
