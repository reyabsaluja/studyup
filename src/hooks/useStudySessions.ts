
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type StudySession = Database['public']['Tables']['study_sessions']['Row'];
type StudySessionInsert = Database['public']['Tables']['study_sessions']['Insert'];
type StudySessionUpdate = Database['public']['Tables']['study_sessions']['Update'];

export const useStudySessions = () => {
  const queryClient = useQueryClient();

  const { data: studySessions = [], isLoading, error } = useQuery({
    queryKey: ['studySessions'],
    queryFn: async (): Promise<StudySession[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const createStudySessionMutation = useMutation({
    mutationFn: async (newSession: Omit<StudySessionInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_sessions')
        .insert({ ...newSession, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Get course name for activity tracking
      const { data: course } = await supabase
        .from('courses')
        .select('name')
        .eq('id', newSession.course_id)
        .single();

      // Track activity
      await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          activity_type: 'study_session_created',
          activity_description: `Created study session: ${newSession.title}`,
          related_course_id: newSession.course_id,
          related_course_name: course?.name || 'Unknown Course',
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Study session created successfully!');
    },
    onError: (error) => {
      console.error('Error creating study session:', error);
      toast.error('Failed to create study session');
    },
  });

  const updateStudySessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: StudySessionUpdate }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Track activity if completed status changed
      if (updates.completed !== undefined) {
        const { data: course } = await supabase
          .from('courses')
          .select('name')
          .eq('id', data.course_id)
          .single();

        await supabase
          .from('activities')
          .insert({
            user_id: user.id,
            activity_type: updates.completed ? 'study_session_completed' : 'study_session_updated',
            activity_description: `${updates.completed ? 'Completed' : 'Updated'} study session: ${data.title}`,
            related_course_id: data.course_id,
            related_course_name: course?.name || 'Unknown Course',
          });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Study session updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating study session:', error);
      toast.error('Failed to update study session');
    },
  });

  const deleteStudySessionMutation = useMutation({
    mutationFn: async (session: StudySession) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', session.id);

      if (error) throw error;

      // Track activity
      const { data: course } = await supabase
        .from('courses')
        .select('name')
        .eq('id', session.course_id)
        .single();

      await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          activity_type: 'study_session_deleted',
          activity_description: `Deleted study session: ${session.title}`,
          related_course_id: session.course_id,
          related_course_name: course?.name || 'Unknown Course',
        });

      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Study session deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting study session:', error);
      toast.error('Failed to delete study session');
    },
  });

  return {
    studySessions,
    isLoading,
    error,
    createStudySession: createStudySessionMutation.mutate,
    updateStudySession: updateStudySessionMutation.mutate,
    deleteStudySession: deleteStudySessionMutation.mutate,
    isCreating: createStudySessionMutation.isPending,
    isUpdating: updateStudySessionMutation.isPending,
    isDeleting: deleteStudySessionMutation.isPending,
  };
};
