-- Fix security warnings by setting proper search_path for functions
CREATE OR REPLACE FUNCTION public.enable_session_chat()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.close_expired_chats()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE mentor_sessions 
  SET chat_enabled = false 
  WHERE chat_enabled = true 
  AND chat_expires_at < now() 
  AND status != 'completed';
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_session_update()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;