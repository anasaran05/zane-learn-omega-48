export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          criteria: Json
          description: string
          icon: string
          id: string
          rarity: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          description: string
          icon: string
          id?: string
          rarity?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          rarity?: string | null
          title?: string
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          content: string | null
          created_at: string | null
          feedback: string | null
          file_url: string | null
          graded_at: string | null
          id: string
          score: number | null
          status: string | null
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          assignment_id: string
          content?: string | null
          created_at?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          id?: string
          score?: number | null
          status?: string | null
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string
          content?: string | null
          created_at?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          id?: string
          score?: number | null
          status?: string | null
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          course_id: string
          created_at: string | null
          description: string
          due_date: string
          id: string
          title: string
          type: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          title: string
          type: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_id: string
          certificate_url: string | null
          completed_date: string
          course_id: string
          created_at: string | null
          id: string
          score: number
          student_id: string
          title: string
        }
        Insert: {
          certificate_id: string
          certificate_url?: string | null
          completed_date: string
          course_id: string
          created_at?: string | null
          id?: string
          score: number
          student_id: string
          title: string
        }
        Update: {
          certificate_id?: string
          certificate_url?: string | null
          completed_date?: string
          course_id?: string
          created_at?: string | null
          id?: string
          score?: number
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_assessments: {
        Row: {
          certificate_template_url: string | null
          certification_criteria: Json | null
          certification_enabled: boolean | null
          course_id: string | null
          created_at: string | null
          id: string
          pass_thresholds: Json | null
        }
        Insert: {
          certificate_template_url?: string | null
          certification_criteria?: Json | null
          certification_enabled?: boolean | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          pass_thresholds?: Json | null
        }
        Update: {
          certificate_template_url?: string | null
          certification_criteria?: Json | null
          certification_enabled?: boolean | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          pass_thresholds?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "course_assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_assignments: {
        Row: {
          assignment_type: string
          course_id: string
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          instructions: string | null
          max_score: number | null
          resources: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignment_type?: string
          course_id: string
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          instructions?: string | null
          max_score?: number | null
          resources?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignment_type?: string
          course_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          instructions?: string | null
          max_score?: number | null
          resources?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_domain_features: {
        Row: {
          case_studies_enabled: boolean | null
          case_study_urls: string[] | null
          coding_sandbox_enabled: boolean | null
          course_id: string | null
          created_at: string | null
          github_repo_url: string | null
          id: string
          lab_mode_enabled: boolean | null
          lab_resources: string[] | null
        }
        Insert: {
          case_studies_enabled?: boolean | null
          case_study_urls?: string[] | null
          coding_sandbox_enabled?: boolean | null
          course_id?: string | null
          created_at?: string | null
          github_repo_url?: string | null
          id?: string
          lab_mode_enabled?: boolean | null
          lab_resources?: string[] | null
        }
        Update: {
          case_studies_enabled?: boolean | null
          case_study_urls?: string[] | null
          coding_sandbox_enabled?: boolean | null
          course_id?: string | null
          created_at?: string | null
          github_repo_url?: string | null
          id?: string
          lab_mode_enabled?: boolean | null
          lab_resources?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_domain_features_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_engagement_settings: {
        Row: {
          course_id: string | null
          created_at: string | null
          discussion_groups_enabled: boolean | null
          domain_group_mapping: Json | null
          id: string
          live_session_schedule: Json | null
          live_sessions_enabled: boolean | null
          mentor_assignments: string[] | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          discussion_groups_enabled?: boolean | null
          domain_group_mapping?: Json | null
          id?: string
          live_session_schedule?: Json | null
          live_sessions_enabled?: boolean | null
          mentor_assignments?: string[] | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          discussion_groups_enabled?: boolean | null
          domain_group_mapping?: Json | null
          id?: string
          live_session_schedule?: Json | null
          live_sessions_enabled?: boolean | null
          mentor_assignments?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_engagement_settings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_instructors: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          instructor_id: string | null
          role: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          role?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_instructors_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_instructors_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_languages: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          content_text: string | null
          content_url: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          lesson_type: string
          module_id: string | null
          order_no: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content_text?: string | null
          content_url?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_type: string
          module_id?: string | null
          order_no: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content_text?: string | null
          content_url?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_type?: string
          module_id?: string | null
          order_no?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_levels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_no: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_no?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_no?: number | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_no: number
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_no: number
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_no?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_pricing_plans: {
        Row: {
          course_id: string | null
          created_at: string | null
          features: string[] | null
          id: string
          price: number | null
          tier: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          price?: number | null
          tier: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          price?: number | null
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_pricing_plans_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviewers: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          reviewer_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          reviewer_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviewers_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviewers_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          domain: string | null
          draft: boolean | null
          duration: number | null
          id: string
          published: boolean | null
          slug: string | null
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          domain?: string | null
          draft?: boolean | null
          duration?: number | null
          id?: string
          published?: boolean | null
          slug?: string | null
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          domain?: string | null
          draft?: boolean | null
          duration?: number | null
          id?: string
          published?: boolean | null
          slug?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses_enhanced: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_unit: string | null
          duration_value: number | null
          id: string
          language_id: string | null
          learning_objectives: string[] | null
          level_id: string | null
          prerequisites: string | null
          skills_taught: string[] | null
          status: string | null
          subtitle: string | null
          target_audience: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_unit?: string | null
          duration_value?: number | null
          id?: string
          language_id?: string | null
          learning_objectives?: string[] | null
          level_id?: string | null
          prerequisites?: string | null
          skills_taught?: string[] | null
          status?: string | null
          subtitle?: string | null
          target_audience?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_unit?: string | null
          duration_value?: number | null
          id?: string
          language_id?: string | null
          learning_objectives?: string[] | null
          level_id?: string | null
          prerequisites?: string | null
          skills_taught?: string[] | null
          status?: string | null
          subtitle?: string | null
          target_audience?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_enhanced_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_enhanced_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_enhanced_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "course_languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_enhanced_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "course_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          message: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_tasks: {
        Row: {
          description: string | null
          id: string
          lesson_id: string | null
          task_type: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          lesson_id?: string | null
          task_type?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          lesson_id?: string | null
          task_type?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_tasks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_unlocks: {
        Row: {
          id: string
          lesson_id: string | null
          student_id: string | null
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          lesson_id?: string | null
          student_id?: string | null
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          lesson_id?: string | null
          student_id?: string | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_unlocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_unlocks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_workspace_map: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_workspace_map_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string | null
          id: string
          order_no: number | null
          quiz_answer: string | null
          quiz_json: Json | null
          quiz_options: Json | null
          quiz_question: string | null
          task_description: string | null
          theory_task: string | null
          title: string
          video_url: string | null
          workspace_task: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          order_no?: number | null
          quiz_answer?: string | null
          quiz_json?: Json | null
          quiz_options?: Json | null
          quiz_question?: string | null
          task_description?: string | null
          theory_task?: string | null
          title: string
          video_url?: string | null
          workspace_task?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          order_no?: number | null
          quiz_answer?: string | null
          quiz_json?: Json | null
          quiz_options?: Json | null
          quiz_question?: string | null
          task_description?: string | null
          theory_task?: string | null
          title?: string
          video_url?: string | null
          workspace_task?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          sender_id: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          sender_id: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          sender_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_session_reports: {
        Row: {
          created_at: string | null
          id: string
          key_topics_discussed: string[] | null
          next_steps: string | null
          overall_rating: number | null
          recommendations: string
          reviewer_id: string
          session_id: string
          student_progress_assessment: string
          submitted_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_topics_discussed?: string[] | null
          next_steps?: string | null
          overall_rating?: number | null
          recommendations: string
          reviewer_id: string
          session_id: string
          student_progress_assessment: string
          submitted_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_topics_discussed?: string[] | null
          next_steps?: string | null
          overall_rating?: number | null
          recommendations?: string
          reviewer_id?: string
          session_id?: string
          student_progress_assessment?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_session_reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_sessions: {
        Row: {
          chat_enabled: boolean | null
          chat_expires_at: string | null
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          reviewer_id: string
          scheduled_date: string
          scheduled_time: string
          session_completed_at: string | null
          session_summary: string | null
          status: string | null
          student_id: string
          student_notes: string | null
          timezone: string
          updated_at: string | null
        }
        Insert: {
          chat_enabled?: boolean | null
          chat_expires_at?: string | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          reviewer_id: string
          scheduled_date: string
          scheduled_time: string
          session_completed_at?: string | null
          session_summary?: string | null
          status?: string | null
          student_id: string
          student_notes?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Update: {
          chat_enabled?: boolean | null
          chat_expires_at?: string | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          reviewer_id?: string
          scheduled_date?: string
          scheduled_time?: string
          session_completed_at?: string | null
          session_summary?: string | null
          status?: string | null
          student_id?: string
          student_notes?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_course_id: string | null
          related_lesson_id: string | null
          student_id: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_course_id?: string | null
          related_lesson_id?: string | null
          student_id?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_course_id?: string | null
          related_lesson_id?: string | null
          student_id?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_course_id_fkey"
            columns: ["related_course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_lesson_id_fkey"
            columns: ["related_lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_option_index: number
          id: string
          lesson_id: string | null
          options: string[]
          question: string
        }
        Insert: {
          correct_option_index: number
          id?: string
          lesson_id?: string | null
          options: string[]
          question: string
        }
        Update: {
          correct_option_index?: number
          id?: string
          lesson_id?: string | null
          options?: string[]
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submissions: {
        Row: {
          answers: Json
          id: string
          lesson_id: string | null
          reviewed_at: string | null
          score: number | null
          status: string | null
          student_id: string | null
          submitted_at: string | null
        }
        Insert: {
          answers: Json
          id?: string
          lesson_id?: string | null
          reviewed_at?: string | null
          score?: number | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string | null
        }
        Update: {
          answers?: Json
          id?: string
          lesson_id?: string | null
          reviewed_at?: string | null
          score?: number | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      review_results: {
        Row: {
          feedback: string | null
          id: string
          lesson_id: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          score: number | null
          status: string | null
          student_id: string | null
          submission_id: string | null
          submission_type: string | null
        }
        Insert: {
          feedback?: string | null
          id?: string
          lesson_id?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          score?: number | null
          status?: string | null
          student_id?: string | null
          submission_id?: string | null
          submission_type?: string | null
        }
        Update: {
          feedback?: string | null
          id?: string
          lesson_id?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          score?: number | null
          status?: string | null
          student_id?: string | null
          submission_id?: string | null
          submission_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_results_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviews: {
        Row: {
          feedback: string | null
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          score: number | null
          submission_id: string | null
        }
        Insert: {
          feedback?: string | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          score?: number | null
          submission_id?: string | null
        }
        Update: {
          feedback?: string | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          score?: number | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      student_achievement_progress: {
        Row: {
          achievement_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          progress: number | null
          student_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          student_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievement_progress_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_achievement_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          progress: number | null
          student_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          student_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      student_analytics: {
        Row: {
          assignments_submitted: number | null
          created_at: string | null
          date: string
          id: string
          lessons_completed: number | null
          login_count: number | null
          quiz_attempts: number | null
          student_id: string
          time_spent_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          assignments_submitted?: number | null
          created_at?: string | null
          date?: string
          id?: string
          lessons_completed?: number | null
          login_count?: number | null
          quiz_attempts?: number | null
          student_id: string
          time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          assignments_submitted?: number | null
          created_at?: string | null
          date?: string
          id?: string
          lessons_completed?: number | null
          login_count?: number | null
          quiz_attempts?: number | null
          student_id?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_analytics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_assignment_submissions: {
        Row: {
          assignment_id: string
          content: string | null
          created_at: string | null
          feedback: string | null
          file_urls: string[] | null
          graded_at: string | null
          graded_by: string | null
          id: string
          score: number | null
          status: string | null
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          assignment_id: string
          content?: string | null
          created_at?: string | null
          feedback?: string | null
          file_urls?: string[] | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string | null
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string
          content?: string | null
          created_at?: string | null
          feedback?: string | null
          file_urls?: string[] | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string | null
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "course_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_certificates: {
        Row: {
          certificate_number: string
          certificate_url: string | null
          completion_date: string
          course_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          score: number
          student_id: string
          title: string
        }
        Insert: {
          certificate_number: string
          certificate_url?: string | null
          completion_date: string
          course_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          score: number
          student_id: string
          title: string
        }
        Update: {
          certificate_number?: string
          certificate_url?: string | null
          completion_date?: string
          course_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          score?: number
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_course_enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string | null
          id: string
          is_completed: boolean | null
          is_unlocked: boolean | null
          lesson_id: string | null
          started_at: string | null
          student_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          id?: string
          is_completed?: boolean | null
          is_unlocked?: boolean | null
          lesson_id?: string | null
          started_at?: string | null
          student_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          id?: string
          is_completed?: boolean | null
          is_unlocked?: boolean | null
          lesson_id?: string | null
          started_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completion_percentage: number | null
          course_id: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          is_unlocked: boolean | null
          lesson_id: string | null
          match_score: number | null
          quiz_score: number | null
          review_feedback: string | null
          reviewed_by: string | null
          student_skills: string[] | null
          task_submission: string | null
          user_id: string | null
        }
        Insert: {
          completion_percentage?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_unlocked?: boolean | null
          lesson_id?: string | null
          match_score?: number | null
          quiz_score?: number | null
          review_feedback?: string | null
          reviewed_by?: string | null
          student_skills?: string[] | null
          task_submission?: string | null
          user_id?: string | null
        }
        Update: {
          completion_percentage?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_unlocked?: boolean | null
          lesson_id?: string | null
          match_score?: number | null
          quiz_score?: number | null
          review_feedback?: string | null
          reviewed_by?: string | null
          student_skills?: string[] | null
          task_submission?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_settings: {
        Row: {
          autoplay_videos: boolean | null
          created_at: string | null
          dark_mode: boolean | null
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          push_notifications: boolean | null
          sound_effects: boolean | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          autoplay_videos?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          sound_effects?: boolean | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          autoplay_videos?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          sound_effects?: boolean | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          career_goal: string | null
          created_at: string | null
          education: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          career_goal?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          career_goal?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          content: string | null
          file_url: string | null
          id: string
          lesson_id: string | null
          student_id: string | null
          submitted_at: string | null
          task_id: string | null
        }
        Insert: {
          content?: string | null
          file_url?: string | null
          id?: string
          lesson_id?: string | null
          student_id?: string | null
          submitted_at?: string | null
          task_id?: string | null
        }
        Update: {
          content?: string | null
          file_url?: string | null
          id?: string
          lesson_id?: string | null
          student_id?: string | null
          submitted_at?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "lesson_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          student_id: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          student_id: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          student_id?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      theory_submissions: {
        Row: {
          content: string
          feedback: string | null
          id: string
          lesson_id: string | null
          reviewed_at: string | null
          status: string | null
          student_id: string | null
          submitted_at: string | null
        }
        Insert: {
          content: string
          feedback?: string | null
          id?: string
          lesson_id?: string | null
          reviewed_at?: string | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string | null
        }
        Update: {
          content?: string
          feedback?: string | null
          id?: string
          lesson_id?: string | null
          reviewed_at?: string | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theory_submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theory_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      close_expired_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_certificate_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      unlock_next_lesson: {
        Args: {
          p_student_id: string
          p_course_id: string
          p_completed_lesson_id: string
        }
        Returns: undefined
      }
      update_student_analytics: {
        Args: {
          p_student_id: string
          p_lessons_completed?: number
          p_time_spent_minutes?: number
          p_quiz_attempts?: number
          p_assignments_submitted?: number
          p_login_count?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
