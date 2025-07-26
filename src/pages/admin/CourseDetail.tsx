import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  PlayCircle,
  Users,
  Clock,
  ArrowLeft,
  TrendingUp,
  Target,
  Globe
} from "lucide-react";
import { useCourseBuilderData, useCourseAnalytics } from "@/hooks/useCourseCreation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useCourseBuilderData(id!);
  const { data: analytics } = useCourseAnalytics(id!);

  const publishCourseMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('courses_enhanced')
        .update({ status: 'published' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-builder', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course published successfully!');
    },
    onError: (error) => {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course');
    },
  });

  const handlePublishCourse = () => {
    publishCourseMutation.mutate();
  };

  const handleEditCourse = () => {
    navigate(`/admin/courses/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Course not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  {course.subtitle && (
                    <p className="text-lg text-muted-foreground mb-2">{course.subtitle}</p>
                  )}
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
                <Badge variant={course.status === "published" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">{analytics.totalEnrolled}</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">{analytics.lessonsCount}</div>
                    <div className="text-sm text-muted-foreground">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">{analytics.avgCompletionRate}%</div>
                    <div className="text-sm text-muted-foreground">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">{analytics.avgQuizScore}/100</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleEditCourse} variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </Button>
                {course.status === 'draft' && (
                  <Button 
                    onClick={handlePublishCourse}
                    disabled={publishCourseMutation.isPending}
                    className="bg-gradient-cherry hover:opacity-90"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {publishCourseMutation.isPending ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
                <Button variant="outline" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Course Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Enrollments
                    </span>
                    <span className="font-medium">{analytics.totalEnrolled}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Modules/Lessons
                    </span>
                    <span className="font-medium">{analytics.modulesCount}/{analytics.lessonsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Avg Completion
                    </span>
                    <span className="font-medium">{analytics.avgCompletionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Avg Quiz Score
                    </span>
                    <span className="font-medium">{analytics.avgQuizScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Avg Review Time
                    </span>
                    <span className="font-medium">{analytics.avgReviewTurnaround}h</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Loading analytics...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(course.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{course.course_categories?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span>{course.course_levels?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{course.duration_value} {course.duration_unit}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Modules ({course.course_modules?.length || 0})
              </CardTitle>
              <Button className="bg-gradient-cherry hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.course_modules?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No modules created yet</p>
                  <p className="text-sm">Add your first module to get started</p>
                </div>
              ) : (
                course.course_modules?.map((module: any, index: number) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Module {module.order_no}: {module.name}</h4>
                      <Badge variant="outline">
                        {module.course_lessons?.length || 0} lessons
                      </Badge>
                    </div>
                    {module.description && (
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    )}
                    
                    <div className="space-y-2 ml-4">
                      {module.course_lessons?.map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-cherry-500 rounded text-white text-xs flex items-center justify-center">
                              {lesson.order_no}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{lesson.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {lesson.lesson_type} • {lesson.duration_minutes || 0} min
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Lesson
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
