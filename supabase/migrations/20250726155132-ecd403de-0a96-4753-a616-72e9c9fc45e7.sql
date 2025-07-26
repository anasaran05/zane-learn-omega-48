-- Fix any potential issues and ensure all tables are properly set up
-- Create missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_student_id ON mentor_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_reviewer_id ON mentor_sessions(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_status ON mentor_sessions(status);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_scheduled_date ON mentor_sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_mentor_chat_messages_session_id ON mentor_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_mentor_chat_messages_created_at ON mentor_chat_messages(created_at);

-- Ensure proper triggers are in place
DROP TRIGGER IF EXISTS session_status_trigger ON mentor_sessions;
CREATE TRIGGER session_status_trigger
  BEFORE UPDATE ON mentor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION enable_session_chat();

-- Add notification function for real-time updates
CREATE OR REPLACE FUNCTION notify_session_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'session_update',
    json_build_object(
      'action', TG_OP,
      'session_id', COALESCE(NEW.id, OLD.id),
      'student_id', COALESCE(NEW.student_id, OLD.student_id),
      'reviewer_id', COALESCE(NEW.reviewer_id, OLD.reviewer_id),
      'status', COALESCE(NEW.status, OLD.status)
    )::text
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
DROP TRIGGER IF EXISTS notify_session_changes ON mentor_sessions;
CREATE TRIGGER notify_session_changes
  AFTER INSERT OR UPDATE OR DELETE ON mentor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION notify_session_update();