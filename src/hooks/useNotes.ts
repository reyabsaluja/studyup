
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Note = Database['public']['Tables']['notes']['Row'];
type NoteInsert = Database['public']['Tables']['notes']['Insert'];
type NoteSummary = Database['public']['Tables']['note_summaries']['Row'];

interface NoteWithSummary extends Note {
  summary?: string;
}

export const useNotes = () => {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<NoteWithSummary[]> => {
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (notesError) throw notesError;

      // Get summaries for each note
      const notesWithSummaries = await Promise.all(
        (notesData || []).map(async (note) => {
          const { data: summaryData } = await supabase
            .from('note_summaries')
            .select('summary')
            .eq('note_id', note.id)
            .single();

          return {
            ...note,
            summary: summaryData?.summary
          };
        })
      );

      return notesWithSummaries;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Omit<NoteInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({ ...newNote, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully!');
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    },
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const note = notes.find(n => n.id === noteId);
      if (!note || !note.content) {
        throw new Error('Note content not found');
      }

      // Simple AI summary - truncate content to first 100 characters
      const summary = note.content.length > 100 
        ? note.content.substring(0, 100) + '...'
        : note.content;

      const { data, error } = await supabase
        .from('note_summaries')
        .upsert({
          note_id: noteId,
          summary: summary
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('AI summary generated!');
    },
    onError: (error) => {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    },
  });

  return {
    notes,
    isLoading,
    error,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    generateSummary: generateSummaryMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isGeneratingSummary: generateSummaryMutation.isPending,
  };
};
