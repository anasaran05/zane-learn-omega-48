-- Complete Student Portal Schema Enhancement

-- 1. Enhance student achievements system
CREATE TABLE IF NOT EXISTS student_achievement_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(user_id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, achievement_id)
);

-- 2. Real assignments system
CREATE TABLE IF NOT EXISTS course_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses_enhanced(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  assignment_type TEXT NOT NULL DEFAULT 'essay',
  max_score INTEGER DEFAULT 100,
  instructions TEXT,
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Student assignment submissions
CREATE TABLE IF NOT EXISTS student_assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES course_assignments(id) NOT NULL,
  student_id UUID REFERENCES students(user_id) NOT NULL,
  content TEXT,
  file_urls TEXT[],
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  score INTEGER,
  feedback TEXT,
  status TEXT DEFAULT 'submitted',
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- 4. Student certificates
CREATE TABLE IF NOT EXISTS student_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(user_id) NOT NULL,
  course_id UUID REFERENCES courses_enhanced(id) NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  completion_date DATE NOT NULL,
  score INTEGER NOT NULL,
  certificate_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Student dashboard analytics
CREATE TABLE IF NOT EXISTS student_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(user_id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  lessons_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  quiz_attempts INTEGER DEFAULT 0,
  assignments_submitted INTEGER DEFAULT 0,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, date)
);

-- 6. Enhanced student settings
ALTER TABLE student_settings ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE student_settings ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE student_settings ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private';
ALTER TABLE student_settings ADD COLUMN IF NOT EXISTS study_reminders BOOLEAN DEFAULT true;
ALTER TABLE student_settings ADD COLUMN IF NOT EXISTS weekly_goals INTEGER DEFAULT 5;

-- Enable RLS for new tables
ALTER TABLE student_achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student achievement progress
CREATE POLICY "Students can view their own achievement progress"
ON student_achievement_progress FOR ALL
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all achievement progress"
ON student_achievement_progress FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Create RLS policies for course assignments
CREATE POLICY "Students can view published assignments"
ON course_assignments FOR SELECT
USING (true);

CREATE POLICY "Admins can manage assignments"
ON course_assignments FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Create RLS policies for assignment submissions
CREATE POLICY "Students can manage their own submissions"
ON student_assignment_submissions FOR ALL
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all submissions"
ON student_assignment_submissions FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Create RLS policies for certificates
CREATE POLICY "Students can view their own certificates"
ON student_certificates FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage all certificates"
ON student_certificates FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Create RLS policies for analytics
CREATE POLICY "Students can view their own analytics"
ON student_analytics FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own analytics"
ON student_analytics FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all analytics"
ON student_analytics FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Add sample data for testing
INSERT INTO achievements (title, description, icon, criteria, rarity) VALUES
('First Steps', 'Complete your first lesson', 'trophy', '{"lessons_completed": 1}', 'common'),
('Course Starter', 'Enroll in your first course', 'book-open', '{"courses_enrolled": 1}', 'common'),
('Perfect Score', 'Get 100% on any assignment', 'award', '{"perfect_scores": 1}', 'rare'),
('Dedicated Learner', 'Complete 10 lessons', 'target', '{"lessons_completed": 10}', 'uncommon'),
('Course Master', 'Complete an entire course', 'graduation-cap', '{"courses_completed": 1}', 'rare')
ON CONFLICT (title) DO NOTHING;

-- Function to auto-generate certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update student analytics
CREATE OR REPLACE FUNCTION update_student_analytics(
  p_student_id UUID,
  p_lessons_completed INTEGER DEFAULT 0,
  p_time_spent_minutes INTEGER DEFAULT 0,
  p_quiz_attempts INTEGER DEFAULT 0,
  p_assignments_submitted INTEGER DEFAULT 0,
  p_login_count INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO student_analytics (
    student_id, 
    lessons_completed, 
    time_spent_minutes, 
    quiz_attempts, 
    assignments_submitted, 
    login_count
  ) VALUES (
    p_student_id,
    p_lessons_completed,
    p_time_spent_minutes,
    p_quiz_attempts,
    p_assignments_submitted,
    p_login_count
  )
  ON CONFLICT (student_id, date) 
  DO UPDATE SET
    lessons_completed = student_analytics.lessons_completed + p_lessons_completed,
    time_spent_minutes = student_analytics.time_spent_minutes + p_time_spent_minutes,
    quiz_attempts = student_analytics.quiz_attempts + p_quiz_attempts,
    assignments_submitted = student_analytics.assignments_submitted + p_assignments_submitted,
    login_count = student_analytics.login_count + p_login_count,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for all new tables
ALTER TABLE student_achievement_progress REPLICA IDENTITY FULL;
ALTER TABLE course_assignments REPLICA IDENTITY FULL;
ALTER TABLE student_assignment_submissions REPLICA IDENTITY FULL;
ALTER TABLE student_certificates REPLICA IDENTITY FULL;
ALTER TABLE student_analytics REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE student_achievement_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE course_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE student_assignment_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE student_certificates;
ALTER PUBLICATION supabase_realtime ADD TABLE student_analytics;