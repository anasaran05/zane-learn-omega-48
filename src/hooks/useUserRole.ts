
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserRole() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching user role for:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        // Default to student if user not found in users table
        return 'student';
      }

      console.log('User role fetched:', data?.role);
      return data?.role || 'student';
    },
    enabled: !!user,
  });
}

export function useIsAdmin() {
  const { data: role } = useUserRole();
  return role === 'admin';
}

export function useIsReviewer() {
  const { data: role } = useUserRole();
  return role === 'reviewer' || role === 'admin';
}

export function useIsStudent() {
  const { data: role } = useUserRole();
  return role === 'student';
}
