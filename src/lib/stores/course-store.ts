import { create } from 'zustand'
import { Course } from '../types'

interface CourseStore {
  courses: Course[]
  loading: boolean
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void
  fetchCourses: () => Promise<void>
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  loading: false,
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
    })),
  deleteCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    })),
  fetchCourses: async () => {
    set({ loading: true })
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      set({ courses: data, loading: false })
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      set({ loading: false })
    }
  },
}))
