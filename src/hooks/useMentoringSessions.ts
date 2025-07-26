
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function useMentoringSessions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['mentoring-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mentor_sessions')
        .select(`
          *,
          courses_enhanced (
            title
          )
        `)
        .eq('student_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useReviewerSessions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reviewer-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: sessions, error } = await supabase
        .from('mentor_sessions')
        .select(`
          *,
          courses_enhanced (
            title
          )
        `)
        .eq('reviewer_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      
      // Fetch user data separately for each session
      const sessionsWithUsers = await Promise.all(
        (sessions || []).map(async (session) => {
          const { data: userData } = await supabase
            .from('users')
            .select('email')
            .eq('id', session.student_id)
            .single();
          
          return {
            ...session,
            users: userData
          };
        })
      );
      
      return sessionsWithUsers;
    },
    enabled: !!user,
  });
}

export function useBookMentorSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sessionData: {
      reviewer_id: string;
      course_id?: string;
      scheduled_date: string;
      scheduled_time: string;
      timezone: string;
      student_notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mentor_sessions')
        .insert({
          student_id: user.id,
          ...sessionData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentoring-sessions'] });
      toast({
        title: "Session booked",
        description: "Your mentoring session has been requested successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error booking session:', error);
      toast({
        title: "Booking failed",
        description: "Failed to book mentoring session. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSessionStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionId, status }: { sessionId: string; status: string }) => {
      const { data, error } = await supabase
        .from('mentor_sessions')
        .update({ status })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mentoring-sessions'] });
      toast({
        title: data.status === 'accepted' ? "Session accepted" : "Session updated",
        description: `Session has been ${data.status}.`,
      });
    },
  });
}

export function useMentorChat(sessionId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['mentor-chat', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentor_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!sessionId && !!user,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel('mentor_chat_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mentor_chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['mentor-chat', sessionId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, queryClient]);

  return query;
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: string; message: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mentor_chat_messages')
        .insert({
          session_id: sessionId,
          sender_id: user.id,
          message,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mentor-chat', data.session_id] });
    },
  });
}

export function useSubmitSessionReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reportData: {
      session_id: string;
      student_progress_assessment: string;
      key_topics_discussed: string[];
      recommendations: string;
      next_steps?: string;
      overall_rating: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mentor_session_reports')
        .insert({
          ...reportData,
          reviewer_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update session status to completed
      await supabase
        .from('mentor_sessions')
        .update({ 
          status: 'completed',
          session_completed_at: new Date().toISOString()
        })
        .eq('id', reportData.session_id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-sessions'] });
      toast({
        title: "Report submitted",
        description: "Session report has been submitted successfully.",
      });
    },
  });
}
