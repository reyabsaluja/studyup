import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

// Setting worker path for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type CourseMaterial = Database['public']['Tables']['course_materials']['Row'];

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

      // Extract text content from the file.
      let content: string | null = null;
      if (file.type === 'text/plain') {
        try {
          content = await file.text();
        } catch (e) {
          console.error("Could not read file content:", e);
          toast.warning("Could not read content from the text file.");
        }
      } else if (file.type === 'application/pdf') {
        try {
          const fileBuffer = await file.arrayBuffer();
          const typedarray = new Uint8Array(fileBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => 'str' in item ? item.str : '').join(' ');
            fullText += pageText + ' ';
          }
          content = fullText.trim();
        } catch (e: any) {
          console.error("Could not read PDF file content:", e);
          toast.error(`Failed to read content from the PDF file: ${e.message}`);
        }
      }

      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${course_id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(filePath);

      // Save material record to database
      const { data, error: insertError } = await supabase
        .from('course_materials')
        .insert({
          course_id,
          title,
          type,
          url: publicUrl,
          file_path: filePath,
          content, // Save extracted content
        })
        .select()
        .single();

      if (insertError) throw insertError;
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
    mutationFn: async (material: CourseMaterial) => {
      // Delete file from storage
      if (material.file_path) {
        const { error: deleteError } = await supabase.storage
          .from('course-materials')
          .remove([material.file_path]);
        
        if (deleteError) {
          console.error('Error deleting file from storage:', deleteError);
        }
      }

      // Delete record from database
      const { error } = await supabase
        .from('course_materials')
        .delete()
        .eq('id', material.id);

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
