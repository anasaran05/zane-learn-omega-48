
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStudents() {
  return useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      console.log('Fetching admin students data');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get additional data for each student
      const studentsWithDetails = await Promise.all(
        (data || []).map(async (student) => {
          // Get enrollments
          const { count: enrollments } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', student.id);

          // Get progress data
          const { data: progressData } = await supabase
            .from('student_progress')
            .select('is_completed, created_at')
            .eq('user_id', student.id);

          const completedLessons = progressData?.filter(p => p.is_completed).length || 0;
          const totalLessons = progressData?.length || 0;
          
          // Calculate last activity (most recent progress update or creation date)
          let lastActivity = student.created_at;
          if (progressData && progressData.length > 0) {
            const progressDates = progressData
              .filter(p => p.created_at)
              .map(p => new Date(p.created_at).getTime())
              .filter(time => !isNaN(time));
            
            if (progressDates.length > 0) {
              const latestProgressTime = Math.max(...progressDates);
              lastActivity = new Date(latestProgressTime).toISOString();
            }
          }

          return {
            id: student.id,
            name: student.name || 'Unnamed User',
            email: student.email || '',
            enrolledCourses: enrollments || 0,
            completedLessons,
            totalLessons,
            lastActive: getTimeAgo(lastActivity),
            status: isRecentActivity(lastActivity) ? 'Active' : 'Inactive',
            joinedAt: student.created_at,
          };
        })
      );

      return studentsWithDetails;
    },
  });
}

export function useStudentStats() {
  return useQuery({
    queryKey: ['student-stats'],
    queryFn: async () => {
      console.log('Fetching student stats');
      
      // Total students
      const { count: totalStudents } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Active students (activity in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: activeStudentsData } = await supabase
        .from('student_progress')
        .select('user_id, created_at')
        .gte('created_at', weekAgo.toISOString());

      const activeStudents = new Set(activeStudentsData?.map(p => p.user_id)).size;

      // Average completion rate
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('completion_percentage')
        .not('completion_percentage', 'is', null);

      const avgCompletion = progressData && progressData.length > 0
        ? Math.round(progressData.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progressData.length)
        : 0;

      // New students this week
      const { count: newThisWeek } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')
        .gte('created_at', weekAgo.toISOString());

      return {
        totalStudents: totalStudents || 0,
        activeStudents,
        avgCompletion,
        newThisWeek: newThisWeek || 0,
      };
    },
    refetchInterval: 30000,
  });
}

// Helper functions
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return `${Math.floor(diffInDays / 7)} weeks ago`;
}

function isRecentActivity(dateString: string): boolean {
  const now = new Date();
  const date = new Date(dateString);
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7; // Active if activity in last 7 days
}
