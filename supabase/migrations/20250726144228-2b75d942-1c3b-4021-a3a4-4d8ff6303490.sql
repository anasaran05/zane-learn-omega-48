-- Fix student record creation for enrollment issue

-- First, ensure all existing users have student records
INSERT INTO public.students (user_id, name, email)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', u.email),
  u.email
FROM auth.users u
LEFT JOIN public.students s ON s.user_id = u.id
WHERE s.user_id IS NULL;

-- Update the trigger to be more robust
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function to handle student record creation better
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.students (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student();

-- Add unique constraint to prevent duplicates
ALTER TABLE public.students 
ADD CONSTRAINT students_user_id_unique UNIQUE (user_id);