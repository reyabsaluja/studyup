
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseGeminiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string, context?: string) => Promise<void>;
  clearMessages: () => void;
  saveChat: (data: { title: string; assignment_id?: string }) => void;
  isSaving: boolean;
}

export const useGeminiChat = (): UseGeminiChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: performSave, isPending: isSaving } = useMutation({
    mutationFn: async ({ title, assignment_id }: { title: string; assignment_id?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to save a chat.');
        throw new Error('User not authenticated');
      }
      const user_id = session.user.id;

      const { error } = await supabase.from('ai_chats').insert({
        user_id,
        title,
        messages: messages as any,
        assignment_id: assignment_id || null,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Chat saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['ai_chats'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: (error) => {
      console.error('Error saving chat:', error);
      toast.error(`Failed to save chat: ${error.message}`);
    },
  });

  const saveChat = ({ title, assignment_id }: { title: string; assignment_id?: string }) => {
    if (messages.length === 0) {
      toast.warning("Cannot save an empty chat.");
      return;
    }
    performSave({ title, assignment_id });
  };

  const sendMessage = async (message: string, context?: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message, context },
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error('Failed to get AI response');
        return;
      }

      if (data?.error) {
        console.error('Gemini API error:', data.error);
        toast.error(data.error);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    saveChat,
    isSaving,
  };
};
