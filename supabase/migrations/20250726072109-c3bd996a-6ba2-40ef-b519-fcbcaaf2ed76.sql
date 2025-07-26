
-- Create the core courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course modules table
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('video', 'quiz', 'task')),
  title TEXT NOT NULL,
  content JSONB,
  order_no INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student progress table
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id),
  course_id UUID REFERENCES public.courses(id),
  module_id UUID REFERENCES public.course_modules(id),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES public.users(id),
  student_id UUID REFERENCES public.users(id),
  course_id UUID REFERENCES public.courses(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create platform settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Admin can manage all courses" ON public.courses
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can read published courses" ON public.courses
  FOR SELECT USING (true);

-- RLS Policies for course_modules
CREATE POLICY "Admin can manage all modules" ON public.course_modules
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can read modules" ON public.course_modules
  FOR SELECT USING (true);

-- RLS Policies for student_progress
CREATE POLICY "Students can manage own progress" ON public.student_progress
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Admin can view all progress" ON public.student_progress
  FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'reviewer'));

-- RLS Policies for reviews
CREATE POLICY "Reviewers can manage own reviews" ON public.reviews
  FOR ALL USING (auth.uid() = reviewer_id);

CREATE POLICY "Admin can manage all reviews" ON public.reviews
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Students can view reviews for their courses" ON public.reviews
  FOR SELECT USING (auth.uid() = student_id);

-- RLS Policies for platform_settings
CREATE POLICY "Admin can manage settings" ON public.platform_settings
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Insert some initial platform settings
INSERT INTO public.platform_settings (key, value) VALUES 
  ('platform_name', '"Zane Omega LMS"'),
  ('theme', '{"primary": "cherry", "secondary": "maroon"}'),
  ('features', '{"realtime_updates": true, "analytics": true}')
ON CONFLICT (key) DO NOTHING;
