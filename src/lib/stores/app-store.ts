import { create } from 'zustand'

interface AppStore {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  toggleCollapsed: () => void
  activeCourseId: string | null
  activeAssignmentId: string | null
  setActiveCourse: (id: string | null) => void
  setActiveAssignment: (id: string | null) => void
  commandPaletteOpen: boolean
  toggleCommandPalette: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  activeCourseId: null,
  activeAssignmentId: null,
  setActiveCourse: (id) => set({ activeCourseId: id }),
  setActiveAssignment: (id) => set({ activeAssignmentId: id }),
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
