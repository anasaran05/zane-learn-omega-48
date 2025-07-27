
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTrashedCourses = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch trashed courses
  const { data: trashedCourses = [], isLoading, refetch } = useQuery({
    queryKey: ['trashed-courses'],
    queryFn: async () => {
      console.log('Fetching trashed courses...');
      const { data, error } = await supabase
        .from('trashed_courses')
        .select('*')
        .order('trashed_at', { ascending: false });

      if (error) {
        console.error('Error fetching trashed courses:', error);
        throw error;
      }

      console.log('Trashed courses fetched:', data);
      // Parse course_data and add expires_at
      return (data || []).map((course: any) => ({
        ...course,
        expires_at: new Date(new Date(course.trashed_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
    },
  });

  // Delete course (move to trash)
  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      console.log('Starting to move course to trash:', courseId);
      const { error } = await supabase.rpc('move_course_to_trash', {
        course_id: courseId
      });
      
      if (error) {
        console.error('Error moving course to trash:', error);
        throw error;
      }
      
      console.log('Course moved to trash successfully');
      return courseId;
    },
    onSuccess: (courseId) => {
      console.log('Delete mutation successful for course:', courseId);
      // Force refetch both queries immediately
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['trashed-courses'] });
      
      // Also force refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ['admin-courses'] });
      queryClient.refetchQueries({ queryKey: ['trashed-courses'] });
      
      toast({
        title: "Course moved to trash",
        description: "The course has been moved to trash. It will be permanently deleted in 30 days.",
      });
    },
    onError: (error) => {
      console.error('Delete mutation failed:', error);
      toast({
        title: "Error",
        description: "Failed to move course to trash. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Restore course from trash
  const restoreCourse = useMutation({
    mutationFn: async (trashedCourseId: string) => {
      console.log('Restoring course from trash:', trashedCourseId);
      const { error } = await supabase.rpc('restore_course_from_trash', {
        trashed_course_id: trashedCourseId
      });
      
      if (error) {
        console.error('Error restoring course:', error);
        throw error;
      }
      
      console.log('Course restored successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['trashed-courses'] });
      queryClient.refetchQueries({ queryKey: ['admin-courses'] });
      queryClient.refetchQueries({ queryKey: ['trashed-courses'] });
      
      toast({
        title: "Course restored",
        description: "The course has been restored from trash as a draft.",
      });
    },
    onError: (error) => {
      console.error('Error restoring course:', error);
      toast({
        title: "Error",
        description: "Failed to restore course. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Permanently delete course
  const permanentlyDeleteCourse = useMutation({
    mutationFn: async (trashedCourseId: string) => {
      console.log('Permanently deleting course:', trashedCourseId);
      const { error } = await supabase.rpc('permanently_delete_trashed_course', {
        trashed_course_id: trashedCourseId
      });
      
      if (error) {
        console.error('Error permanently deleting course:', error);
        throw error;
      }
      
      console.log('Course permanently deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trashed-courses'] });
      queryClient.refetchQueries({ queryKey: ['trashed-courses'] });
      
      toast({
        title: "Course permanently deleted",
        description: "The course has been permanently deleted and cannot be recovered.",
      });
    },
    onError: (error) => {
      console.error('Error permanently deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to permanently delete course. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    trashedCourses,
    isLoading,
    refetch,
    deleteCourse,
    restoreCourse,
    permanentlyDeleteCourse
  };
};
