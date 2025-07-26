
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';
import { useToast } from '@/hooks/use-toast';

interface CourseWizardStepsProps {
  onComplete: (data: CourseFormData) => void;
  onCancel: () => void;
  stepComponents: Array<React.ComponentType<{
    formData: CourseFormData;
    updateFormData: (data: Partial<CourseFormData>) => void;
    errors?: Record<string, string>;
  }> | (() => React.ReactElement)>;
}

export function CourseWizardSteps({ onComplete, onCancel, stepComponents }: CourseWizardStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    modules: [],
    learning_objectives: [],
    target_audience: [],
    skills_taught: [],
  });
  const { toast } = useToast();

  const totalSteps = stepComponents.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const stepTitles = [
    'Basic Course Info',
    'Outcomes & Audience',
    'Course Structure',
    'Domain Features',
    'Engagement Settings',
    'Assessments & Certification',
    'Meta & Publish'
  ];

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate based on current step
    switch (currentStep) {
      case 0: // Basic Info
        if (!formData.title?.trim()) {
          newErrors.title = 'Course title is required';
        }
        if (!formData.category_id) {
          newErrors.category_id = 'Category is required';
        }
        if (!formData.level_id) {
          newErrors.level_id = 'Level is required';
        }
        if (!formData.language_id) {
          newErrors.language_id = 'Language is required';
        }
        if (!formData.duration_value || formData.duration_value <= 0) {
          newErrors.duration_value = 'Duration is required';
        }
        break;
      case 1: // Outcomes & Audience
        if (!formData.learning_objectives || formData.learning_objectives.length === 0) {
          newErrors.learning_objectives = 'At least one learning objective is required';
        }
        if (!formData.target_audience || formData.target_audience.length === 0) {
          newErrors.target_audience = 'Target audience is required';
        }
        break;
      case 2: // Structure
        if (!formData.modules || formData.modules.length === 0) {
          newErrors.modules = 'At least one module is required';
        }
        break;
      // Steps 3, 4, 5, 6 are optional, no validation needed
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    console.log('Current form data:', formData);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log('Next button clicked, current step:', currentStep);
    console.log('Current form data:', formData);
    
    if (validateCurrentStep()) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setErrors({}); // Clear errors when moving to next step
        console.log('Moving to next step:', currentStep + 1);
      }
    } else {
      console.log('Validation failed, showing toast');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any previous step or the current step
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
      setErrors({});
    }
  };

  const handleFinish = async () => {
    console.log('Create Course button clicked');
    console.log('Final form data:', formData);
    
    try {
      // Mark the final step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      await onComplete(formData);
      toast({
        title: "Course Created Successfully",
        description: "Your course has been created and saved.",
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (stepData: Partial<CourseFormData>) => {
    console.log('Updating form data with:', stepData);
    setFormData(prev => {
      const updated = { ...prev, ...stepData };
      console.log('Updated form data:', updated);
      return updated;
    });
    
    // Clear any errors for the updated fields
    const updatedFields = Object.keys(stepData);
    const newErrors = { ...errors };
    updatedFields.forEach(field => {
      delete newErrors[field];
    });
    setErrors(newErrors);
  };

  const isStepAccessible = (stepIndex: number) => {
    return stepIndex <= currentStep || completedSteps.has(stepIndex);
  };

  // Render the current step component
  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gradient">Create New Course</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{stepTitles[currentStep]}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {stepTitles.map((title, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep;
            const isAccessible = isStepAccessible(index);
            
            return (
              <div
                key={index}
                className={`flex-1 text-center py-2 text-xs ${
                  isCurrent
                    ? 'text-cherry-500 font-medium'
                    : isCompleted
                    ? 'text-green-500'
                    : isAccessible
                    ? 'text-muted-foreground cursor-pointer hover:text-foreground'
                    : 'text-muted-foreground/50'
                }`}
                onClick={() => isAccessible ? handleStepClick(index) : undefined}
              >
                <div
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs mb-1 ${
                    isCurrent
                      ? 'bg-cherry-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : isAccessible
                      ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                      : 'bg-muted/50 text-muted-foreground/50'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-3 w-3" /> : index + 1}
                </div>
                <div className="hidden sm:block">{title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border rounded-lg p-6"
          >
            <CurrentStepComponent 
              formData={formData} 
              updateFormData={updateFormData} 
              errors={errors}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < totalSteps - 1 ? (
            <Button onClick={handleNext} className="bg-gradient-cherry hover:opacity-90">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-gradient-cherry hover:opacity-90">
              Create Course
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
