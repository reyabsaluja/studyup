
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type StudySession = {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type StudySessionInsert = Omit<StudySession, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const useStudySessions = () => {
  const queryClient = useQueryClient();

  const { data: studySessions = [], isLoading, error } = useQuery({
    queryKey: ['studySessions'],
    queryFn: async (): Promise<StudySession[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // For now, we'll return mock data since the table doesn't exist yet
      // This will be replaced with actual database queries after migration
      return [];
    },
  });

  const createStudySessionMutation = useMutation({
    mutationFn: async (newSession: StudySessionInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Mock implementation - will be replaced with actual database operations
      toast.success('Study session created successfully!');
      return { ...newSession, id: `session-${Date.now()}`, user_id: user.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
    },
    onError: (error) => {
      console.error('Error creating study session:', error);
      toast.error('Failed to create study session');
    },
  });

  const updateStudySessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StudySession> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Mock implementation
      toast.success('Study session updated successfully!');
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
    },
    onError: (error) => {
      console.error('Error updating study session:', error);
      toast.error('Failed to update study session');
    },
  });

  return {
    studySessions,
    isLoading,
    error,
    createStudySession: createStudySessionMutation.mutate,
    updateStudySession: updateStudySessionMutation.mutate,
    isCreating: createStudySessionMutation.isPending,
    isUpdating: updateStudySessionMutation.isPending,
  };
};
