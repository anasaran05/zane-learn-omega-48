
import { useNavigate } from 'react-router-dom';
import { CourseWizardSteps } from '@/components/course-builder/CourseWizardSteps';
import { BasicInfoStep } from '@/components/course-builder/steps/BasicInfoStep';
import { OutcomesAudienceStep } from '@/components/course-builder/steps/OutcomesAudienceStep';
import { StructureStep } from '@/components/course-builder/steps/StructureStep';
import { DomainFeaturesStep } from '@/components/course-builder/steps/DomainFeaturesStep';
import { EngagementStep } from '@/components/course-builder/steps/EngagementStep';
import { AssessmentsStep } from '@/components/course-builder/steps/AssessmentsStep';
import { MetaPublishStep } from '@/components/course-builder/steps/MetaPublishStep';
import { useCreateCourseFull, CourseFormData } from '@/hooks/useCourseCreation';

export default function CourseCreate() {
  const navigate = useNavigate();
  const createCourseMutation = useCreateCourseFull();

  const handleComplete = async (courseData: CourseFormData) => {
    try {
      const course = await createCourseMutation.mutateAsync(courseData);
      navigate(`/admin/courses/${course.id}`);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  // Create step components as functions that return JSX elements
  const stepComponents = [
    BasicInfoStep,
    OutcomesAudienceStep,
    StructureStep,
    DomainFeaturesStep,
    EngagementStep,
    AssessmentsStep,
    MetaPublishStep,
  ];

  return (
    <div className="container mx-auto py-8">
      <CourseWizardSteps 
        onComplete={handleComplete} 
        onCancel={handleCancel}
        stepComponents={stepComponents}
      />
    </div>
  );
}
