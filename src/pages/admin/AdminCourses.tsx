
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Users, Clock, Edit, Trash2, RotateCcw, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTrashedCourses } from "@/hooks/useTrashedCourses";

export default function AdminCourses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("published");
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const { trashedCourses, deleteCourse, restoreCourse, permanentlyDeleteCourse } = useTrashedCourses();

  const { data: allCourses = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      console.log('Fetching admin courses');
      
      // First, get the basic course data with related tables that have proper relationships
      const { data: coursesData, error } = await supabase
        .from('courses_enhanced')
        .select(`
          *,
          course_categories (name),
          course_levels (name),
          course_modules (
            id,
            course_lessons (id)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      // Get enrollment counts separately for each course
      if (coursesData && coursesData.length > 0) {
        const coursesWithEnrollments = await Promise.all(
          coursesData.map(async (course) => {
            const { count: enrollmentCount } = await supabase
              .from('course_enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id);

            return {
              ...course,
              enrollmentCount: enrollmentCount || 0
            };
          })
        );
        
        console.log('Courses fetched:', coursesWithEnrollments);
        return coursesWithEnrollments;
      }
      
      console.log('Courses fetched:', coursesData || []);
      return coursesData || [];
    },
  });

  // Fetch trashed courses separately
  const { data: trashedCoursesData = [], refetch: refetchTrashed } = useQuery({
    queryKey: ['trashed-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trashed_courses')
        .select('*')
        .order('trashed_at', { ascending: false });

      if (error) {
        console.error('Error fetching trashed courses:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Set up real-time subscriptions
  useEffect(() => {
    const enrollmentChannel = supabase
      .channel('course-enrollments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_enrollments'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    const trashedChannel = supabase
      .channel('trashed-courses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trashed_courses'
        },
        () => {
          refetchTrashed();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(enrollmentChannel);
      supabase.removeChannel(trashedChannel);
    };
  }, [refetch, refetchTrashed]);

  // Filter courses based on status
  const publishedCourses = allCourses.filter((course: any) => course.status === 'published');
  const draftCourses = allCourses.filter((course: any) => course.status === 'draft');

  const handleCreateCourse = () => {
    navigate('/admin/courses/create');
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    setDeletingCourseId(courseId);
    setTimeout(() => {
      deleteCourse.mutate(courseId);
      setDeletingCourseId(null);
    }, 300);
  };

  const handleRestoreCourse = (trashedCourseId: string) => {
    restoreCourse.mutate(trashedCourseId);
  };

  const handlePermanentlyDeleteCourse = (trashedCourseId: string) => {
    permanentlyDeleteCourse.mutate(trashedCourseId);
  };

  const CourseGrid = ({ courses, isTrash = false }: { courses: any[]; isTrash?: boolean }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'published' && "No published courses yet."}
              {activeTab === 'drafts' && "No draft courses yet."}
              {activeTab === 'trashed' && "No trashed courses yet."}
            </p>
            {activeTab === 'drafts' && (
              <Button onClick={handleCreateCourse} className="bg-gradient-cherry hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            )}
          </div>
        ) : (
          courses.map((course: any, index: number) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: deletingCourseId === course.id ? 0 : 1,
                y: deletingCourseId === course.id ? -20 : 0,
                scale: deletingCourseId === course.id ? 0.8 : 1
              }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-cherry-500/20 to-maroon-500/20 relative overflow-hidden">
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-cherry-400" />
                    </div>
                  )}
                  <Badge 
                    variant={isTrash ? "destructive" : course.status === "published" ? "default" : "secondary"}
                    className="absolute top-2 right-2"
                  >
                    {isTrash ? "trashed" : course.status}
                  </Badge>
                  {isTrash && course.expires_at && (
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                      Expires: {new Date(course.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  {course.subtitle && (
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  {!isTrash ? (
                    <>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrollmentCount || 0} students
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.course_modules?.reduce((total: number, module: any) => 
                            total + (module.course_lessons?.length || 0), 0) || 0} lessons
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.course_categories && (
                          <Badge variant="outline" className="text-xs">
                            {course.course_categories.name}
                          </Badge>
                        )}
                        {course.course_levels && (
                          <Badge variant="outline" className="text-xs">
                            {course.course_levels.name}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditCourse(course.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={deletingCourseId === course.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>Trashed on: {new Date(course.trashed_at).toLocaleDateString()}</p>
                        {course.expires_at && (
                          <p>Auto-delete on: {new Date(course.expires_at).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-green-600 hover:text-green-700"
                          onClick={() => handleRestoreCourse(course.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handlePermanentlyDeleteCourse(course.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Course Management</h1>
          <p className="text-muted-foreground">Create and manage your training courses</p>
        </div>
        <Button onClick={handleCreateCourse} className="bg-gradient-cherry hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-3 mb-6">
            <TabsTrigger value="published" className="flex items-center gap-2">
              Published
              <Badge variant="secondary" className="ml-1 text-xs">
                {publishedCourses.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              Drafts
              <Badge variant="secondary" className="ml-1 text-xs">
                {draftCourses.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trashed" className="flex items-center gap-2">
              Trashed
              <Badge variant="secondary" className="ml-1 text-xs">
                {trashedCourses.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published">
            <CourseGrid courses={publishedCourses} />
          </TabsContent>

          <TabsContent value="drafts">
            <CourseGrid courses={draftCourses} />
          </TabsContent>

          <TabsContent value="trashed">
            <CourseGrid courses={trashedCourses} isTrash={true} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
