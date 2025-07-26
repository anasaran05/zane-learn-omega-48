
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, CheckCircle, FileText, Target } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';

interface AssessmentsStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
}

export function AssessmentsStep({ formData, updateFormData }: AssessmentsStepProps) {
  const assessments = formData.assessments || {};

  const updateAssessments = (updates: any) => {
    updateFormData({
      assessments: {
        ...assessments,
        ...updates
      }
    });
  };

  const updateCriteria = (criteriaUpdates: any) => {
    updateAssessments({
      certification_criteria: {
        ...assessments.certification_criteria,
        ...criteriaUpdates
      }
    });
  };

  const updateThresholds = (thresholdUpdates: any) => {
    updateAssessments({
      pass_thresholds: {
        ...assessments.pass_thresholds,
        ...thresholdUpdates
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Assessments & Certification</h3>
        <p className="text-muted-foreground mb-6">
          Configure how students will be assessed and certified upon course completion.
        </p>
      </div>

      {/* Certification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="certification"
              checked={assessments.certification_enabled || false}
              onCheckedChange={(checked) => updateAssessments({ certification_enabled: checked })}
            />
            <Label htmlFor="certification">Award certificates upon completion</Label>
          </div>
          
          {assessments.certification_enabled && (
            <div className="space-y-4 border-l-2 border-cherry-500 pl-4">
              <div>
                <Label htmlFor="certificate-template">Certificate Template URL</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  URL to your custom certificate template (optional)
                </p>
                <Input
                  id="certificate-template"
                  value={assessments.certificate_template_url || ''}
                  onChange={(e) => updateAssessments({ certificate_template_url: e.target.value })}
                  placeholder="https://example.com/certificate-template.png"
                />
              </div>

              <div>
                <Label>Certificate Requirements</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="completion-rate">Minimum Completion Rate (%)</Label>
                    <Input
                      id="completion-rate"
                      type="number"
                      min="0"
                      max="100"
                      value={assessments.certification_criteria?.min_completion_rate || 80}
                      onChange={(e) => updateCriteria({ 
                        min_completion_rate: parseInt(e.target.value) || 80 
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min-score">Minimum Average Score (%)</Label>
                    <Input
                      id="min-score"
                      type="number"
                      min="0"
                      max="100"
                      value={assessments.certification_criteria?.min_average_score || 70}
                      onChange={(e) => updateCriteria({ 
                        min_average_score: parseInt(e.target.value) || 70 
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="attendance-req">Attendance Requirements</Label>
                <Select
                  value={assessments.certification_criteria?.attendance_requirement || 'none'}
                  onValueChange={(value) => updateCriteria({ attendance_requirement: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Requirement</SelectItem>
                    <SelectItem value="50">50% Live Session Attendance</SelectItem>
                    <SelectItem value="75">75% Live Session Attendance</SelectItem>
                    <SelectItem value="100">100% Live Session Attendance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pass Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pass Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-threshold">Quiz Pass Threshold (%)</Label>
              <Input
                id="quiz-threshold"
                type="number"
                min="0"
                max="100"
                value={assessments.pass_thresholds?.quiz_pass_score || 70}
                onChange={(e) => updateThresholds({ 
                  quiz_pass_score: parseInt(e.target.value) || 70 
                })}
              />
            </div>
            <div>
              <Label htmlFor="assignment-threshold">Assignment Pass Threshold (%)</Label>
              <Input
                id="assignment-threshold"
                type="number"
                min="0"
                max="100"
                value={assessments.pass_thresholds?.assignment_pass_score || 75}
                onChange={(e) => updateThresholds({ 
                  assignment_pass_score: parseInt(e.target.value) || 75 
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-threshold">Project Pass Threshold (%)</Label>
              <Input
                id="project-threshold"
                type="number"
                min="0"
                max="100"
                value={assessments.pass_thresholds?.project_pass_score || 80}
                onChange={(e) => updateThresholds({ 
                  project_pass_score: parseInt(e.target.value) || 80 
                })}
              />
            </div>
            <div>
              <Label htmlFor="final-threshold">Final Exam Pass Threshold (%)</Label>
              <Input
                id="final-threshold"
                type="number"
                min="0"
                max="100"
                value={assessments.pass_thresholds?.final_exam_pass_score || 75}
                onChange={(e) => updateThresholds({ 
                  final_exam_pass_score: parseInt(e.target.value) || 75 
                })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="overall-threshold">Overall Course Pass Threshold (%)</Label>
            <Input
              id="overall-threshold"
              type="number"
              min="0"
              max="100"
              value={assessments.pass_thresholds?.overall_pass_score || 70}
              onChange={(e) => updateThresholds({ 
                overall_pass_score: parseInt(e.target.value) || 70 
              })}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Students must achieve this overall score to pass the course
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grading Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Grading Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Assessment Weights</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="quiz-weight">Quizzes Weight (%)</Label>
                <Input
                  id="quiz-weight"
                  type="number"
                  min="0"
                  max="100"
                  value={assessments.pass_thresholds?.quiz_weight || 25}
                  onChange={(e) => updateThresholds({ 
                    quiz_weight: parseInt(e.target.value) || 25 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="assignment-weight">Assignments Weight (%)</Label>
                <Input
                  id="assignment-weight"
                  type="number"
                  min="0"
                  max="100"
                  value={assessments.pass_thresholds?.assignment_weight || 35}
                  onChange={(e) => updateThresholds({ 
                    assignment_weight: parseInt(e.target.value) || 35 
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="project-weight">Projects Weight (%)</Label>
                <Input
                  id="project-weight"
                  type="number"
                  min="0"
                  max="100"
                  value={assessments.pass_thresholds?.project_weight || 25}
                  onChange={(e) => updateThresholds({ 
                    project_weight: parseInt(e.target.value) || 25 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="participation-weight">Participation Weight (%)</Label>
                <Input
                  id="participation-weight"
                  type="number"
                  min="0"
                  max="100"
                  value={assessments.pass_thresholds?.participation_weight || 15}
                  onChange={(e) => updateThresholds({ 
                    participation_weight: parseInt(e.target.value) || 15 
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="late-policy">Late Submission Policy</Label>
            <Select
              value={assessments.pass_thresholds?.late_policy || 'flexible'}
              onValueChange={(value) => updateThresholds({ late_policy: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">No Late Submissions</SelectItem>
                <SelectItem value="penalty">10% Penalty Per Day</SelectItem>
                <SelectItem value="grace">3-Day Grace Period</SelectItem>
                <SelectItem value="flexible">Flexible (Case by Case)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-cherry-50 border-cherry-200">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">Assessment Summary:</h4>
          <ul className="text-sm space-y-1">
            <li>• Overall pass threshold: {assessments.pass_thresholds?.overall_pass_score || 70}%</li>
            <li>• Quiz pass score: {assessments.pass_thresholds?.quiz_pass_score || 70}%</li>
            <li>• Assignment pass score: {assessments.pass_thresholds?.assignment_pass_score || 75}%</li>
            {assessments.certification_enabled && (
              <li>• Certification enabled with {assessments.certification_criteria?.min_completion_rate || 80}% completion requirement</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
