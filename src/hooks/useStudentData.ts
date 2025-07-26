import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useStudentProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profileData: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('students')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile', user?.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useStudentEnrollments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('student_course_enrollments')
        .select(`
          *,
          courses_enhanced!inner(
            id,
            title,
            subtitle,
            description,
            status
          )
        `)
        .eq('student_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('student_course_enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'in_progress',
          progress_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments', user?.id] });
      toast({
        title: "Enrollment successful",
        description: "You have been enrolled in the course!",
      });
    },
    onError: (error: any) => {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Enrollment failed",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useStudentProgress() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('student_lesson_progress')
        .select(`
          *,
          course_lessons!inner(
            id,
            title,
            lesson_type,
            duration_minutes
          ),
          courses_enhanced!inner(
            id,
            title
          )
        `)
        .eq('student_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useStudentProgressStats() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-progress-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get enrollment stats
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('student_course_enrollments')
        .select('*, courses_enhanced(title)')
        .eq('student_id', user.id);

      if (enrollmentError) throw enrollmentError;

      // Get completed lessons count
      const { data: completedLessons, error: lessonsError } = await supabase
        .from('student_lesson_progress')
        .select('id')
        .eq('student_id', user.id)
        .eq('is_completed', true);

      if (lessonsError) throw lessonsError;

      // Calculate stats
      const coursesInProgress = enrollments?.filter(e => e.status === 'in_progress').length || 0;
      const coursesCompleted = enrollments?.filter(e => e.status === 'completed').length || 0;
      const totalHoursLearned = (completedLessons?.length || 0) * 1.5; // Assume 1.5 hours per lesson
      const averageScore = 87; // Can be calculated from quiz_submissions later
      const streak = 12; // Can be calculated from daily activity later

      return {
        coursesCompleted,
        coursesInProgress,
        totalHoursLearned: Math.round(totalHoursLearned),
        averageScore,
        streak,
        enrollments: enrollments || [],
      };
    },
    enabled: !!user,
  });
}

export function useStudentNotifications() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('student_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useStudentSupportTickets() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-support-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useSubmitSupportTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ticketData: { subject: string; category: string; message: string }) => {
      if (!user) throw new Error('User not authenticated');

      // First create the ticket in database
      const { data: ticket, error: dbError } = await supabase
        .from('support_tickets')
        .insert({
          student_id: user.id,
          ...ticketData,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Get student profile for email
      const { data: studentProfile } = await supabase
        .from('students')
        .select('name, email')
        .eq('user_id', user.id)
        .single();

      // Send email via edge function
      const emailResponse = await supabase.functions.invoke('send-support-email', {
        body: {
          studentName: studentProfile?.name || 'Student',
          studentEmail: studentProfile?.email || user.email,
          subject: ticketData.subject,
          category: ticketData.category,
          message: ticketData.message,
        },
      });

      if (emailResponse.error) {
        console.error('Email sending failed:', emailResponse.error);
      }

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-support-tickets', user?.id] });
      toast({
        title: "Ticket submitted",
        description: "Your support ticket has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error submitting support ticket:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit support ticket. Please try again.",
        variant: "destructive",
      });
    },
  });
}