
-- Create lookup tables for course metadata
CREATE TABLE public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.course_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  order_no INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.course_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced courses table
CREATE TABLE public.courses_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category_id UUID REFERENCES public.course_categories(id),
  level_id UUID REFERENCES public.course_levels(id),
  language_id UUID REFERENCES public.course_languages(id),
  duration_value INTEGER,
  duration_unit TEXT DEFAULT 'weeks' CHECK (duration_unit IN ('hours', 'days', 'weeks', 'months')),
  learning_objectives TEXT[],
  skills_taught TEXT[],
  prerequisites TEXT,
  target_audience TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course modules
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_no INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course lessons
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment', 'live_session', 'lab', 'workshop')),
  duration_minutes INTEGER,
  content_url TEXT,
  content_text TEXT,
  order_no INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domain-specific features
CREATE TABLE public.course_domain_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  lab_mode_enabled BOOLEAN DEFAULT FALSE,
  lab_resources TEXT[],
  case_studies_enabled BOOLEAN DEFAULT FALSE,
  case_study_urls TEXT[],
  coding_sandbox_enabled BOOLEAN DEFAULT FALSE,
  github_repo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engagement settings
CREATE TABLE public.course_engagement_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  discussion_groups_enabled BOOLEAN DEFAULT FALSE,
  domain_group_mapping JSONB,
  live_sessions_enabled BOOLEAN DEFAULT FALSE,
  live_session_schedule JSONB,
  mentor_assignments UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment settings
CREATE TABLE public.course_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  certification_enabled BOOLEAN DEFAULT FALSE,
  certification_criteria JSONB,
  pass_thresholds JSONB,
  certificate_template_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing plans
CREATE TABLE public.course_pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'plus', 'pro', 'enterprise')),
  price DECIMAL(10,2),
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course instructors junction table
CREATE TABLE public.course_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses_enhanced(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'instructor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, instructor_id)
);

-- Enhanced student progress
ALTER TABLE public.student_progress 
ADD COLUMN IF NOT EXISTS completion_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS match_score DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS student_skills TEXT[];

-- Insert default lookup data
INSERT INTO public.course_categories (name, description) VALUES
('Engineering', 'Engineering and technical courses'),
('Healthcare', 'Medical and healthcare courses'),
('Business', 'Business and management courses'),
('Law', 'Legal and compliance courses'),
('IT', 'Information Technology courses'),
('Design', 'Design and creative courses'),
('Marketing', 'Marketing and sales courses'),
('Other', 'Other specialized courses');

INSERT INTO public.course_levels (name, description, order_no) VALUES
('Foundation', 'Beginner level courses', 1),
('Intermediate', 'Intermediate level courses', 2),
('Advanced', 'Advanced level courses', 3);

INSERT INTO public.course_languages (name, code) VALUES
('English', 'en'),
('Spanish', 'es'),
('French', 'fr'),
('German', 'de'),
('Portuguese', 'pt'),
('Mandarin', 'zh'),
('Japanese', 'ja');

-- Enable RLS on all new tables
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_domain_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_engagement_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lookup tables (public read)
CREATE POLICY "Public read course categories" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Public read course levels" ON public.course_levels FOR SELECT USING (true);
CREATE POLICY "Public read course languages" ON public.course_languages FOR SELECT USING (true);

-- RLS Policies for courses_enhanced
CREATE POLICY "Admin full access courses" ON public.courses_enhanced FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own courses" ON public.courses_enhanced FOR ALL 
USING (auth.uid() = created_by AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Public read published courses" ON public.courses_enhanced FOR SELECT 
USING (status = 'published');

-- RLS Policies for course modules
CREATE POLICY "Admin full access modules" ON public.course_modules FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own course modules" ON public.course_modules FOR ALL 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND created_by = auth.uid()));

CREATE POLICY "Public read modules" ON public.course_modules FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND status = 'published'));

-- RLS Policies for course lessons
CREATE POLICY "Admin full access lessons" ON public.course_lessons FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own course lessons" ON public.course_lessons FOR ALL 
USING (EXISTS (SELECT 1 FROM public.course_modules cm JOIN public.courses_enhanced c ON cm.course_id = c.id WHERE cm.id = module_id AND c.created_by = auth.uid()));

CREATE POLICY "Public read lessons" ON public.course_lessons FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.course_modules cm JOIN public.courses_enhanced c ON cm.course_id = c.id WHERE cm.id = module_id AND c.status = 'published'));

-- RLS Policies for domain features
CREATE POLICY "Admin manage domain features" ON public.course_domain_features FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own domain features" ON public.course_domain_features FOR ALL 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND created_by = auth.uid()));

-- RLS Policies for engagement settings
CREATE POLICY "Admin manage engagement settings" ON public.course_engagement_settings FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own engagement settings" ON public.course_engagement_settings FOR ALL 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND created_by = auth.uid()));

-- RLS Policies for assessments
CREATE POLICY "Admin manage assessments" ON public.course_assessments FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own assessments" ON public.course_assessments FOR ALL 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND created_by = auth.uid()));

-- RLS Policies for pricing plans
CREATE POLICY "Admin manage pricing plans" ON public.course_pricing_plans FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own pricing plans" ON public.course_pricing_plans FOR ALL 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND created_by = auth.uid()));

CREATE POLICY "Public read pricing plans" ON public.course_pricing_plans FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND status = 'published'));

-- RLS Policies for course instructors
CREATE POLICY "Admin manage instructors" ON public.course_instructors FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff manage own course instructors" ON public.course_instructors FOR ALL 
USING (EXISTS (SELECT 1 FROM public.courses_enhanced WHERE id = course_id AND created_by = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_courses_enhanced_category ON public.courses_enhanced(category_id);
CREATE INDEX idx_courses_enhanced_level ON public.courses_enhanced(level_id);
CREATE INDEX idx_courses_enhanced_status ON public.courses_enhanced(status);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX idx_course_lessons_module ON public.course_lessons(module_id);
CREATE INDEX idx_course_instructors_course ON public.course_instructors(course_id);
CREATE INDEX idx_student_progress_user_course ON public.student_progress(user_id, course_id);
