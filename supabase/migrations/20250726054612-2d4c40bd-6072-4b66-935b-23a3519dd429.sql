-- Security fixes: Clean up RLS policies and improve database functions

-- Update get_user_role function with proper security
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(role, 'student') FROM users WHERE id = user_id;
$function$;

-- Clean up RLS policies on courses table (remove duplicates)
DROP POLICY IF EXISTS "Courses: Admin delete" ON courses;
DROP POLICY IF EXISTS "Courses: Admin insert" ON courses;
DROP POLICY IF EXISTS "Courses: Admin update" ON courses;
DROP POLICY IF EXISTS "Courses: Read for all" ON courses;
DROP POLICY IF EXISTS "Delete courses" ON courses;
DROP POLICY IF EXISTS "Insert courses" ON courses;
DROP POLICY IF EXISTS "Update courses" ON courses;
DROP POLICY IF EXISTS "View courses" ON courses;

-- Keep only essential policies for courses
CREATE POLICY "Courses: Public read" ON courses
FOR SELECT USING (true);

CREATE POLICY "Courses: Admin manage" ON courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Clean up RLS policies on lessons table (remove duplicates)
DROP POLICY IF EXISTS "Delete lessons" ON lessons;
DROP POLICY IF EXISTS "Insert lessons" ON lessons;
DROP POLICY IF EXISTS "Update lessons" ON lessons;
DROP POLICY IF EXISTS "View lessons" ON lessons;
DROP POLICY IF EXISTS "Lessons: Admin delete" ON lessons;
DROP POLICY IF EXISTS "Lessons: Admin insert" ON lessons;
DROP POLICY IF EXISTS "Lessons: Admin update" ON lessons;
DROP POLICY IF EXISTS "Lessons: Read for all" ON lessons;

-- Keep only essential policies for lessons
CREATE POLICY "Lessons: Public read" ON lessons
FOR SELECT USING (true);

CREATE POLICY "Lessons: Admin manage" ON lessons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Clean up student_progress policies (remove duplicates)
DROP POLICY IF EXISTS "Student: Insert own progress" ON student_progress;
DROP POLICY IF EXISTS "Student: Read own progress" ON student_progress;
DROP POLICY IF EXISTS "Student: Update own progress" ON student_progress;

-- Keep consolidated policies for student_progress
CREATE POLICY "Progress: Student manage own" ON student_progress
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure all critical tables have proper RLS policies with role-based access
-- Add missing role validation for courses_enhanced
ALTER POLICY "Admin and staff can manage courses" ON courses_enhanced 
USING (
  CASE
    WHEN auth.uid() IS NULL THEN false
    ELSE get_user_role(auth.uid()) = ANY (ARRAY['admin'::text, 'staff'::text])
  END
);

-- Add input length constraints for security
ALTER TABLE courses_enhanced 
ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 200),
ADD CONSTRAINT subtitle_length_check CHECK (char_length(subtitle) <= 300),
ADD CONSTRAINT description_length_check CHECK (char_length(description) <= 5000);

ALTER TABLE course_modules
ADD CONSTRAINT name_length_check CHECK (char_length(name) <= 200),
ADD CONSTRAINT description_length_check CHECK (char_length(description) <= 2000);

ALTER TABLE course_lessons
ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 200),
ADD CONSTRAINT content_text_length_check CHECK (char_length(content_text) <= 50000);

-- Add validation for user roles
ALTER TABLE users 
ADD CONSTRAINT valid_role_check CHECK (role IN ('admin', 'staff', 'reviewer', 'student'));

-- Improve feedback table security
ALTER TABLE feedback
ADD CONSTRAINT message_length_check CHECK (char_length(message) <= 2000);

-- Add constraints to prevent malicious data
ALTER TABLE users
ADD CONSTRAINT name_length_check CHECK (char_length(name) <= 100),
ADD CONSTRAINT email_length_check CHECK (char_length(email) <= 255);

-- Create index for better performance on role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS on any tables that might be missing it
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;