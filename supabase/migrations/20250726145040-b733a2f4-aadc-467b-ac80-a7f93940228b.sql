-- Fix the achievements conflict and complete student portal schema

-- 1. Check if achievements already exist, if not create them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM achievements WHERE title = 'First Steps') THEN
    INSERT INTO achievements (title, description, icon, criteria, rarity) VALUES
    ('First Steps', 'Complete your first lesson', 'trophy', '{"lessons_completed": 1}', 'common'),
    ('Course Starter', 'Enroll in your first course', 'book-open', '{"courses_enrolled": 1}', 'common'),
    ('Perfect Score', 'Get 100% on any assignment', 'award', '{"perfect_scores": 1}', 'rare'),
    ('Dedicated Learner', 'Complete 10 lessons', 'target', '{"lessons_completed": 10}', 'uncommon'),
    ('Course Master', 'Complete an entire course', 'graduation-cap', '{"courses_completed": 1}', 'rare');
  END IF;
END $$;

-- 2. Enhanced student achievements system
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

-- 3. Real assignments system
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

-- 4. Student assignment submissions
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

-- 5. Student certificates
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

-- 6. Student dashboard analytics
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

-- Enable RLS for new tables
ALTER TABLE student_achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_analytics ENABLE ROW LEVEL SECURITY;