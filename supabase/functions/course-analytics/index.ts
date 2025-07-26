
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { course_id } = await req.json();

    if (!course_id) {
      return new Response(
        JSON.stringify({ error: 'course_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get total enrollments
    const { data: enrollments, error: enrollError } = await supabaseClient
      .from('course_enrollments')
      .select('id')
      .eq('course_id', course_id);

    if (enrollError) throw enrollError;

    // Get modules and lessons count
    const { data: modules, error: modulesError } = await supabaseClient
      .from('course_modules')
      .select('id, course_lessons(id)')
      .eq('course_id', course_id);

    if (modulesError) throw modulesError;

    const modulesCount = modules?.length || 0;
    const lessonsCount = modules?.reduce((total, module: any) => total + (module.course_lessons?.length || 0), 0) || 0;

    // Get average completion rate
    const { data: progress, error: progressError } = await supabaseClient
      .from('student_progress')
      .select('completion_percentage, quiz_score')
      .eq('course_id', course_id);

    if (progressError) throw progressError;

    const avgCompletionRate = progress?.length > 0 
      ? progress.reduce((sum: number, p: any) => sum + (p.completion_percentage || 0), 0) / progress.length
      : 0;

    const avgQuizScore = progress?.filter((p: any) => p.quiz_score !== null).length > 0
      ? progress.filter((p: any) => p.quiz_score !== null).reduce((sum: number, p: any) => sum + p.quiz_score, 0) / progress.filter((p: any) => p.quiz_score !== null).length
      : 0;

    // Get average review turnaround (simplified calculation)
    const { data: reviews, error: reviewsError } = await supabaseClient
      .from('reviews')
      .select('reviewed_at, submissions(submitted_at)')
      .not('submissions.submitted_at', 'is', null)
      .not('reviewed_at', 'is', null);

    if (reviewsError) throw reviewsError;

    const avgReviewTurnaround = reviews?.length > 0
      ? reviews.reduce((sum: number, review: any) => {
          const submitTime = new Date(review.submissions.submitted_at).getTime();
          const reviewTime = new Date(review.reviewed_at).getTime();
          return sum + (reviewTime - submitTime) / (1000 * 60 * 60); // hours
        }, 0) / reviews.length
      : 0;

    const analytics = {
      totalEnrolled: enrollments?.length || 0,
      modulesCount,
      lessonsCount,
      avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
      avgQuizScore: Math.round(avgQuizScore * 100) / 100,
      avgReviewTurnaround: Math.round(avgReviewTurnaround * 100) / 100,
    };

    return new Response(
      JSON.stringify(analytics),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
