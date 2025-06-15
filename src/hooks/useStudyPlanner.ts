
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useStudySessions } from './useStudySessions';

interface StudyPlanSession {
  title: string;
  description: string;
  scheduled_date: string;
  duration: number;
}

interface StudyPlan {
  rationale: string;
  sessions: StudyPlanSession[];
}

export const useStudyPlanner = (courseId?: string) => {
  const queryClient = useQueryClient();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const { createStudySession } = useStudySessions();

  const { mutate: generatePlan, isPending: isGenerating } = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-study-plan', {
        body: { assignmentId },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      return data as StudyPlan;
    },
    onSuccess: (data) => {
      setPlan(data);
    },
    onError: (error: Error) => {
      console.error('Error generating study plan:', error);
      toast.error(`Failed to generate study plan: ${error.message}`);
    },
  });

  const { mutate: addPlanToPlanner, isPending: isAdding } = useMutation({
    mutationFn: async ({ assignmentTitle }: { assignmentTitle: string }) => {
      if (!plan || !courseId) {
        throw new Error('No plan or courseId available to add.');
      }
      
      const sessionPromises = plan.sessions.map(session => 
        createStudySession({
          course_id: courseId,
          title: session.title,
          description: `For assignment: "${assignmentTitle}"\n\n${session.description}`,
          scheduled_date: session.scheduled_date,
          duration: session.duration,
          completed: false,
        })
      );
      
      await Promise.all(sessionPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      toast.success('Study plan added to your planner!');
      setPlan(null);
    },
    onError: (error: Error) => {
      console.error('Error adding plan to planner:', error);
      toast.error(`Failed to add study plan: ${error.message}`);
    },
  });
  
  const clearPlan = () => {
    setPlan(null);
  }

  return {
    plan,
    generatePlan,
    isGenerating,
    addPlanToPlanner,
    isAdding,
    clearPlan,
  };
};
