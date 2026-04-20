import { create } from 'zustand'
import { Note } from '../types'

interface NoteStore {
  notes: Note[]
  activeNote: Note | null
  loading: boolean
  setNotes: (notes: Note[]) => void
  setActiveNote: (note: Note | null) => void
  addNote: (note: Note) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  fetchNotes: () => Promise<void>
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  activeNote: null,
  loading: false,
  setNotes: (notes) => set({ notes }),
  setActiveNote: (note) => set({ activeNote: note }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, note) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...note } : n)),
      activeNote:
        state.activeNote?.id === id
          ? { ...state.activeNote, ...note }
          : state.activeNote,
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      activeNote: state.activeNote?.id === id ? null : state.activeNote,
    })),
  fetchNotes: async () => {
    set({ loading: true })
    try {
      const response = await fetch('/api/notes')
      const data = await response.json()
      set({ notes: data, loading: false })
    } catch (error) {
      console.error('Failed to fetch notes:', error)
      set({ loading: false })
    }
  },
}))
