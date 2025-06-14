
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
      const { data, error } = await supabase
        .from('assignments')
        .insert(newAssignment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
