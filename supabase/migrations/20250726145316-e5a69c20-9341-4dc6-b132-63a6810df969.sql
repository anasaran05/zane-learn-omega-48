-- Add missing RLS policies for all new tables

-- Policies for student_achievement_progress
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

-- Policies for course_assignments
CREATE POLICY "Students can view published assignments"
ON course_assignments FOR SELECT
USING (true);

CREATE POLICY "Admins can manage assignments"
ON course_assignments FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Policies for student_assignment_submissions
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

-- Policies for student_certificates
CREATE POLICY "Students can view their own certificates"
ON student_certificates FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage all certificates"
ON student_certificates FOR ALL
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Policies for student_analytics
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

-- Function to auto-generate certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;