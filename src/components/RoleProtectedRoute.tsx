import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth' 
}: RoleProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      const fetchUserRole = async () => {
        try {
          const { data, error } = await supabase.rpc('get_user_role', {
            user_id: user.id
          });
          
          if (error) throw error;
          setUserRole(data || 'student');
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('student'); // Default fallback
        } finally {
          setRoleLoading(false);
        }
      };

      fetchUserRole();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!roleLoading && userRole && !allowedRoles.includes(userRole)) {
      // Redirect based on user role
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'reviewer') {
        navigate('/reviewer');
      } else if (userRole === 'student') {
        navigate('/student');
      } else {
        navigate(redirectTo);
      }
    }
  }, [userRole, roleLoading, allowedRoles, navigate, redirectTo]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      {children}
    </RoleProtectedRoute>
  );
}

export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      {children}
    </RoleProtectedRoute>
  );
}

export function ReviewerRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['reviewer']}>
      {children}
    </RoleProtectedRoute>
  );
}

export function StaffRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
      {children}
    </RoleProtectedRoute>
  );
}