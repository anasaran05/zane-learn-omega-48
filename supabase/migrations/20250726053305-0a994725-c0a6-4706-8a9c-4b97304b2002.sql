-- First, let's ensure we have some basic lookup data
INSERT INTO course_categories (name, description) VALUES 
('Technology', 'Technology and programming courses'),
('Business', 'Business and management courses'),
('Design', 'Design and creative courses'),
('Marketing', 'Marketing and sales courses')
ON CONFLICT (name) DO NOTHING;

INSERT INTO course_levels (name, description, order_no) VALUES 
('Beginner', 'For those new to the subject', 1),
('Intermediate', 'For those with some experience', 2),
('Advanced', 'For experienced learners', 3),
('Expert', 'For subject matter experts', 4)
ON CONFLICT (name) DO NOTHING;

INSERT INTO course_languages (name, code) VALUES 
('English', 'en'),
('Spanish', 'es'),
('French', 'fr'),
('German', 'de')
ON CONFLICT (code) DO NOTHING;

-- Create a function to get user role safely
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(role, 'student') FROM users WHERE id = user_id;
$$;

-- Update RLS policies to allow admin users to create courses without auth issues
DROP POLICY IF EXISTS "Admin full access courses" ON courses_enhanced;
DROP POLICY IF EXISTS "Staff manage own courses" ON courses_enhanced;
DROP POLICY IF EXISTS "Public read published courses" ON courses_enhanced;

-- Create more permissive policies for course creation
CREATE POLICY "Admin and staff can manage courses" ON courses_enhanced
FOR ALL USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE get_user_role(auth.uid()) IN ('admin', 'staff')
  END
);

-- Allow public to read published courses
CREATE POLICY "Public can read published courses" ON courses_enhanced
FOR SELECT USING (status = 'published');

-- Make sure we have at least one admin user
UPDATE users SET role = 'admin' WHERE id = (SELECT id FROM users WHERE email IS NOT NULL ORDER BY created_at ASC FETCH FIRST 1 ROWS ONLY);