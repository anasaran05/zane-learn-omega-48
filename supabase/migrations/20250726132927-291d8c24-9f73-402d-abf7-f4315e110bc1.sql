
-- Create students table for profile information
CREATE TABLE IF NOT EXISTS public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  education TEXT,
  career_goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_course_enrollments table
CREATE TABLE IF NOT EXISTS public.student_course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(user_id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused')),
  progress_percentage NUMERIC DEFAULT 0,
  UNIQUE(student_id, course_id)
);

-- Create student_lesson_progress table
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(user_id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  is_unlocked BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

-- Create quiz_submissions table
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(user_id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score NUMERIC,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_needed'))
);

-- Create theory_submissions table
CREATE TABLE IF NOT EXISTS public.theory_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(user_id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_needed')),
  feedback TEXT
);

-- Create review_results table
CREATE TABLE IF NOT EXISTS public.review_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(user_id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  submission_type TEXT CHECK (submission_type IN ('quiz', 'theory')),
  submission_id UUID,
  reviewer_id UUID REFERENCES auth.users(id),
  score NUMERIC,
  feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_needed')),
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  related_lesson_id UUID REFERENCES public.course_lessons(id),
  related_course_id UUID REFERENCES public.courses_enhanced(id)
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theory_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Students can view and update their own profile" ON public.students
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for enrollments
CREATE POLICY "Students can view their own enrollments" ON public.student_course_enrollments
  FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Create RLS policies for lesson progress
CREATE POLICY "Students can view and update their own progress" ON public.student_lesson_progress
  FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Create RLS policies for quiz submissions
CREATE POLICY "Students can manage their own quiz submissions" ON public.quiz_submissions
  FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Create RLS policies for theory submissions
CREATE POLICY "Students can manage their own theory submissions" ON public.theory_submissions
  FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Create RLS policies for review results
CREATE POLICY "Students can view their own review results" ON public.review_results
  FOR SELECT USING (auth.uid() = student_id);

-- Create RLS policies for notifications
CREATE POLICY "Students can view and update their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Create function to automatically create student profile
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.students (user_id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create student profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_student ON auth.users;
CREATE TRIGGER on_auth_user_created_student
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student();

-- Create function to unlock next lesson
CREATE OR REPLACE FUNCTION public.unlock_next_lesson(
  p_student_id UUID,
  p_course_id UUID,
  p_completed_lesson_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_lesson_id UUID;
  current_order_no INTEGER;
BEGIN
  -- Get the order number of the completed lesson
  SELECT cl.order_no INTO current_order_no
  FROM course_lessons cl
  JOIN course_modules cm ON cl.module_id = cm.id
  WHERE cl.id = p_completed_lesson_id AND cm.course_id = p_course_id;

  -- Find the next lesson in order
  SELECT cl.id INTO next_lesson_id
  FROM course_lessons cl
  JOIN course_modules cm ON cl.module_id = cm.id
  WHERE cm.course_id = p_course_id AND cl.order_no = current_order_no + 1
  ORDER BY cl.order_no
  LIMIT 1;

  -- Unlock the next lesson if it exists
  IF next_lesson_id IS NOT NULL THEN
    INSERT INTO student_lesson_progress (student_id, lesson_id, course_id, is_unlocked)
    VALUES (p_student_id, next_lesson_id, p_course_id, true)
    ON CONFLICT (student_id, lesson_id) 
    DO UPDATE SET is_unlocked = true;
  END IF;
END;
$$;
