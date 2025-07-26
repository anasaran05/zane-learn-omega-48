import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Play, CheckCircle, Users } from "lucide-react";
import { useStudentEnrollments, useEnrollInCourse } from "@/hooks/useStudentData";
import { usePublishedCourses } from "@/hooks/usePublishedCourses";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: enrollments, isLoading: enrollmentsLoading } = useStudentEnrollments();
  const { data: allCourses, isLoading: coursesLoading } = usePublishedCourses();
  const enrollInCourseMutation = useEnrollInCourse();

  const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];
  const availableCourses = allCourses?.filter(course => 
    !enrolledCourseIds.includes(course.id)
  ) || [];

  const handleEnrollInCourse = (courseId: string) => {
    enrollInCourseMutation.mutate(courseId);
  };

  const handleContinueLearning = (courseId: string) => {
    // Navigate to first lesson - in real implementation, you'd get the last accessed lesson
    navigate(`/student/courses/${courseId}/lessons/lesson-1`);
  };

  if (enrollmentsLoading || coursesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </motion.div>

      {/* Enrolled Courses */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        {enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {enrollment.courses_enhanced?.title || 'Course Title'}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                        {enrollment.status === 'in_progress' ? 'In Progress' : 
                         enrollment.status === 'completed' ? 'Completed' : enrollment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {enrollment.courses_enhanced?.description || 'Course description'}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress_percentage || 0)}%</span>
                      </div>
                      <Progress value={enrollment.progress_percentage || 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>2 hours</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>124 students</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => handleContinueLearning(enrollment.course_id)}
                    >
                      {enrollment.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review Course
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Enrolled Courses Yet</h3>
              <p className="text-muted-foreground mb-4">
                Browse our available courses below to start your learning journey.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.section>

      {/* Available Courses */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
        {availableCourses && availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover h-full">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {course.title || 'Course Title'}
                    </CardTitle>
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description || 'Course description'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration_value} {course.duration_unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>New</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => handleEnrollInCourse(course.id)}
                      disabled={enrollInCourseMutation.isPending}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {enrollInCourseMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Available Courses</h3>
              <p className="text-muted-foreground">
                Check back later for new courses.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.section>
    </div>
  );
}