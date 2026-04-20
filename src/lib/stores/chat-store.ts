import { create } from 'zustand'
import { ChatMessage, ChatContextType } from '../types'

interface ChatStore {
  messages: ChatMessage[]
  loading: boolean
  contextType: ChatContextType
  contextId: string | null
  setContext: (type: ChatContextType, id: string | null) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,
  contextType: 'general',
  contextId: null,
  setContext: (type, id) => set({ contextType: type, contextId: id }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  sendMessage: async (content) => {
    const { contextType, contextId } = get()

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: '',
      role: 'user',
      content,
      context_type: contextType,
      context_id: contextId,
      created_at: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      loading: true,
    }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          contextType,
          contextId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        user_id: '',
        role: 'assistant',
        content: '',
        context_type: contextType,
        context_id: contextId,
        created_at: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
      }))

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          assistantContent += chunk

          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: assistantContent }
                : msg
            ),
          }))
        }
      }

      set({ loading: false })
    } catch (error) {
      console.error('Failed to send message:', error)
      set({ loading: false })
    }
  },
}))
