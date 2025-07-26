
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats');
      
      // Get total students count
      const { count: totalStudents } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Get total courses count
      const { count: totalCourses } = await supabase
        .from('courses_enhanced')
        .select('*', { count: 'exact', head: true });

      // Get published courses count
      const { count: publishedCourses } = await supabase
        .from('courses_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get total enrollments
      const { count: totalEnrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });

      // Get completed courses count
      const { count: completedCourses } = await supabase
        .from('student_progress')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true);

      // Calculate completion rate
      const completionRate = totalEnrollments && totalEnrollments > 0 
        ? Math.round(((completedCourses || 0) / totalEnrollments) * 100) 
        : 0;

      // Get average review time from reviews table
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('reviewed_at, submissions(submitted_at)')
        .not('submissions.submitted_at', 'is', null)
        .not('reviewed_at', 'is', null)
        .limit(50);

      let avgReviewTime = 0;
      if (reviewsData && reviewsData.length > 0) {
        const reviewTimes = reviewsData.map((review: any) => {
          const submitTime = new Date(review.submissions.submitted_at).getTime();
          const reviewTime = new Date(review.reviewed_at).getTime();
          return (reviewTime - submitTime) / (1000 * 60 * 60 * 24); // days
        });
        avgReviewTime = reviewTimes.reduce((sum, time) => sum + time, 0) / reviewTimes.length;
      }

      return {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        publishedCourses: publishedCourses || 0,
        completionRate,
        avgReviewTime: Math.round(avgReviewTime * 10) / 10,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      console.log('Fetching recent activity');
      
      // Get recent enrollments with course and user info separately
      const { data: recentEnrollments } = await supabase
        .from('course_enrollments')
        .select('*')
        .order('enrolled_at', { ascending: false })
        .limit(10);

      // Get recent reviews with submission info separately
      const { data: recentReviews } = await supabase
        .from('reviews')
        .select('*')
        .order('reviewed_at', { ascending: false })
        .limit(10);

      // Get recent course updates
      const { data: recentCourseUpdates } = await supabase
        .from('courses_enhanced')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);

      const activities = [];

      // Process enrollments - get course and user info separately
      if (recentEnrollments) {
        for (const enrollment of recentEnrollments) {
          const { data: courseData } = await supabase
            .from('courses_enhanced')
            .select('title')
            .eq('id', enrollment.course_id)
            .single();

          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', enrollment.student_id)
            .single();

          activities.push({
            action: 'New student enrolled',
            course: courseData?.title || 'Unknown Course',
            student: userData?.name || 'Unknown Student',
            time: enrollment.enrolled_at,
            type: 'enrollment'
          });
        }
      }

      // Process reviews - get submission and course info separately
      if (recentReviews) {
        for (const review of recentReviews) {
          const { data: submissionData } = await supabase
            .from('submissions')
            .select('student_id, lesson_id')
            .eq('id', review.submission_id)
            .single();

          if (submissionData) {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', submissionData.student_id)
              .single();

            // Get course info through lesson relationship
            const { data: lessonData } = await supabase
              .from('course_lessons')
              .select('module_id')
              .eq('id', submissionData.lesson_id)
              .single();

            let courseName = 'Unknown Course';
            if (lessonData) {
              const { data: moduleData } = await supabase
                .from('course_modules')
                .select('course_id')
                .eq('id', lessonData.module_id)
                .single();

              if (moduleData) {
                const { data: courseData } = await supabase
                  .from('courses_enhanced')
                  .select('title')
                  .eq('id', moduleData.course_id)
                  .single();

                courseName = courseData?.title || 'Unknown Course';
              }
            }

            activities.push({
              action: 'Review completed',
              course: courseName,
              student: userData?.name || 'Unknown Student',
              time: review.reviewed_at,
              type: 'review'
            });
          }
        }
      }

      // Process course updates
      if (recentCourseUpdates) {
        recentCourseUpdates.forEach(course => {
          activities.push({
            action: 'Course updated',
            course: course.title,
            time: course.updated_at,
            type: 'course_update'
          });
        });
      }

      // Sort all activities by time and return top 8
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 8)
        .map(activity => ({
          ...activity,
          timeAgo: getTimeAgo(activity.time)
        }));
    },
    refetchInterval: 30000,
  });
}

export function useQuickActionsData() {
  return useQuery({
    queryKey: ['quick-actions-data'],
    queryFn: async () => {
      console.log('Fetching quick actions data');
      
      // Get pending reviews count (submissions without reviews)
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('id');

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('submission_id');

      const reviewedSubmissionIds = new Set(reviewsData?.map(r => r.submission_id));
      const pendingReviews = submissionsData?.filter(s => !reviewedSubmissionIds.has(s.id)).length || 0;

      // Get new submissions count (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: newSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .gte('submitted_at', yesterday.toISOString());

      // Get courses needing updates (draft status)
      const { count: courseUpdates } = await supabase
        .from('courses_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      return {
        pendingReviews,
        newSubmissions: newSubmissions || 0,
        courseUpdates: courseUpdates || 0,
      };
    },
    refetchInterval: 30000,
  });
}

// Helper function to format time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}
