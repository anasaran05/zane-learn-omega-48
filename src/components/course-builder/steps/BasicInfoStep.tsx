
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CourseFormData, useCourseLookupData } from '@/hooks/useCourseCreation';
import { AlertCircle, Upload, Image, X } from 'lucide-react';

interface BasicInfoStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
  errors?: Record<string, string>;
}

export function BasicInfoStep({ formData, updateFormData, errors = {} }: BasicInfoStepProps) {
  const { data: lookupData, isLoading } = useCourseLookupData();
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(formData.image_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof CourseFormData, value: any) => {
    updateFormData({ [field]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert('Image size must be less than 3MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);
        handleFieldChange('image_url', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    handleFieldChange('image_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const selectedCategory = lookupData?.categories?.find(c => c.id === formData.category_id);
    setShowOtherCategory(selectedCategory?.name === 'Other');
  }, [formData.category_id, lookupData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading course options...</div>
      </div>
    );
  }

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <div className="flex items-center gap-1 text-destructive text-sm mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Basic Course Information</h3>
        <p className="text-muted-foreground mb-6">
          Let's start with the essential details about your course.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="title" className={errors.title ? 'text-destructive' : ''}>
            Course Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Enter course title"
            className={`mt-1 ${errors.title ? 'border-destructive' : ''}`}
          />
          <ErrorMessage field="title" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="subtitle">Subtitle/Tagline</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
            placeholder="Enter course subtitle"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category" className={errors.category_id ? 'text-destructive' : ''}>
            Category *
          </Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => handleFieldChange('category_id', value)}
          >
            <SelectTrigger className={`mt-1 ${errors.category_id ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {lookupData?.categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage field="category_id" />
        </div>

        {showOtherCategory && (
          <div>
            <Label htmlFor="custom-category">Custom Category</Label>
            <Input
              id="custom-category"
              placeholder="Enter custom category"
              className="mt-1"
            />
          </div>
        )}

        <div>
          <Label htmlFor="level" className={errors.level_id ? 'text-destructive' : ''}>
            Level *
          </Label>
          <Select
            value={formData.level_id}
            onValueChange={(value) => handleFieldChange('level_id', value)}
          >
            <SelectTrigger className={`mt-1 ${errors.level_id ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {lookupData?.levels?.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage field="level_id" />
        </div>

        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            value={formData.language_id}
            onValueChange={(value) => handleFieldChange('language_id', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {lookupData?.languages?.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="duration-value">Duration</Label>
            <Input
              id="duration-value"
              type="number"
              value={formData.duration_value || ''}
              onChange={(e) => handleFieldChange('duration_value', parseInt(e.target.value) || 0)}
              placeholder="Enter duration"
              className="mt-1"
              min="0"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="duration-unit">Unit</Label>
            <Select
              value={formData.duration_unit}
              onValueChange={(value) => handleFieldChange('duration_unit', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="course-image">Course Image</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 mt-1">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Course preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Course Image
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 3MB. Supported formats: JPG, PNG, WEBP
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Describe your course in detail..."
            className="mt-1 min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
}
