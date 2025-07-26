
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Code, FileText, Github } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';
import { useState } from 'react';

interface DomainFeaturesStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
}

export function DomainFeaturesStep({ formData, updateFormData }: DomainFeaturesStepProps) {
  const [newResource, setNewResource] = useState('');
  const [newCaseStudy, setNewCaseStudy] = useState('');

  const domainFeatures = formData.domain_features || {};

  const updateDomainFeatures = (updates: any) => {
    updateFormData({
      domain_features: {
        ...domainFeatures,
        ...updates
      }
    });
  };

  const addLabResource = () => {
    if (newResource.trim()) {
      const resources = [...(domainFeatures.lab_resources || []), newResource.trim()];
      updateDomainFeatures({ lab_resources: resources });
      setNewResource('');
    }
  };

  const removeLabResource = (index: number) => {
    const resources = domainFeatures.lab_resources?.filter((_, i) => i !== index) || [];
    updateDomainFeatures({ lab_resources: resources });
  };

  const addCaseStudy = () => {
    if (newCaseStudy.trim()) {
      const caseStudies = [...(domainFeatures.case_study_urls || []), newCaseStudy.trim()];
      updateDomainFeatures({ case_study_urls: caseStudies });
      setNewCaseStudy('');
    }
  };

  const removeCaseStudy = (index: number) => {
    const caseStudies = domainFeatures.case_study_urls?.filter((_, i) => i !== index) || [];
    updateDomainFeatures({ case_study_urls: caseStudies });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Domain-Specific Features</h3>
        <p className="text-muted-foreground mb-6">
          Configure specialized features that enhance learning for your course domain.
        </p>
      </div>

      {/* Lab Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5" />
            Lab Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="lab-mode"
              checked={domainFeatures.lab_mode_enabled || false}
              onCheckedChange={(checked) => updateDomainFeatures({ lab_mode_enabled: checked })}
            />
            <Label htmlFor="lab-mode">Enable hands-on lab environment</Label>
          </div>
          
          {domainFeatures.lab_mode_enabled && (
            <div className="space-y-4 border-l-2 border-cherry-500 pl-4">
              <div>
                <Label>Lab Resources</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add tools, software, or resources students will use in labs
                </p>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="e.g., Docker, VS Code, Python 3.9+"
                    onKeyPress={(e) => e.key === 'Enter' && addLabResource()}
                  />
                  <Button onClick={addLabResource} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {domainFeatures.lab_resources?.map((resource, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {resource}
                      <button
                        onClick={() => removeLabResource(index)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Case Studies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="case-studies"
              checked={domainFeatures.case_studies_enabled || false}
              onCheckedChange={(checked) => updateDomainFeatures({ case_studies_enabled: checked })}
            />
            <Label htmlFor="case-studies">Include real-world case studies</Label>
          </div>
          
          {domainFeatures.case_studies_enabled && (
            <div className="space-y-4 border-l-2 border-cherry-500 pl-4">
              <div>
                <Label>Case Study URLs</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add links to case studies, documentation, or examples
                </p>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newCaseStudy}
                    onChange={(e) => setNewCaseStudy(e.target.value)}
                    placeholder="https://example.com/case-study"
                    onKeyPress={(e) => e.key === 'Enter' && addCaseStudy()}
                  />
                  <Button onClick={addCaseStudy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {domainFeatures.case_study_urls?.map((url, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                      <button
                        onClick={() => removeCaseStudy(index)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coding Sandbox */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Github className="h-5 w-5" />
            Code Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="coding-sandbox"
              checked={domainFeatures.coding_sandbox_enabled || false}
              onCheckedChange={(checked) => updateDomainFeatures({ coding_sandbox_enabled: checked })}
            />
            <Label htmlFor="coding-sandbox">Enable integrated coding environment</Label>
          </div>
          
          {domainFeatures.coding_sandbox_enabled && (
            <div className="space-y-4 border-l-2 border-cherry-500 pl-4">
              <div>
                <Label htmlFor="github-repo">GitHub Repository URL</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Link to starter code or example repository
                </p>
                <Input
                  id="github-repo"
                  value={domainFeatures.github_repo_url || ''}
                  onChange={(e) => updateDomainFeatures({ github_repo_url: e.target.value })}
                  placeholder="https://github.com/username/course-repo"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {(domainFeatures.lab_mode_enabled || domainFeatures.case_studies_enabled || domainFeatures.coding_sandbox_enabled) && (
        <Card className="bg-cherry-50 border-cherry-200">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Enabled Features Summary:</h4>
            <ul className="text-sm space-y-1">
              {domainFeatures.lab_mode_enabled && (
                <li>• Lab Mode with {domainFeatures.lab_resources?.length || 0} resources</li>
              )}
              {domainFeatures.case_studies_enabled && (
                <li>• Case Studies with {domainFeatures.case_study_urls?.length || 0} examples</li>
              )}
              {domainFeatures.coding_sandbox_enabled && (
                <li>• Integrated Coding Environment</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
