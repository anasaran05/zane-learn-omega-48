import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CourseFormData {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail_url?: string;
  category_id?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  level_id?: string;
  language_id?: string;
  duration_value?: number;
  duration_unit?: 'hours' | 'days' | 'weeks' | 'months';
  learning_objectives?: string[];
  skills_taught?: string[];
  prerequisites?: string;
  target_audience?: string[];
  modules?: {
    name: string;
    description: string;
    order_no: number;
    lessons?: {
      title: string;
      lesson_type: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session' | 'lab' | 'workshop';
      duration_minutes?: number;
      order_no: number;
      content_url?: string;
      content_text?: string;
      video_url?: string;
      video_embed_type?: 'youtube' | 'vimeo' | 'direct';
    }[];
  }[];
  domain_features?: {
    lab_mode_enabled?: boolean;
    lab_resources?: string[];
    case_studies_enabled?: boolean;
    case_study_urls?: string[];
    coding_sandbox_enabled?: boolean;
    github_repo_url?: string;
  };
  engagement_settings?: {
    live_sessions_enabled?: boolean;
    live_session_schedule?: any;
    discussion_groups_enabled?: boolean;
    domain_group_mapping?: any;
    mentor_assignments?: string[];
  };
  assessments?: {
    certification_enabled?: boolean;
    certification_criteria?: any;
    pass_thresholds?: any;
    certificate_template_url?: string;
  };
  pricing_plans?: Array<{
    tier: string;
    price?: number;
    features?: string[];
  }>;
  instructor_ids?: string[];
}

export function useCreateCourseFull() {
  return useMutation({
    mutationFn: async (courseData: CourseFormData) => {
      console.log('Creating course with data:', courseData);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User must be authenticated to create courses');
      }

      // Create the main course in courses_enhanced table
      const { data: course, error: courseError } = await supabase
        .from('courses_enhanced')
        .insert({
          title: courseData.title,
          subtitle: courseData.subtitle,
          description: courseData.description,
          category_id: courseData.category_id,
          level_id: courseData.level_id,
          language_id: courseData.language_id,
          duration_value: courseData.duration_value,
          duration_unit: courseData.duration_unit,
          learning_objectives: courseData.learning_objectives,
          skills_taught: courseData.skills_taught,
          prerequisites: courseData.prerequisites,
          target_audience: courseData.target_audience,
          created_by: user.id,
          status: 'published'
        })
        .select()
        .single();

      if (courseError) {
        console.error('Course creation error:', courseError);
        throw courseError;
      }

      console.log('Course created:', course);

      // Create modules if provided
      if (courseData.modules && courseData.modules.length > 0) {
        const modulesToInsert = courseData.modules.map(module => ({
          course_id: course.id,
          name: module.name,
          description: module.description,
          order_no: module.order_no,
        }));

        const { data: createdModules, error: modulesError } = await supabase
          .from('course_modules')
          .insert(modulesToInsert)
          .select();

        if (modulesError) {
          console.error('Modules creation error:', modulesError);
          throw modulesError;
        }

        // Create lessons for each module if provided
        if (createdModules) {
          for (let i = 0; i < createdModules.length; i++) {
            const module = courseData.modules[i];
            const createdModule = createdModules[i];
            
            if (module.lessons && module.lessons.length > 0) {
              const lessonsToInsert = module.lessons.map(lesson => ({
                module_id: createdModule.id,
                title: lesson.title,
                lesson_type: lesson.lesson_type || 'video',
                content_text: lesson.content_text,
                content_url: lesson.content_url,
                order_no: lesson.order_no,
              }));

              const { error: lessonsError } = await supabase
                .from('course_lessons')
                .insert(lessonsToInsert);

              if (lessonsError) {
                console.error('Lessons creation error:', lessonsError);
                throw lessonsError;
              }
            }
          }
        }
      }

      // Create domain features if provided
      if (courseData.domain_features) {
        const { error: domainError } = await supabase
          .from('course_domain_features')
          .insert({
            course_id: course.id,
            lab_mode_enabled: courseData.domain_features.lab_mode_enabled,
            lab_resources: courseData.domain_features.lab_resources,
            case_studies_enabled: courseData.domain_features.case_studies_enabled,
            case_study_urls: courseData.domain_features.case_study_urls,
            coding_sandbox_enabled: courseData.domain_features.coding_sandbox_enabled,
            github_repo_url: courseData.domain_features.github_repo_url,
          });

        if (domainError) {
          console.error('Domain features creation error:', domainError);
          throw domainError;
        }
      }

      // Create engagement settings if provided
      if (courseData.engagement_settings) {
        const { error: engagementError } = await supabase
          .from('course_engagement_settings')
          .insert({
            course_id: course.id,
            live_sessions_enabled: courseData.engagement_settings.live_sessions_enabled,
            live_session_schedule: courseData.engagement_settings.live_session_schedule,
            discussion_groups_enabled: courseData.engagement_settings.discussion_groups_enabled,
            domain_group_mapping: courseData.engagement_settings.domain_group_mapping,
            mentor_assignments: courseData.engagement_settings.mentor_assignments,
          });

        if (engagementError) {
          console.error('Engagement settings creation error:', engagementError);
          throw engagementError;
        }
      }

      // Create assessments if provided
      if (courseData.assessments) {
        const { error: assessmentsError } = await supabase
          .from('course_assessments')
          .insert({
            course_id: course.id,
            certification_enabled: courseData.assessments.certification_enabled,
            certification_criteria: courseData.assessments.certification_criteria,
            pass_thresholds: courseData.assessments.pass_thresholds,
            certificate_template_url: courseData.assessments.certificate_template_url,
          });

        if (assessmentsError) {
          console.error('Assessments creation error:', assessmentsError);
          throw assessmentsError;
        }
      }

      // Create pricing plans if provided
      if (courseData.pricing_plans && courseData.pricing_plans.length > 0) {
        const pricingPlansToInsert = courseData.pricing_plans.map(plan => ({
          course_id: course.id,
          tier: plan.tier,
          price: plan.price,
          features: plan.features,
        }));

        const { error: pricingError } = await supabase
          .from('course_pricing_plans')
          .insert(pricingPlansToInsert);

        if (pricingError) {
          console.error('Pricing plans creation error:', pricingError);
          throw pricingError;
        }
      }

      // Create instructor assignments if provided
      if (courseData.instructor_ids && courseData.instructor_ids.length > 0) {
        const instructorsToInsert = courseData.instructor_ids.map(instructorId => ({
          course_id: course.id,
          instructor_id: instructorId,
          role: 'instructor',
        }));

        const { error: instructorsError } = await supabase
          .from('course_instructors')
          .insert(instructorsToInsert);

        if (instructorsError) {
          console.error('Instructors creation error:', instructorsError);
          throw instructorsError;
        }
      }

      return course;
    },
  });
}

export function useCourseBuilderData(courseId: string) {
  return useQuery({
    queryKey: ['course-builder', courseId],
    queryFn: async () => {
      console.log('Fetching course builder data for:', courseId);
      
      const { data, error } = await supabase
        .from('courses_enhanced')
        .select(`
          *,
          course_categories (
            id,
            name
          ),
          course_levels (
            id, 
            name
          ),
          course_modules (
            id,
            name,
            description,
            order_no,
            course_lessons (
              id,
              title,
              lesson_type,
              content_text,
              content_url,
              order_no,
              duration_minutes
            )
          ),
          course_domain_features (*),
          course_engagement_settings (*),
          course_assessments (*),
          course_pricing_plans (*),
          course_instructors (*)
        `)
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Error fetching course data:', error);
        throw error;
      }
      
      console.log('Course data fetched:', data);
      return data;
    },
    enabled: !!courseId,
  });
}

export function useCourseAnalytics(courseId: string) {
  return useQuery({
    queryKey: ['course-analytics', courseId],
    queryFn: async () => {
      console.log('Fetching course analytics for:', courseId);
      
      // Get basic course stats
      const { data: course, error: courseError } = await supabase
        .from('courses_enhanced')
        .select(`
          *,
          course_modules (
            id,
            course_lessons (id)
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Get enrollment count
      const { count: enrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      // Get completion count
      const { count: completions } = await supabase
        .from('student_progress')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .eq('is_completed', true);

      // Calculate modules and lessons count
      const modulesCount = course.course_modules?.length || 0;
      const lessonsCount = course.course_modules?.reduce((total: number, module: any) => {
        return total + (module.course_lessons?.length || 0);
      }, 0) || 0;

      // Get average quiz scores
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('quiz_score, completion_percentage')
        .eq('course_id', courseId)
        .not('quiz_score', 'is', null);

      const avgQuizScore = progressData && progressData.length > 0
        ? progressData.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / progressData.length
        : 0;

      const avgCompletionRate = progressData && progressData.length > 0
        ? progressData.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progressData.length
        : 0;

      return {
        course,
        totalEnrolled: enrollments || 0,
        enrollments: enrollments || 0,
        completions: completions || 0,
        completion_rate: enrollments ? ((completions || 0) / enrollments) * 100 : 0,
        avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
        modulesCount,
        lessonsCount,
        avgQuizScore: Math.round(avgQuizScore * 100) / 100,
        avgReviewTurnaround: 24, // Default value for now
      };
    },
    enabled: !!courseId,
  });
}

export function useCourseLookupData() {
  return useQuery({
    queryKey: ['course-lookup-data'],
    queryFn: async () => {
      console.log('Fetching course lookup data');
      
      // Get categories
      const { data: categories, error: categoriesError } = await supabase
        .from('course_categories')
        .select('id, name, description')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Get levels
      const { data: levels, error: levelsError } = await supabase
        .from('course_levels')
        .select('id, name, description, order_no')
        .order('order_no');

      if (levelsError) throw levelsError;

      // Get languages
      const { data: languages, error: languagesError } = await supabase
        .from('course_languages')
        .select('id, name, code')
        .order('name');

      if (languagesError) throw languagesError;

      // Get instructors (users with staff or admin roles)
      const { data: instructors, error: instructorsError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('role', ['staff', 'admin'])
        .order('name');

      if (instructorsError) throw instructorsError;

      return {
        categories: categories || [],
        levels: levels || [],
        languages: languages || [],
        instructors: instructors || [],
      };
    },
  });
}

export function useCourseProgress(studentId: string, courseId: string) {
  return useQuery({
    queryKey: ['course-progress', studentId, courseId],
    queryFn: async () => {
      console.log('Fetching course progress for student:', studentId, 'course:', courseId);
      
      const { data, error } = await supabase
        .from('student_progress')
        .select(`
          *,
          course_lessons (
            id,
            title,
            lesson_type,
            order_no
          )
        `)
        .eq('user_id', studentId)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching progress:', error);
        throw error;
      }
      
      console.log('Progress data fetched:', data);
      return data;
    },
    enabled: !!studentId && !!courseId,
  });
}
