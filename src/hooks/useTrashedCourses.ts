import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function useTrashedCourses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trashedCourses = [], isLoading, refetch } = useQuery({
    queryKey: ['trashed-courses'],
    queryFn: async () => {
      console.log('Fetching trashed courses');
      
      const { data, error } = await supabase
        .from('trashed_courses')
        .select(`
          *,
          course_categories!category_id (name),
          course_levels!level_id (name)
        `)
        .order('trashed_at', { ascending: false });

      if (error) {
        console.error('Error fetching trashed courses:', error);
        throw error;
      }

      console.log('Trashed courses fetched:', data);
      return data || [];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('trashed-courses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trashed_courses'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.rpc('move_course_to_trash', {
        course_id: courseId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['trashed-courses'] });
      toast({
        title: "Course moved to trash",
        description: "The course has been moved to trash and will be automatically deleted in 30 days.",
      });
    },
    onError: (error) => {
      console.error('Error moving course to trash:', error);
      toast({
        title: "Error",
        description: "Failed to move course to trash.",
        variant: "destructive"
      });
    }
  });

  const restoreCourse = useMutation({
    mutationFn: async (trashedCourseId: string) => {
      const { error } = await supabase.rpc('restore_course_from_trash', {
        trashed_course_id: trashedCourseId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['trashed-courses'] });
      toast({
        title: "Course restored",
        description: "The course has been restored successfully.",
      });
    },
    onError: (error) => {
      console.error('Error restoring course:', error);
      toast({
        title: "Error",
        description: "Failed to restore course.",
        variant: "destructive"
      });
    }
  });

  const permanentlyDeleteCourse = useMutation({
    mutationFn: async (trashedCourseId: string) => {
      const { error } = await supabase.rpc('permanently_delete_trashed_course', {
        trashed_course_id: trashedCourseId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trashed-courses'] });
      toast({
        title: "Course permanently deleted",
        description: "The course has been permanently deleted and cannot be recovered.",
      });
    },
    onError: (error) => {
      console.error('Error permanently deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to permanently delete course.",
        variant: "destructive"
      });
    }
  });

  return {
    trashedCourses,
    isLoading,
    deleteCourse,
    restoreCourse,
    permanentlyDeleteCourse,
    refetch
  };
}