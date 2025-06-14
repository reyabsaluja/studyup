
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Assignment = Database['public']['Tables']['assignments']['Row'];
type AssignmentInsert = Database['public']['Tables']['assignments']['Insert'];

export const useAssignments = (courseId: string) => {
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: ['assignments', courseId],
    queryFn: async (): Promise<Assignment[]> => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', courseId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId,
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (newAssignment: Omit<AssignmentInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('assignments')
        .insert(newAssignment)
        .select()
        .single();

      if (error) throw error;

      // Get course name for activity tracking
      const { data: course } = await supabase
        .from('courses')
        .select('name')
        .eq('id', newAssignment.course_id)
        .single();

      // Track activity
      await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          activity_type: 'assignment_created',
          activity_description: `Created assignment: ${newAssignment.title}`,
          related_course_id: newAssignment.course_id,
          related_course_name: course?.name || 'Unknown Course',
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Assignment created successfully!');
    },
    onError: (error) => {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    },
  });

  return {
    assignments,
    isLoading,
    error,
    createAssignment: createAssignmentMutation.mutate,
    isCreating: createAssignmentMutation.isPending,
  };
};
