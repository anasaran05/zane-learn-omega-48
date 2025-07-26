
import { CourseFormData } from '@/hooks/useCourseCreation';

export interface ValidationErrors {
  [key: string]: string;
}

export function useStepValidation() {
  const validateStep = (stepIndex: number, formData: CourseFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    switch (stepIndex) {
      case 0: // Basic Info
        if (!formData.title?.trim()) {
          errors.title = 'Course title is required';
        }
        if (!formData.category_id) {
          errors.category_id = 'Category is required';
        }
        if (!formData.level_id) {
          errors.level_id = 'Level is required';
        }
        if (formData.duration_value && formData.duration_value < 0) {
          errors.duration_value = 'Duration must be positive';
        }
        break;

      case 1: // Outcomes & Audience
        if (!formData.learning_objectives || formData.learning_objectives.length === 0) {
          errors.learning_objectives = 'At least one learning objective is required';
        }
        if (!formData.target_audience || formData.target_audience.length === 0) {
          errors.target_audience = 'Target audience is required';
        }
        break;

      case 2: // Structure
        if (!formData.modules || formData.modules.length === 0) {
          errors.modules = 'At least one module is required';
        } else {
          // Validate each module
          formData.modules.forEach((module, index) => {
            if (!module.name?.trim()) {
              errors[`module_${index}_name`] = `Module ${index + 1} name is required`;
            }
            if (module.lessons && module.lessons.length === 0) {
              errors[`module_${index}_lessons`] = `Module ${index + 1} must have at least one lesson`;
            }
          });
        }
        break;

      // Steps 3-6 are optional, no validation needed
      default:
        break;
    }

    return errors;
  };

  const isStepValid = (stepIndex: number, formData: CourseFormData): boolean => {
    const errors = validateStep(stepIndex, formData);
    return Object.keys(errors).length === 0;
  };

  return {
    validateStep,
    isStepValid
  };
}
