
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AiChat = Database['public']['Tables']['ai_chats']['Row'];

export const useAiChats = (assignmentId?: string) => {
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

  return { chats, isLoading, error };
};
