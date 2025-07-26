import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, BookOpen, Play, Video, FileText, HelpCircle, Clipboard, Users, Microscope, Wrench } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';

interface StructureStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
}

export function StructureStep({ formData, updateFormData }: StructureStepProps) {
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'video' | 'text' | 'quiz' | 'assignment' | 'live_session' | 'lab' | 'workshop'>('video');
  const [newLessonDuration, setNewLessonDuration] = useState<number>(30);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentLessonForVideo, setCurrentLessonForVideo] = useState<{moduleIndex: number, lessonIndex: number} | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoEmbedType, setVideoEmbedType] = useState<'youtube' | 'vimeo' | 'direct'>('youtube');

  const addModule = () => {
    if (newModuleName.trim()) {
      const newModule = {
        name: newModuleName.trim(),
        description: newModuleDescription.trim(),
        order_no: (formData.modules?.length || 0) + 1,
        lessons: []
      };
      
      updateFormData({ 
        modules: [...(formData.modules || []), newModule] 
      });
      
      setNewModuleName('');
      setNewModuleDescription('');
    }
  };

  const removeModule = (index: number) => {
    const modules = formData.modules?.filter((_, i) => i !== index) || [];
    // Reorder remaining modules
    const reorderedModules = modules.map((module, i) => ({
      ...module,
      order_no: i + 1
    }));
    updateFormData({ modules: reorderedModules });
  };

  const addLesson = () => {
    if (newLessonTitle.trim() && selectedModuleIndex !== null) {
      const modules = [...(formData.modules || [])];
      const selectedModule = modules[selectedModuleIndex];
      
      const newLesson = {
        title: newLessonTitle.trim(),
        lesson_type: newLessonType,
        duration_minutes: newLessonDuration,
        order_no: (selectedModule.lessons?.length || 0) + 1,
        content_url: '',
        content_text: '',
        video_url: '',
        video_embed_type: 'youtube' as const
      };

      selectedModule.lessons = [...(selectedModule.lessons || []), newLesson];
      updateFormData({ modules });
      
      setNewLessonTitle('');
      setNewLessonDuration(30);
    }
  };

  const handleVideoSave = () => {
    if (currentLessonForVideo && videoUrl.trim()) {
      const modules = [...(formData.modules || [])];
      const lesson = modules[currentLessonForVideo.moduleIndex].lessons![currentLessonForVideo.lessonIndex];
      
      lesson.video_url = videoUrl.trim();
      lesson.video_embed_type = videoEmbedType;
      lesson.content_url = videoUrl.trim(); // Also set content_url for compatibility
      
      updateFormData({ modules });
      setVideoDialogOpen(false);
      setVideoUrl('');
      setCurrentLessonForVideo(null);
    }
  };

  const openVideoDialog = (moduleIndex: number, lessonIndex: number) => {
    const lesson = formData.modules?.[moduleIndex]?.lessons?.[lessonIndex];
    if (lesson) {
      setCurrentLessonForVideo({ moduleIndex, lessonIndex });
      setVideoUrl(lesson.video_url || '');
      setVideoEmbedType(lesson.video_embed_type || 'youtube');
      setVideoDialogOpen(true);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <Clipboard className="h-4 w-4" />;
      case 'live_session': return <Users className="h-4 w-4" />;
      case 'lab': return <Microscope className="h-4 w-4" />;
      case 'workshop': return <Wrench className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const modules = [...(formData.modules || [])];
    modules[moduleIndex].lessons = modules[moduleIndex].lessons?.filter((_, i) => i !== lessonIndex) || [];
    // Reorder remaining lessons
    modules[moduleIndex].lessons = modules[moduleIndex].lessons.map((lesson, i) => ({
      ...lesson,
      order_no: i + 1
    }));
    updateFormData({ modules });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Course Structure</h3>
        <p className="text-muted-foreground mb-6">
          Organize your course into modules and lessons. Each module represents a major topic or section of your course.
        </p>
      </div>

      {/* Add New Module */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Module
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="module-name">Module Name *</Label>
            <Input
              id="module-name"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              placeholder="Enter module name"
            />
          </div>
          <div>
            <Label htmlFor="module-description">Module Description</Label>
            <Textarea
              id="module-description"
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
              placeholder="Brief description of this module"
              className="min-h-[80px]"
            />
          </div>
          <Button onClick={addModule} disabled={!newModuleName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </CardContent>
      </Card>

      {/* Existing Modules */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Course Modules ({formData.modules?.length || 0})</h4>
        
        {formData.modules?.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No modules added yet</p>
            <p className="text-sm text-muted-foreground">Create your first module to get started</p>
          </Card>
        ) : (
          formData.modules?.map((module, moduleIndex) => (
            <Card key={moduleIndex}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Module {module.order_no}: {module.name}
                    </CardTitle>
                    {module.description && (
                      <p className="text-muted-foreground mt-1">{module.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {module.lessons?.length || 0} lessons
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Lesson to this Module */}
                <div className="border rounded p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Add Lesson</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`lesson-title-${moduleIndex}`}>Lesson Title</Label>
                      <Input
                        id={`lesson-title-${moduleIndex}`}
                        value={selectedModuleIndex === moduleIndex ? newLessonTitle : ''}
                        onChange={(e) => {
                          setSelectedModuleIndex(moduleIndex);
                          setNewLessonTitle(e.target.value);
                        }}
                        placeholder="Enter lesson title"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`lesson-type-${moduleIndex}`}>Type</Label>
                      <Select 
                        value={selectedModuleIndex === moduleIndex ? newLessonType : 'video'}
                        onValueChange={(value) => {
                          setSelectedModuleIndex(moduleIndex);
                          setNewLessonType(value as any);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="live_session">Live Session</SelectItem>
                          <SelectItem value="lab">Lab</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`lesson-duration-${moduleIndex}`}>Duration (min)</Label>
                        <Input
                          id={`lesson-duration-${moduleIndex}`}
                          type="number"
                          value={selectedModuleIndex === moduleIndex ? newLessonDuration : 30}
                          onChange={(e) => {
                            setSelectedModuleIndex(moduleIndex);
                            setNewLessonDuration(parseInt(e.target.value) || 30);
                          }}
                          min="1"
                        />
                      </div>
                      <Button
                        onClick={addLesson}
                        disabled={!newLessonTitle.trim() || selectedModuleIndex !== moduleIndex}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-2">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center justify-between p-3 bg-background border rounded group">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-6 h-6 bg-cherry-500 rounded text-white text-xs flex items-center justify-center">
                          {lesson.order_no}
                        </div>
                        {getLessonIcon(lesson.lesson_type)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {lesson.lesson_type} • {lesson.duration_minutes || 0} minutes
                            {lesson.video_url && <span className="ml-1 text-green-500">• Video added</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.lesson_type === 'video' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openVideoDialog(moduleIndex, lessonIndex)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Video className="h-3 w-3 mr-1" />
                            {lesson.video_url ? 'Edit Video' : 'Add Video'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!module.lessons || module.lessons.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No lessons added to this module yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Video Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-embed-type">Video Source</Label>
              <Select value={videoEmbedType} onValueChange={(value: any) => setVideoEmbedType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="direct">Direct Video URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={
                  videoEmbedType === 'youtube' 
                    ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
                    : videoEmbedType === 'vimeo'
                    ? 'https://vimeo.com/123456789'
                    : 'https://example.com/video.mp4'
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {videoEmbedType === 'youtube' && 'Paste the full YouTube URL'}
                {videoEmbedType === 'vimeo' && 'Paste the full Vimeo URL'}
                {videoEmbedType === 'direct' && 'Paste a direct link to the video file (.mp4, .webm, etc.)'}
              </p>
            </div>

            {videoUrl && (
              <div className="border rounded p-3 bg-muted/20">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Video will appear here</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleVideoSave} disabled={!videoUrl.trim()}>
                Save Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
