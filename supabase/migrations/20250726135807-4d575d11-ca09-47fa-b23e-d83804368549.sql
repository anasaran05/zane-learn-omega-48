
-- Create student settings table to store user preferences
CREATE TABLE public.student_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dark_mode BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  autoplay_videos BOOLEAN DEFAULT true,
  sound_effects BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id)
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT DEFAULT 'common',
  criteria JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student achievements (earned achievements)
CREATE TABLE public.student_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress INTEGER DEFAULT 100,
  UNIQUE(student_id, achievement_id)
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL,
  completed_date DATE NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignments table  
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'not_started',
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.student_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_settings
CREATE POLICY "Students can manage their own settings" ON public.student_settings
FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all settings" ON public.student_settings
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- RLS Policies for support_tickets
CREATE POLICY "Students can manage their own tickets" ON public.support_tickets
FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all tickets" ON public.support_tickets
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- RLS Policies for achievements (read-only for students)
CREATE POLICY "Public can read achievements" ON public.achievements
FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- RLS Policies for student_achievements
CREATE POLICY "Students can view their own achievements" ON public.student_achievements
FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "System can insert achievements" ON public.student_achievements
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all student achievements" ON public.student_achievements
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- RLS Policies for certificates
CREATE POLICY "Students can view their own certificates" ON public.certificates
FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "System can insert certificates" ON public.certificates
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all certificates" ON public.certificates
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- RLS Policies for assignments
CREATE POLICY "Students can view assignments" ON public.assignments
FOR SELECT USING (true);

CREATE POLICY "Admins can manage assignments" ON public.assignments
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- RLS Policies for assignment_submissions
CREATE POLICY "Students can manage their own submissions" ON public.assignment_submissions
FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all submissions" ON public.assignment_submissions
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- Insert sample achievements
INSERT INTO public.achievements (title, description, icon, rarity, criteria) VALUES 
('First Steps', 'Complete your first lesson', 'BookOpen', 'common', '{"type": "lesson_completed", "count": 1}'),
('Perfect Score', 'Score 100% on any quiz', 'Star', 'rare', '{"type": "quiz_score", "score": 100}'),
('Course Master', 'Complete your first full course', 'Trophy', 'epic', '{"type": "course_completed", "count": 1}'),
('Learning Streak', 'Learn for 7 consecutive days', 'Target', 'rare', '{"type": "streak_days", "days": 7}'),
('Elite Student', 'Complete 3 courses with 90+ average', 'Crown', 'legendary', '{"type": "course_avg_score", "count": 3, "avg_score": 90}'),
('Speed Learner', 'Complete a lesson in under 10 minutes', 'Zap', 'rare', '{"type": "lesson_time", "max_minutes": 10}'),
('Dedication', 'Learn for 30 consecutive days', 'Medal', 'epic', '{"type": "streak_days", "days": 30}'),
('Knowledge Seeker', 'Complete 10 courses', 'Award', 'legendary', '{"type": "course_completed", "count": 10}');

-- Enable realtime for admin tracking
ALTER TABLE public.student_lesson_progress REPLICA IDENTITY FULL;
ALTER TABLE public.student_course_enrollments REPLICA IDENTITY FULL;
ALTER TABLE public.student_settings REPLICA IDENTITY FULL;
ALTER TABLE public.support_tickets REPLICA IDENTITY FULL;
ALTER TABLE public.student_achievements REPLICA IDENTITY FULL;
ALTER TABLE public.certificates REPLICA IDENTITY FULL;
ALTER TABLE public.assignment_submissions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_lesson_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_course_enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_achievements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignment_submissions;
