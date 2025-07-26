
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

    const { student_id, course_id } = await req.json();

    if (!student_id || !course_id) {
      return new Response(
        JSON.stringify({ error: 'student_id and course_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get total lessons in course
    const { data: lessons, error: lessonsError } = await supabaseClient
      .from('course_lessons')
      .select('id, course_modules!inner(course_id)')
      .eq('course_modules.course_id', course_id);

    if (lessonsError) throw lessonsError;

    const totalLessons = lessons?.length || 0;

    // Get completed lessons for student
    const { data: progress, error: progressError } = await supabaseClient
      .from('student_progress')
      .select('lesson_id, is_completed, student_skills')
      .eq('user_id', student_id)
      .eq('course_id', course_id)
      .eq('is_completed', true);

    if (progressError) throw progressError;

    const completedLessons = progress?.length || 0;
    const completion_percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Get course skills
    const { data: course, error: courseError } = await supabaseClient
      .from('courses_enhanced')
      .select('skills_taught')
      .eq('id', course_id)
      .single();

    if (courseError) throw courseError;

    // Calculate match score based on student skills vs course skills
    const studentSkills = progress?.[0]?.student_skills || [];
    const courseSkills = course?.skills_taught || [];
    
    let matchScore = 0;
    if (courseSkills.length > 0 && studentSkills.length > 0) {
      const matchingSkills = studentSkills.filter((skill: string) => 
        courseSkills.some((courseSkill: string) => 
          courseSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(courseSkill.toLowerCase())
        )
      );
      matchScore = (matchingSkills.length / courseSkills.length) * 100;
    }

    // Update student progress
    const { error: updateError } = await supabaseClient
      .from('student_progress')
      .upsert({
        user_id: student_id,
        course_id: course_id,
        completion_percentage: Math.round(completion_percentage * 100) / 100,
        match_score: Math.round(matchScore * 100) / 100,
      });

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        completion_percentage: Math.round(completion_percentage * 100) / 100,
        match_score: Math.round(matchScore * 100) / 100,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
