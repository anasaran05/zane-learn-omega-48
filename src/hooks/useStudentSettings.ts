
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface StudentSettings {
  id?: string;
  student_id: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  autoplay_videos: boolean;
  sound_effects: boolean;
}

export function useStudentSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['student-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('student_settings')
        .select('*')
        .eq('student_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching student settings:', error);
        throw error;
      }

      // If no settings exist, return default settings
      if (!data) {
        return {
          student_id: user.id,
          dark_mode: false,
          email_notifications: true,
          push_notifications: true,
          marketing_emails: false,
          autoplay_videos: true,
          sound_effects: true,
        };
      }

      return data;
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (newSettings: Partial<StudentSettings>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('student_settings')
        .upsert({
          student_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating student settings:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['student-settings', user?.id], data);
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings. Please try again.');
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
