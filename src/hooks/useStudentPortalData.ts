import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Real achievements data
export function useStudentAchievements() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('student_achievement_progress')
        .select(`
          *,
          achievements (
            id,
            title,
            description,
            icon,
            rarity
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Real assignments data
export function useStudentAssignments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-assignments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get assignments for enrolled courses
      const { data: enrollments } = await supabase
        .from('student_course_enrollments')
        .select('course_id')
        .eq('student_id', user.id);

      if (!enrollments?.length) return [];

      const courseIds = enrollments.map(e => e.course_id);

      // Get assignments for those courses
      const { data: assignments, error } = await supabase
        .from('course_assignments')
        .select(`
          *,
          courses_enhanced (
            title
          ),
          student_assignment_submissions!left (
            id,
            score,
            status,
            submitted_at,
            feedback
          )
        `)
        .in('course_id', courseIds)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return assignments || [];
    },
    enabled: !!user,
  });
}

// Submit assignment
export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ assignmentId, content }: { assignmentId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('student_assignment_submissions')
        .insert({
          assignment_id: assignmentId,
          student_id: user.id,
          content,
          status: 'submitted'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assignments', user?.id] });
      toast({
        title: "Assignment submitted",
        description: "Your assignment has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Real certificates data
export function useStudentCertificates() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-certificates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('student_certificates')
        .select(`
          *,
          courses_enhanced (
            title
          )
        `)
        .eq('student_id', user.id)
        .order('completion_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Real analytics data
export function useStudentAnalytics() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-analytics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('student_analytics')
        .select('*')
        .eq('student_id', user.id)
        .order('date', { ascending: false })
        .limit(30); // Last 30 days

      if (error) throw error;
      
      // Calculate aggregated stats
      const totalLessons = data?.reduce((sum, day) => sum + day.lessons_completed, 0) || 0;
      const totalTime = data?.reduce((sum, day) => sum + day.time_spent_minutes, 0) || 0;
      const totalQuizzes = data?.reduce((sum, day) => sum + day.quiz_attempts, 0) || 0;
      const totalAssignments = data?.reduce((sum, day) => sum + day.assignments_submitted, 0) || 0;

      return {
        dailyData: data || [],
        totals: {
          lessons_completed: totalLessons,
          time_spent_hours: Math.round(totalTime / 60),
          quiz_attempts: totalQuizzes,
          assignments_submitted: totalAssignments
        }
      };
    },
    enabled: !!user,
  });
}

// Update analytics
export function useUpdateAnalytics() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (analytics: {
      lessons_completed?: number;
      time_spent_minutes?: number;
      quiz_attempts?: number;
      assignments_submitted?: number;
      login_count?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('update_student_analytics', {
        p_student_id: user.id,
        p_lessons_completed: analytics.lessons_completed || 0,
        p_time_spent_minutes: analytics.time_spent_minutes || 0,
        p_quiz_attempts: analytics.quiz_attempts || 0,
        p_assignments_submitted: analytics.assignments_submitted || 0,
        p_login_count: analytics.login_count || 0
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-analytics', user?.id] });
    },
  });
}