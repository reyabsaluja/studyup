
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type CourseMaterial = Database['public']['Tables']['course_materials']['Row'];
type CourseMaterialInsert = Database['public']['Tables']['course_materials']['Insert'];

export const useCourseMaterials = (courseId: string) => {
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading, error } = useQuery({
    queryKey: ['courseMaterials', courseId],
    queryFn: async (): Promise<CourseMaterial[]> => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId,
  });

  const uploadMaterialMutation = useMutation({
    mutationFn: async ({ course_id, title, type, file }: { 
      course_id: string; 
      title: string; 
      type: string; 
      file: File; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // For now, we'll simulate the upload since storage isn't set up
      // In a real implementation, you would upload to Supabase Storage first
      const { data, error } = await supabase
        .from('course_materials')
        .insert({
          course_id,
          title,
          type,
          url: `https://example.com/files/${title}`, // Mock URL
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseMaterials', courseId] });
      toast.success('Material uploaded successfully!');
    },
    onError: (error) => {
      console.error('Error uploading material:', error);
      toast.error('Failed to upload material');
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const { error } = await supabase
        .from('course_materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseMaterials', courseId] });
      toast.success('Material deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    },
  });

  return {
    materials,
    isLoading,
    error,
    uploadMaterial: uploadMaterialMutation.mutate,
    deleteMaterial: deleteMaterialMutation.mutate,
    isUploading: uploadMaterialMutation.isPending,
    isDeleting: deleteMaterialMutation.isPending,
  };
};
