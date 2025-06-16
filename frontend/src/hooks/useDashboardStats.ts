
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  activeCourses: number;
  assignmentsDue: number;
  studyHours: number;
  totalAssignments: number;
  completedAssignments: number;
}

export const useDashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('user_id', user.id);

      if (coursesError) throw coursesError;
      const courseIds = courses?.map(c => c.id) || [];

      // Get assignments due this week
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('id, course_id, due_date')
        .in('course_id', courseIds)
        .gte('due_date', new Date().toISOString())
        .lte('due_date', oneWeekFromNow.toISOString());

      if (assignmentsError) throw assignmentsError;

      // Get total assignments
      const { data: totalAssignments, error: totalAssignmentsError } = await supabase
        .from('assignments')
        .select('id')
        .in('course_id', courseIds);

      if (totalAssignmentsError) throw totalAssignmentsError;

      // Get completed assignments
      const { data: completedAssignments, error: completedAssignmentsError } = await supabase
        .from('assignments')
        .select('id')
        .in('course_id', courseIds)
        .eq('completed', true);

      if (completedAssignmentsError) throw completedAssignmentsError;

      return {
        activeCourses: courses?.length || 0,
        assignmentsDue: assignments?.length || 0,
        studyHours: 28, // This would be calculated from actual study session data
        totalAssignments: totalAssignments?.length || 0,
        completedAssignments: completedAssignments?.length || 0
      };
    },
  });

  return {
    stats: stats || { activeCourses: 0, assignmentsDue: 0, studyHours: 0, totalAssignments: 0, completedAssignments: 0 },
    isLoading,
    error,
  };
};
