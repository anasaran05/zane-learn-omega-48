-- Create storage buckets for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Create storage policies for profile images
CREATE POLICY "Users can upload their own profile image"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own profile image"
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile image"
ON storage.objects FOR UPDATE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile images are publicly viewable"
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-images');

-- Add profile image column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create admin notifications table for enrollment notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'enrollment',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  student_id UUID REFERENCES students(user_id),
  course_id UUID REFERENCES courses_enhanced(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin notifications
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all notifications
CREATE POLICY "Admins can view all notifications"
ON admin_notifications FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Function to create enrollment notification
CREATE OR REPLACE FUNCTION create_enrollment_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (
    type,
    title,
    message,
    student_id,
    course_id
  ) VALUES (
    'enrollment',
    'New Course Enrollment',
    'A student has enrolled in a course',
    NEW.student_id,
    NEW.course_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for enrollment notifications
DROP TRIGGER IF EXISTS enrollment_notification_trigger ON student_course_enrollments;
CREATE TRIGGER enrollment_notification_trigger
  AFTER INSERT ON student_course_enrollments
  FOR EACH ROW EXECUTE FUNCTION create_enrollment_notification();

-- Enable realtime for key tables
ALTER TABLE student_course_enrollments REPLICA IDENTITY FULL;
ALTER TABLE student_lesson_progress REPLICA IDENTITY FULL;
ALTER TABLE admin_notifications REPLICA IDENTITY FULL;
ALTER TABLE support_tickets REPLICA IDENTITY FULL;
ALTER TABLE students REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE student_course_enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE student_lesson_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE students;