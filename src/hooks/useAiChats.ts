
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type AiChat = Database['public']['Tables']['ai_chats']['Row'];

export const useAiChats = (assignmentId?: string) => {
  const queryClient = useQueryClient();

  const { data: chats, isLoading, error } = useQuery({
    queryKey: ['ai_chats', { assignmentId }],
    queryFn: async (): Promise<AiChat[]> => {
      if (!assignmentId) return [];
      
      const { data, error } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
    enabled: !!assignmentId,
  });

  const { mutate: unlinkChat, isPending: isUnlinking } = useMutation({
    mutationFn: async (chatId: string) => {
      const { error } = await supabase
        .from('ai_chats')
        .update({ assignment_id: null })
        .eq('id', chatId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Chat unlinked successfully!');
      queryClient.invalidateQueries({ queryKey: ['ai_chats', { assignmentId }] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to unlink chat: ${error.message}`);
    },
  });

  return { chats, isLoading, error, unlinkChat, isUnlinking };
};
