-- Add image_url column to courses_enhanced table
ALTER TABLE courses_enhanced ADD COLUMN IF NOT EXISTS image_url text;

-- Create notifications table for admin notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'enrollment',
  title text NOT NULL,
  message text NOT NULL,
  student_id uuid,
  course_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_notifications
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin notifications
CREATE POLICY "Admins can manage notifications" ON admin_notifications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Create function to notify admin of new enrollments
CREATE OR REPLACE FUNCTION notify_admin_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  student_name text;
  course_title text;
BEGIN
  -- Get student name
  SELECT name INTO student_name 
  FROM students 
  WHERE user_id = NEW.student_id;
  
  -- Get course title
  SELECT title INTO course_title 
  FROM courses_enhanced 
  WHERE id = NEW.course_id;
  
  -- Insert notification
  INSERT INTO admin_notifications (
    type,
    title,
    message,
    student_id,
    course_id
  ) VALUES (
    'enrollment',
    'New Student Enrollment',
    'Student ' || COALESCE(student_name, 'Unknown') || ' enrolled in course: ' || COALESCE(course_title, 'Unknown Course'),
    NEW.student_id,
    NEW.course_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for enrollment notifications
DROP TRIGGER IF EXISTS trigger_notify_admin_enrollment ON course_enrollments;
CREATE TRIGGER trigger_notify_admin_enrollment
  AFTER INSERT ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_enrollment();

-- Enable realtime for admin_notifications
ALTER TABLE admin_notifications REPLICA IDENTITY FULL;