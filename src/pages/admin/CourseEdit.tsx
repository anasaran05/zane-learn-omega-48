import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Eye, Globe, Settings, BookOpen, Users, Tag, DollarSign, Plus, X, ChevronUp, ChevronDown, MoreHorizontal, Edit3 } from "lucide-react";
import { useCourseBuilderData, useCourseLookupData } from "@/hooks/useCourseCreation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export default function CourseEdit() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: course,
    isLoading: courseLoading
  } = useCourseBuilderData(id!);
  const {
    data: lookupData,
    isLoading: lookupLoading
  } = useCourseLookupData();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category_id: '',
    level_id: '',
    language_id: '',
    duration_value: 0,
    duration_unit: 'weeks',
    learning_objectives: [] as string[],
    skills_taught: [] as string[],
    prerequisites: '',
    target_audience: [] as string[]
  });
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        subtitle: course.subtitle || '',
        description: course.description || '',
        category_id: course.category_id || '',
        level_id: course.level_id || '',
        language_id: course.language_id || '',
        duration_value: course.duration_value || 0,
        duration_unit: course.duration_unit || 'weeks',
        learning_objectives: course.learning_objectives || [],
        skills_taught: course.skills_taught || [],
        prerequisites: course.prerequisites || '',
        target_audience: course.target_audience || []
      });
    }
  }, [course]);
  const updateCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const {
        error
      } = await supabase.from('courses_enhanced').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course-builder', id]
      });
      toast.success('Course updated successfully!');
    },
    onError: error => {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  });
  const handleSave = () => {
    updateCourseMutation.mutate(formData);
  };
  const handlePublish = () => {
    updateCourseMutation.mutate({
      ...formData,
      status: 'published'
    });
  };
  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]);
  };
  if (courseLoading || lookupLoading) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading course...</div>
      </div>;
  }
  if (!course) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Course not found</div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/admin/courses/${id}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {course.title}
              </Button>
              <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                {course.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {course.status === 'published' ? <Button onClick={handleSave} disabled={updateCourseMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateCourseMutation.isPending ? 'Saving...' : 'Save'}
                </Button> : <Button onClick={handlePublish} disabled={updateCourseMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                  <Globe className="h-4 w-4 mr-2" />
                  {updateCourseMutation.isPending ? 'Publishing...' : 'Publish'}
                </Button>}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="settings" className="space-y-6 bg-slate-900">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Program Settings
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="instructors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Instructors
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white">
              <CardHeader className="bg-slate-900">
                <CardTitle>Program Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 bg-gray-900">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Course Title *</Label>
                    <Input id="title" value={formData.title} onChange={e => setFormData({
                    ...formData,
                    title: e.target.value
                  })} placeholder="Enter course title" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input id="subtitle" value={formData.subtitle} onChange={e => setFormData({
                    ...formData,
                    subtitle: e.target.value
                  })} placeholder="Self-Paced | No Time Limit" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={e => setFormData({
                    ...formData,
                    description: e.target.value
                  })} placeholder="Ready to achieve your business goals? A business plan is your secret weapon to get everyone excited about what's next." className="mt-1 min-h-[100px]" />
                  </div>
                </div>

                <Separator />

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">Visibility</span>
                    </div>
                    <div className="text-sm text-blue-600">Public</div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">Price</span>
                    </div>
                    <div className="text-sm text-blue-600">Free</div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">Rewards</span>
                    </div>
                    <div className="text-sm text-blue-600">Add Rewards</div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Group</span>
                    </div>
                    <div className="text-sm text-blue-600">Connect a Group</div>
                  </Card>
                </div>

                <Separator />

                {/* Advanced Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category_id} onValueChange={value => setFormData({
                    ...formData,
                    category_id: value
                  })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupData?.categories?.map(category => <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level_id} onValueChange={value => setFormData({
                    ...formData,
                    level_id: value
                  })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupData?.levels?.map(level => <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between bg-slate-900">
                <CardTitle>Content</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create with AI
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 bg-slate-900">
                {course.course_modules?.map((module: any) => <div key={module.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30" onClick={() => toggleModuleExpansion(module.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-xs">
                          ≡
                        </div>
                        <div>
                          <div className="font-medium">{module.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Available once the participant starts the program.
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {expandedModules.includes(module.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {expandedModules.includes(module.id) && <div className="px-4 pb-4 space-y-2">
                        {module.course_lessons?.map((lesson: any) => <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/20 rounded ml-8">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-xs">
                                ≡
                              </div>
                              <div>
                                <div className="font-medium text-sm">{lesson.title}</div>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.lesson_type}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>)}
                        
                        <div className="flex gap-2 ml-8 mt-3">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Step
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Import Step
                          </Button>
                        </div>
                      </div>}
                  </div>)}
                
                {course.course_modules?.length === 0 && <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content sections yet</p>
                    <p className="text-sm">Add your first section to get started</p>
                  </div>}

                <Button variant="ghost" className="w-full text-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructors" className="space-y-6">
            <Card className="bg-white">
              <CardHeader className="bg-slate-900">
                <CardTitle>Instructors</CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-900">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No instructors assigned</p>
                  <p className="text-sm">Add instructors to help manage this course</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="bg-slate-900">
              <CardHeader className="bg-slate-900">
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-slate-900">
                <div>
                  <Label htmlFor="seo-url">URL Slug</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                      https://...../
                    </span>
                    <Input id="seo-url" placeholder="17ff5934-dde0-4d64-b524-e1df7a01ac1c" className="rounded-l-none" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}