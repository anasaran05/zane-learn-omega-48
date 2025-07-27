-- Create trashed_courses table
CREATE TABLE IF NOT EXISTS trashed_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_course_id uuid NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  category_id uuid,
  level_id uuid,
  language_id uuid,
  duration_value integer,
  duration_unit text DEFAULT 'weeks',
  learning_objectives text[],
  skills_taught text[],
  prerequisites text,
  target_audience text[],
  status text DEFAULT 'trashed',
  created_by uuid,
  original_created_at timestamp with time zone,
  trashed_at timestamp with time zone DEFAULT now(),
  trashed_by uuid DEFAULT auth.uid(),
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days')
);

-- Enable RLS on trashed_courses
ALTER TABLE trashed_courses ENABLE ROW LEVEL SECURITY;

-- Create policies for trashed_courses
CREATE POLICY "Admins can manage trashed courses" ON trashed_courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Function to move course to trash
CREATE OR REPLACE FUNCTION move_course_to_trash(course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  course_record record;
BEGIN
  -- Get the course data
  SELECT * INTO course_record
  FROM courses_enhanced
  WHERE id = course_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;
  
  -- Insert into trashed_courses
  INSERT INTO trashed_courses (
    original_course_id,
    title,
    subtitle,
    description,
    image_url,
    category_id,
    level_id,
    language_id,
    duration_value,
    duration_unit,
    learning_objectives,
    skills_taught,
    prerequisites,
    target_audience,
    status,
    created_by,
    original_created_at,
    trashed_by
  ) VALUES (
    course_record.id,
    course_record.title,
    course_record.subtitle,
    course_record.description,
    course_record.image_url,
    course_record.category_id,
    course_record.level_id,
    course_record.language_id,
    course_record.duration_value,
    course_record.duration_unit,
    course_record.learning_objectives,
    course_record.skills_taught,
    course_record.prerequisites,
    course_record.target_audience,
    'trashed',
    course_record.created_by,
    course_record.created_at,
    auth.uid()
  );
  
  -- Delete related data
  DELETE FROM course_modules WHERE course_id = course_id;
  DELETE FROM course_enrollments WHERE course_id = course_id;
  DELETE FROM course_reviewers WHERE course_id = course_id;
  DELETE FROM course_instructors WHERE course_id = course_id;
  DELETE FROM course_pricing_plans WHERE course_id = course_id;
  DELETE FROM course_assessments WHERE course_id = course_id;
  DELETE FROM course_domain_features WHERE course_id = course_id;
  DELETE FROM course_engagement_settings WHERE course_id = course_id;
  DELETE FROM course_assignments WHERE course_id = course_id;
  
  -- Finally delete the main course
  DELETE FROM courses_enhanced WHERE id = course_id;
END;
$$;

-- Function to restore course from trash
CREATE OR REPLACE FUNCTION restore_course_from_trash(trashed_course_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  trashed_record record;
  new_course_id uuid;
BEGIN
  -- Get the trashed course data
  SELECT * INTO trashed_record
  FROM trashed_courses
  WHERE id = trashed_course_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trashed course not found';
  END IF;
  
  -- Insert back into courses_enhanced
  INSERT INTO courses_enhanced (
    title,
    subtitle,
    description,
    image_url,
    category_id,
    level_id,
    language_id,
    duration_value,
    duration_unit,
    learning_objectives,
    skills_taught,
    prerequisites,
    target_audience,
    status,
    created_by,
    created_at
  ) VALUES (
    trashed_record.title,
    trashed_record.subtitle,
    trashed_record.description,
    trashed_record.image_url,
    trashed_record.category_id,
    trashed_record.level_id,
    trashed_record.language_id,
    trashed_record.duration_value,
    trashed_record.duration_unit,
    trashed_record.learning_objectives,
    trashed_record.skills_taught,
    trashed_record.prerequisites,
    trashed_record.target_audience,
    'draft',
    trashed_record.created_by,
    trashed_record.original_created_at
  ) RETURNING id INTO new_course_id;
  
  -- Delete from trashed_courses
  DELETE FROM trashed_courses WHERE id = trashed_course_id;
  
  RETURN new_course_id;
END;
$$;

-- Function to permanently delete trashed course
CREATE OR REPLACE FUNCTION permanently_delete_trashed_course(trashed_course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM trashed_courses WHERE id = trashed_course_id;
END;
$$;

-- Function to auto-cleanup expired trashed courses
CREATE OR REPLACE FUNCTION cleanup_expired_trashed_courses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM trashed_courses WHERE expires_at < now();
END;
$$;

-- Enable realtime for trashed_courses
ALTER TABLE trashed_courses REPLICA IDENTITY FULL;