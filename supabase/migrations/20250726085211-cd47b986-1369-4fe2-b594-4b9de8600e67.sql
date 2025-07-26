
-- Modify existing courses table to support the new structure
ALTER TABLE courses ADD COLUMN IF NOT EXISTS domain text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration integer;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS draft boolean DEFAULT true;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS slug text;

-- Modify existing lessons table to support the new lesson structure
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS theory_task text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz_json jsonb;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS workspace_task text;

-- Create new course_reviewers table
CREATE TABLE IF NOT EXISTS course_reviewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  UNIQUE(course_id, reviewer_id)
);

-- Create new lesson_workspace_map table
CREATE TABLE IF NOT EXISTS lesson_workspace_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  workspace_id text NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE course_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_workspace_map ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_reviewers
CREATE POLICY "Admin manage course reviewers" ON course_reviewers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Reviewers can view their assignments" ON course_reviewers
  FOR SELECT USING (reviewer_id = auth.uid());

-- RLS policies for lesson_workspace_map
CREATE POLICY "Admin manage lesson workspace map" ON lesson_workspace_map
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Students can view lesson workspaces" ON lesson_workspace_map
  FOR SELECT USING (true);
