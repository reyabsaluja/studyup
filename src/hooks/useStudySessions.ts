
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the study session types directly since they might not be in the generated types yet
type StudySession = {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  duration: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type StudySessionInsert = {
  course_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration: number;
  completed?: boolean;
};

type StudySessionUpdate = {
  course_id?: string;
  title?: string;
  description?: string;
  scheduled_date?: string;
  duration?: number;
  completed?: boolean;
};

export const useStudySessions = () => {
  const queryClient = useQueryClient();

  const { data: studySessions = [], isLoading, error } = useQuery({
    queryKey: ['studySessions'],
    queryFn: async (): Promise<StudySession[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_sessions' as any)
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return (data ?? []) as StudySession[];
    },
  });

  const createStudySessionMutation = useMutation({
    mutationFn: async (newSession: StudySessionInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_sessions' as any)
        .insert({ 
          ...newSession, 
          user_id: user.id,
          completed: newSession.completed || false 
        })
        .select()
        .single();

      if (error || !data) throw error ?? new Error("Failed to create session");

      // Get course name for activity tracking
      const { data: course } = await supabase
        .from('courses')
        .select('name')
        .eq('id', newSession.course_id)
        .maybeSingle();

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

      return data as StudySession;
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
        .from('study_sessions' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) throw error ?? new Error("Failed to update session");

      // Track activity if completed status changed
      if (updates.completed !== undefined) {
        const { data: course } = await supabase
          .from('courses')
          .select('name')
          .eq('id', (data as StudySession).course_id)
          .maybeSingle();

        await supabase
          .from('activities')
          .insert({
            user_id: user.id,
            activity_type: updates.completed ? 'study_session_completed' : 'study_session_updated',
            activity_description: `${updates.completed ? 'Completed' : 'Updated'} study session: ${(data as StudySession).title}`,
            related_course_id: (data as StudySession).course_id,
            related_course_name: course?.name || 'Unknown Course',
          });
      }

      return data as StudySession;
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
        .from('study_sessions' as any)
        .delete()
        .eq('id', session.id);

      if (error) throw error;

      // Track activity
      const { data: course } = await supabase
        .from('courses')
        .select('name')
        .eq('id', session.course_id)
        .maybeSingle();

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

// ...end of file
