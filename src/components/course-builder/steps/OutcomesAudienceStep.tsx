
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';

interface OutcomesAudienceStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
}

export function OutcomesAudienceStep({ formData, updateFormData }: OutcomesAudienceStepProps) {
  const [newObjective, setNewObjective] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newAudience, setNewAudience] = useState('');

  const addObjective = () => {
    if (newObjective.trim()) {
      const objectives = [...(formData.learning_objectives || []), newObjective.trim()];
      updateFormData({ learning_objectives: objectives });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    const objectives = formData.learning_objectives?.filter((_, i) => i !== index) || [];
    updateFormData({ learning_objectives: objectives });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const skills = [...(formData.skills_taught || []), newSkill.trim()];
      updateFormData({ skills_taught: skills });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const skills = formData.skills_taught?.filter((_, i) => i !== index) || [];
    updateFormData({ skills_taught: skills });
  };

  const addAudience = () => {
    if (newAudience.trim()) {
      const audiences = [...(formData.target_audience || []), newAudience.trim()];
      updateFormData({ target_audience: audiences });
      setNewAudience('');
    }
  };

  const removeAudience = (index: number) => {
    const audiences = formData.target_audience?.filter((_, i) => i !== index) || [];
    updateFormData({ target_audience: audiences });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Learning Outcomes & Target Audience</h3>
        <p className="text-muted-foreground mb-6">
          Define what students will learn and who this course is designed for.
        </p>
      </div>

      {/* Learning Objectives */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Learning Objectives</Label>
        <p className="text-sm text-muted-foreground">
          What specific outcomes will students achieve after completing this course?
        </p>
        
        <div className="flex gap-2">
          <Input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Add a learning objective"
            onKeyPress={(e) => e.key === 'Enter' && addObjective()}
          />
          <Button onClick={addObjective} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.learning_objectives?.map((objective, index) => (
            <Badge key={index} variant="secondary" className="pr-1">
              {objective}
              <button
                onClick={() => removeObjective(index)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills Taught */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Skills Taught</Label>
        <p className="text-sm text-muted-foreground">
          What specific skills will students develop or improve?
        </p>
        
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills_taught?.map((skill, index) => (
            <Badge key={index} variant="secondary" className="pr-1">
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-4">
        <Label htmlFor="prerequisites" className="text-base font-medium">Prerequisites</Label>
        <p className="text-sm text-muted-foreground">
          What knowledge or experience should students have before taking this course?
        </p>
        <Textarea
          id="prerequisites"
          value={formData.prerequisites || ''}
          onChange={(e) => updateFormData({ prerequisites: e.target.value })}
          placeholder="Describe any prerequisites or recommended background knowledge..."
          className="min-h-[100px]"
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Target Audience</Label>
        <p className="text-sm text-muted-foreground">
          Who is this course designed for? (e.g., beginners, professionals, students)
        </p>
        
        <div className="flex gap-2">
          <Input
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
            placeholder="Add target audience"
            onKeyPress={(e) => e.key === 'Enter' && addAudience()}
          />
          <Button onClick={addAudience} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.target_audience?.map((audience, index) => (
            <Badge key={index} variant="secondary" className="pr-1">
              {audience}
              <button
                onClick={() => removeAudience(index)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
