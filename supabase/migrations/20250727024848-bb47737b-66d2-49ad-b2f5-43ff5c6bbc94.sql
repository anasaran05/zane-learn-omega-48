-- Create trashed_courses table
CREATE TABLE trashed_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_course_id uuid NOT NULL,
  course_data jsonb NOT NULL,
  trashed_at timestamp with time zone DEFAULT now(),
  trashed_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on trashed_courses
ALTER TABLE trashed_courses ENABLE ROW LEVEL SECURITY;

-- Create policy for trashed courses (admin only)
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
  course_data jsonb;
BEGIN
  -- Get the course data
  SELECT to_jsonb(courses_enhanced.*) INTO course_data
  FROM courses_enhanced 
  WHERE id = course_id;

  IF course_data IS NULL THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- Insert into trashed_courses
  INSERT INTO trashed_courses (original_course_id, course_data, trashed_by)
  VALUES (course_id, course_data, auth.uid());

  -- Delete related data (cascade delete)
  DELETE FROM course_modules WHERE course_id = course_id;
  DELETE FROM course_assessments WHERE course_id = course_id;
  DELETE FROM course_domain_features WHERE course_id = course_id;
  DELETE FROM course_engagement_settings WHERE course_id = course_id;
  DELETE FROM course_instructors WHERE course_id = course_id;
  DELETE FROM course_pricing_plans WHERE course_id = course_id;
  DELETE FROM course_reviewers WHERE course_id = course_id;
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
  course_data jsonb;
  new_course_id uuid;
  original_id uuid;
BEGIN
  -- Get the trashed course data
  SELECT tc.course_data, tc.original_course_id INTO course_data, original_id
  FROM trashed_courses tc
  WHERE tc.id = trashed_course_id;

  IF course_data IS NULL THEN
    RAISE EXCEPTION 'Trashed course not found';
  END IF;

  -- Generate new course ID
  new_course_id := gen_random_uuid();

  -- Insert restored course with new ID
  INSERT INTO courses_enhanced (
    id, title, subtitle, description, category_id, level_id, language_id,
    duration_value, duration_unit, learning_objectives, skills_taught,
    prerequisites, target_audience, status, image_url, created_by, created_at, updated_at
  ) VALUES (
    new_course_id,
    (course_data->>'title')::text,
    (course_data->>'subtitle')::text,
    (course_data->>'description')::text,
    (course_data->>'category_id')::uuid,
    (course_data->>'level_id')::uuid,
    (course_data->>'language_id')::uuid,
    (course_data->>'duration_value')::integer,
    (course_data->>'duration_unit')::text,
    (course_data->'learning_objectives')::text[],
    (course_data->'skills_taught')::text[],
    (course_data->>'prerequisites')::text,
    (course_data->'target_audience')::text[],
    'draft', -- Always restore as draft
    (course_data->>'image_url')::text,
    auth.uid(),
    now(),
    now()
  );

  -- Remove from trash
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

-- Function to auto-cleanup expired trashed courses (30 days)
CREATE OR REPLACE FUNCTION cleanup_expired_trashed_courses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM trashed_courses 
  WHERE trashed_at < (now() - interval '30 days');
END;
$$;

-- Enable realtime for trashed_courses
ALTER TABLE trashed_courses REPLICA IDENTITY FULL;