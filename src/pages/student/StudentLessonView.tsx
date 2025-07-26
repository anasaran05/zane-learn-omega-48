import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/student/LessonPlayer';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual API calls
const mockCourseData = {
  id: "course-1",
  title: "Clinical Research Training",
  modules: [
    {
      id: "module-1",
      name: "Clinical Trial Setup and Feasibility",
      description: "Master clinical trial setup, site feasibility, and trial management",
      order_no: 1,
      lessons: [
        {
          id: "lesson-1",
          title: "Clinical Trial Setup and Feasibility",
          lesson_type: "video",
          duration_minutes: 15,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_embed_type: "youtube" as const,
          content_text: "Essential criteria for selecting optimal sites for clinical trial execution.",
          order_no: 1
        },
        {
          id: "lesson-2", 
          title: "Site Setup",
          lesson_type: "video",
          duration_minutes: 12,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_embed_type: "youtube" as const,
          order_no: 2
        },
        {
          id: "lesson-3",
          title: "What is Site Feasibility?",
          lesson_type: "video", 
          duration_minutes: 8,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_embed_type: "youtube" as const,
          order_no: 3
        },
        {
          id: "lesson-4",
          title: "Feasibility Assessment – Key Considerations",
          lesson_type: "video",
          duration_minutes: 10,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
          video_embed_type: "youtube" as const,
          order_no: 4
        },
        {
          id: "lesson-5",
          title: "Site Selection Criteria",
          lesson_type: "quiz",
          duration_minutes: 5,
          order_no: 5
        }
      ]
    }
  ]
};

export default function StudentLessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLessonId, setCurrentLessonId] = useState(lessonId || 'lesson-1');

  const handleLessonComplete = (completedLessonId: string) => {
    toast({
      title: "Lesson completed!",
      description: "Great job! Your progress has been saved.",
    });
    // Here you would typically update the database
  };

  const handleNextLesson = () => {
    const allLessons = mockCourseData.modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setCurrentLessonId(nextLesson.id);
      navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  const handlePrevLesson = () => {
    const allLessons = mockCourseData.modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      setCurrentLessonId(prevLesson.id);
      navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student/courses')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold">{mockCourseData.title}</h1>
                <p className="text-sm text-muted-foreground">Master clinical trial setup, site feasibility, and trial management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">XP Earned: 0</div>
                <div className="text-xs text-muted-foreground">0/4 Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LessonPlayer
            course={mockCourseData}
            currentLessonId={currentLessonId}
            onLessonComplete={handleLessonComplete}
            onNextLesson={handleNextLesson}
            onPrevLesson={handlePrevLesson}
          />
        </motion.div>
      </div>
    </div>
  );
}