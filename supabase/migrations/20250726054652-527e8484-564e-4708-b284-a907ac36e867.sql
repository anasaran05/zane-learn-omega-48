-- Security fixes: Clean up RLS policies and improve database functions (Part 2)

-- Update get_user_role function with proper security
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(role, 'student') FROM users WHERE id = user_id;
$function$;

-- Clean up RLS policies on courses table (remove duplicates) - check before dropping
DO $$
BEGIN
  -- Drop duplicate policies if they exist
  DROP POLICY IF EXISTS "Courses: Admin delete" ON courses;
  DROP POLICY IF EXISTS "Courses: Admin insert" ON courses;
  DROP POLICY IF EXISTS "Courses: Admin update" ON courses;
  DROP POLICY IF EXISTS "Courses: Read for all" ON courses;
  DROP POLICY IF EXISTS "Delete courses" ON courses;
  DROP POLICY IF EXISTS "Insert courses" ON courses;
  DROP POLICY IF EXISTS "Update courses" ON courses;
  DROP POLICY IF EXISTS "View courses" ON courses;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add admin management policy for courses if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'courses' AND policyname = 'Courses: Admin manage'
  ) THEN
    EXECUTE 'CREATE POLICY "Courses: Admin manage" ON courses
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() AND users.role = ''admin''
      )
    )';
  END IF;
END $$;

-- Clean up RLS policies on lessons table
DO $$
BEGIN
  DROP POLICY IF EXISTS "Delete lessons" ON lessons;
  DROP POLICY IF EXISTS "Insert lessons" ON lessons;
  DROP POLICY IF EXISTS "Update lessons" ON lessons;
  DROP POLICY IF EXISTS "View lessons" ON lessons;
  DROP POLICY IF EXISTS "Lessons: Admin delete" ON lessons;
  DROP POLICY IF EXISTS "Lessons: Admin insert" ON lessons;
  DROP POLICY IF EXISTS "Lessons: Admin update" ON lessons;
  DROP POLICY IF EXISTS "Lessons: Read for all" ON lessons;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add admin management policy for lessons if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lessons' AND policyname = 'Lessons: Admin manage'
  ) THEN
    EXECUTE 'CREATE POLICY "Lessons: Admin manage" ON lessons
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() AND users.role = ''admin''
      )
    )';
  END IF;
END $$;

-- Add input length constraints for security (check if constraints exist first)
DO $$
BEGIN
  -- Check and add constraints for courses_enhanced
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'title_length_check' AND table_name = 'courses_enhanced'
  ) THEN
    ALTER TABLE courses_enhanced ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 200);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'subtitle_length_check' AND table_name = 'courses_enhanced'
  ) THEN
    ALTER TABLE courses_enhanced ADD CONSTRAINT subtitle_length_check CHECK (char_length(subtitle) <= 300);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'description_length_check' AND table_name = 'courses_enhanced'
  ) THEN
    ALTER TABLE courses_enhanced ADD CONSTRAINT description_length_check CHECK (char_length(description) <= 5000);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add validation for user roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'valid_role_check' AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT valid_role_check CHECK (role IN ('admin', 'staff', 'reviewer', 'student'));
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create indexes for better performance on role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS on any tables that might be missing it
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;