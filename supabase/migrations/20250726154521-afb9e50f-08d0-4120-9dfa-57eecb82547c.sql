
-- Create tables for mentoring system
CREATE TABLE mentor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses_enhanced(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  duration_minutes INTEGER DEFAULT 120,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  student_notes TEXT,
  session_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  chat_enabled BOOLEAN DEFAULT false,
  chat_expires_at TIMESTAMP WITH TIME ZONE,
  session_completed_at TIMESTAMP WITH TIME ZONE
);

-- Create mentor chat messages table
CREATE TABLE mentor_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES mentor_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'summary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false
);

-- Create mentor session reports table
CREATE TABLE mentor_session_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES mentor_sessions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_progress_assessment TEXT NOT NULL,
  key_topics_discussed TEXT[],
  recommendations TEXT NOT NULL,
  next_steps TEXT,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_session_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for mentor_sessions
CREATE POLICY "Students can manage their own sessions" ON mentor_sessions
  FOR ALL USING (auth.uid() = student_id OR auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can view assigned sessions" ON mentor_sessions
  FOR SELECT USING (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update assigned sessions" ON mentor_sessions
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- RLS policies for mentor_chat_messages
CREATE POLICY "Session participants can access messages" ON mentor_chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM mentor_sessions ms 
      WHERE ms.id = mentor_chat_messages.session_id 
      AND (ms.student_id = auth.uid() OR ms.reviewer_id = auth.uid())
    )
  );

-- RLS policies for mentor_session_reports
CREATE POLICY "Reviewers can manage their reports" ON mentor_session_reports
  FOR ALL USING (auth.uid() = reviewer_id);

CREATE POLICY "Students can view their session reports" ON mentor_session_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mentor_sessions ms 
      WHERE ms.id = mentor_session_reports.session_id 
      AND ms.student_id = auth.uid()
    )
  );

-- Create function to automatically enable chat when session is accepted
CREATE OR REPLACE FUNCTION enable_session_chat()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    NEW.chat_enabled = true;
    NEW.chat_expires_at = (NEW.scheduled_date::timestamp + NEW.scheduled_time + (NEW.duration_minutes || ' minutes')::interval);
  END IF;
  
  -- Auto-disable chat after expiry
  IF NEW.status = 'completed' THEN
    NEW.chat_enabled = false;
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session status changes
CREATE TRIGGER session_status_trigger
  BEFORE UPDATE ON mentor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION enable_session_chat();

-- Create function to auto-close expired chats
CREATE OR REPLACE FUNCTION close_expired_chats()
RETURNS void AS $$
BEGIN
  UPDATE mentor_sessions 
  SET chat_enabled = false 
  WHERE chat_enabled = true 
  AND chat_expires_at < now() 
  AND status != 'completed';
END;
$$ LANGUAGE plpgsql;

-- Add realtime capabilities
ALTER TABLE mentor_sessions REPLICA IDENTITY FULL;
ALTER TABLE mentor_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE mentor_session_reports REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE mentor_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE mentor_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE mentor_session_reports;
