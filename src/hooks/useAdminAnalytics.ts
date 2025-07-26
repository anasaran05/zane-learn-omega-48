
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      console.log('Fetching analytics stats');
      
      // Get total enrollments count for revenue calculation (mock $15 per enrollment)
      const { count: totalEnrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });

      const totalRevenue = (totalEnrollments || 0) * 15; // Mock revenue calculation

      // Get active students (users with recent student_progress entries)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: activeStudentsData } = await supabase
        .from('student_progress')
        .select('user_id')
        .gte('created_at', weekAgo.toISOString());

      const activeStudents = new Set(activeStudentsData?.map(p => p.user_id)).size;

      // Get completion count
      const { count: completions } = await supabase
        .from('student_progress')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true);

      // Mock average study time calculation
      const avgStudyTime = 4.2; // hours - this would need more sophisticated tracking

      return {
        totalRevenue,
        activeStudents,
        courseCompletions: completions || 0,
        avgStudyTime,
      };
    },
    refetchInterval: 60000,
  });
}

export function useEnrollmentTrends() {
  return useQuery({
    queryKey: ['enrollment-trends'],
    queryFn: async () => {
      console.log('Fetching enrollment trends');
      
      const { data: enrollmentsData } = await supabase
        .from('course_enrollments')
        .select('enrolled_at')
        .order('enrolled_at', { ascending: true });

      const { data: completionsData } = await supabase
        .from('student_progress')
        .select('created_at')
        .eq('is_completed', true)
        .order('created_at', { ascending: true });

      // Group by month
      const monthlyData = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
      months.forEach(month => {
        monthlyData[month] = { enrollments: 0, completions: 0 };
      });

      // Process enrollments
      enrollmentsData?.forEach(enrollment => {
        const date = new Date(enrollment.enrolled_at);
        const monthName = date.toLocaleDateString('en', { month: 'short' });
        if (monthlyData[monthName]) {
          monthlyData[monthName].enrollments++;
        }
      });

      // Process completions
      completionsData?.forEach(completion => {
        const date = new Date(completion.created_at);
        const monthName = date.toLocaleDateString('en', { month: 'short' });
        if (monthlyData[monthName]) {
          monthlyData[monthName].completions++;
        }
      });

      return months.map(month => ({
        month,
        enrollments: monthlyData[month].enrollments,
        completions: monthlyData[month].completions,
      }));
    },
    refetchInterval: 300000, // 5 minutes
  });
}

export function useCoursePerformance() {
  return useQuery({
    queryKey: ['course-performance'],
    queryFn: async () => {
      console.log('Fetching course performance');
      
      // Get courses with enrollment counts
      const { data: coursesData } = await supabase
        .from('courses_enhanced')
        .select('id, title')
        .eq('status', 'published')
        .limit(10);

      if (!coursesData) return [];

      // For each course, get enrollments and completions separately
      const coursePerformance = await Promise.all(
        coursesData.map(async (course) => {
          // Get enrollments for this course
          const { count: enrollments } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          // Get completions for this course
          const { count: completed } = await supabase
            .from('student_progress')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('is_completed', true);

          const completion = enrollments && enrollments > 0 ? Math.round(((completed || 0) / enrollments) * 100) : 0;

          return {
            name: course.title,
            completion,
            students: enrollments || 0,
          };
        })
      );

      return coursePerformance;
    },
    refetchInterval: 300000,
  });
}
