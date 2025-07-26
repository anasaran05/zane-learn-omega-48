import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle, 
  Clipboard,
  ArrowRight,
  ArrowLeft,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LessonData {
  id: string;
  title: string;
  lesson_type: string;
  duration_minutes: number;
  video_url?: string;
  video_embed_type?: 'youtube' | 'vimeo' | 'direct';
  content_text?: string;
  order_no: number;
}

interface ModuleData {
  id: string;
  name: string;
  description: string;
  order_no: number;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  title: string;
  modules: ModuleData[];
}

interface LessonPlayerProps {
  course: CourseData;
  currentLessonId: string;
  onLessonComplete: (lessonId: string) => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
}

export function LessonPlayer({ 
  course, 
  currentLessonId, 
  onLessonComplete, 
  onNextLesson, 
  onPrevLesson 
}: LessonPlayerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [taskSubmission, setTaskSubmission] = useState('');
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Find current lesson and module
  const currentLesson = course.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === currentLessonId);
  
  const currentModule = course.modules
    .find(module => module.lessons.some(lesson => lesson.id === currentLessonId));

  // Find next and previous lessons
  const allLessons = course.modules.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  const hasNext = currentIndex < allLessons.length - 1;
  const hasPrev = currentIndex > 0;

  useEffect(() => {
    // Simulate progress tracking
    const timer = setInterval(() => {
      if (isPlaying && progress < 100) {
        setProgress(prev => Math.min(prev + 1, 100));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, progress]);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // Mark lesson as complete when quiz is submitted
    onLessonComplete(currentLessonId);
  };

  const handleTaskSubmit = () => {
    if (taskSubmission.trim()) {
      onLessonComplete(currentLessonId);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  };

  const getEmbedUrl = (url: string, type: string) => {
    switch (type) {
      case 'youtube': return getYouTubeEmbedUrl(url);
      case 'vimeo': return getVimeoEmbedUrl(url);
      default: return url;
    }
  };

  if (!currentLesson || !currentModule) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{currentModule.name}</span>
          <ArrowRight className="h-4 w-4" />
          <span>Lesson {currentLesson.order_no}</span>
        </div>
        <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline">{currentLesson.lesson_type}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{currentLesson.duration_minutes} minutes</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video/Content Player */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="p-0">
              {currentLesson.lesson_type === 'video' && currentLesson.video_url ? (
                <div className="aspect-video">
                  <iframe
                    src={getEmbedUrl(currentLesson.video_url, currentLesson.video_embed_type || 'youtube')}
                    className="w-full h-full rounded-t-lg"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Content will appear here</p>
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="mb-4" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {isPlaying ? 'Playing...' : 'Paused'}
                    </span>
                  </div>
                  {progress === 100 && (
                    <Button onClick={() => onLessonComplete(currentLessonId)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          {currentLesson.content_text && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {currentLesson.content_text}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Course Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <h4 className="font-medium text-sm">{module.name}</h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                          lesson.id === currentLessonId
                            ? 'bg-cherry-50 text-cherry-600 border border-cherry-200'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                          {lesson.order_no}
                        </div>
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {lesson.id === currentLessonId && (
                          <Play className="h-3 w-3 text-cherry-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiz Section */}
          {currentLesson.lesson_type === 'quiz' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Practice Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-3">
                    What are the primary site selection criteria for clinical trials?
                  </p>
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="investigator" id="investigator" />
                      <Label htmlFor="investigator">Investigator experience and patient population</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="office" id="office" />
                      <Label htmlFor="office">Office size</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="staff" id="staff" />
                      <Label htmlFor="staff">Number of staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equipment" id="equipment" />
                      <Label htmlFor="equipment">Equipment brand</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  onClick={handleQuizSubmit}
                  disabled={!selectedAnswer || quizSubmitted}
                  className="w-full"
                >
                  {quizSubmitted ? 'Submitted' : 'Submit Answer'}
                </Button>

                {quizSubmitted && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-700 text-sm">
                      Correct! Investigator experience and patient population are key criteria.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assignment Section */}
          {currentLesson.lesson_type === 'assignment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5" />
                  Submit Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="task-submission">Your Submission</Label>
                  <Textarea
                    id="task-submission"
                    value={taskSubmission}
                    onChange={(e) => setTaskSubmission(e.target.value)}
                    placeholder="Write your assignment response here..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload supporting documents or drag and drop files here
                  </p>
                </div>

                <Button 
                  onClick={handleTaskSubmit}
                  disabled={!taskSubmission.trim()}
                  className="w-full"
                >
                  Submit Assignment
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center pt-6 border-t"
      >
        <Button
          variant="outline"
          onClick={onPrevLesson}
          disabled={!hasPrev}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Lesson
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Lesson {currentIndex + 1} of {allLessons.length}
          </span>
        </div>

        <Button
          onClick={onNextLesson}
          disabled={!hasNext}
          className="flex items-center gap-2"
        >
          Next Lesson
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}