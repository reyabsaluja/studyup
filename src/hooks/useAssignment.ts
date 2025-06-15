
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Assignment = Database['public']['Tables']['assignments']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

type AssignmentWithCourse = Assignment & { courses: Pick<Course, 'name' | 'color'> | null };

export const useAssignment = (assignmentId?: string) => {
  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: async (): Promise<AssignmentWithCourse | null> => {
      if (!assignmentId) return null;

      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          courses (name, color)
        `)
        .eq('id', assignmentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as AssignmentWithCourse;
    },
    enabled: !!assignmentId,
  });

  return { assignment, isLoading, error };
};
