
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      console.log('Fetching admin reviews data');
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('reviewed_at', { ascending: false });

      if (error) throw error;

      // Get related data for each review
      const reviewsWithDetails = await Promise.all(
        (data || []).map(async (review) => {
          // Get submission details
          const { data: submissionData } = await supabase
            .from('submissions')
            .select('student_id, lesson_id, submitted_at')
            .eq('id', review.submission_id)
            .single();

          let studentName = 'Unknown Student';
          let studentEmail = '';
          let courseName = 'Unknown Course';
          let lessonTitle = 'General Submission';

          if (submissionData) {
            // Get student info
            const { data: userData } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', submissionData.student_id)
              .single();

            if (userData) {
              studentName = userData.name || 'Unknown Student';
              studentEmail = userData.email || '';
            }

            // Get lesson and course info through proper relations
            const { data: lessonData } = await supabase
              .from('course_lessons')
              .select('title, module_id')
              .eq('id', submissionData.lesson_id)
              .single();

            if (lessonData) {
              lessonTitle = lessonData.title || 'General Submission';

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

                if (courseData) {
                  courseName = courseData.title;
                }
              }
            }
          }

          return {
            id: review.id,
            studentName,
            studentEmail,
            courseName,
            lessonTitle,
            submittedAt: submissionData?.submitted_at || new Date().toISOString(),
            reviewerName: 'Admin User', // You can expand this to get actual reviewer info
            status: review.reviewed_at ? 'Completed' : 'Pending',
            score: review.score,
            feedback: review.feedback,
            reviewed_at: review.reviewed_at,
          };
        })
      );

      return reviewsWithDetails;
    },
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      console.log('Fetching review stats');
      
      // Total reviews
      const { count: totalReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      // Pending reviews (submissions without reviews)
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('id');

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('submission_id');

      const reviewedSubmissionIds = new Set(reviewsData?.map(r => r.submission_id));
      const pendingReviews = submissionsData?.filter(s => !reviewedSubmissionIds.has(s.id)).length || 0;

      // In review (reviews without score)
      const { count: inReviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .is('score', null);

      // Average score
      const { data: scoreData } = await supabase
        .from('reviews')
        .select('score')
        .not('score', 'is', null);

      const avgScore = scoreData && scoreData.length > 0
        ? Math.round(scoreData.reduce((sum, review) => sum + (review.score || 0), 0) / scoreData.length)
        : 0;

      return {
        totalReviews: totalReviews || 0,
        pendingReviews,
        inReview: inReviewCount || 0,
        avgScore,
      };
    },
    refetchInterval: 30000,
  });
}
