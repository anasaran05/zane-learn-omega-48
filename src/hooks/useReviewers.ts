
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAvailableReviewers() {
  return useQuery({
    queryKey: ['available-reviewers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .eq('role', 'reviewer');

      if (error) throw error;
      return data || [];
    },
  });
}
