
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Globe, DollarSign, Users, Tag } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';

interface MetaPublishStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
}

export function MetaPublishStep({ formData, updateFormData }: MetaPublishStepProps) {
  const [newPricingTier, setNewPricingTier] = useState<'free' | 'plus' | 'pro' | 'enterprise'>('free');
  const [newPricingPrice, setNewPricingPrice] = useState<string>('0');
  const [newFeature, setNewFeature] = useState('');
  const [currentTierFeatures, setCurrentTierFeatures] = useState<string[]>([]);
  const [newInstructor, setNewInstructor] = useState('');

  const addPricingPlan = () => {
    const price = parseFloat(newPricingPrice) || 0;
    const newPlan = {
      tier: newPricingTier,
      price: price,
      features: [...currentTierFeatures]
    };

    const existingPlans = formData.pricing_plans || [];
    const updatedPlans = [...existingPlans, newPlan];
    
    updateFormData({ pricing_plans: updatedPlans });
    
    // Reset form
    setNewPricingTier('free');
    setNewPricingPrice('0');
    setCurrentTierFeatures([]);
  };

  const removePricingPlan = (index: number) => {
    const plans = formData.pricing_plans?.filter((_, i) => i !== index) || [];
    updateFormData({ pricing_plans: plans });
  };

  const addFeatureToCurrentTier = () => {
    if (newFeature.trim()) {
      setCurrentTierFeatures([...currentTierFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeatureFromCurrentTier = (index: number) => {
    const features = currentTierFeatures.filter((_, i) => i !== index);
    setCurrentTierFeatures(features);
  };

  const addInstructor = () => {
    if (newInstructor.trim()) {
      const instructors = [...(formData.instructor_ids || []), newInstructor.trim()];
      updateFormData({ instructor_ids: instructors });
      setNewInstructor('');
    }
  };

  const removeInstructor = (index: number) => {
    const instructors = formData.instructor_ids?.filter((_, i) => i !== index) || [];
    updateFormData({ instructor_ids: instructors });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Meta Information & Publishing</h3>
        <p className="text-muted-foreground mb-6">
          Final details for course metadata, pricing, and publication settings.
        </p>
      </div>

      {/* Pricing Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted/20">
            <Label className="text-base font-medium mb-3 block">Add Pricing Tier</Label>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="pricing-tier">Tier</Label>
                <Select
                  value={newPricingTier}
                  onValueChange={(value: any) => setNewPricingTier(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="plus">Plus</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricing-price">Price ($)</Label>
                <Input
                  id="pricing-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPricingPrice}
                  onChange={(e) => setNewPricingPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-4">
              <Label>Features for this tier</Label>
              <div className="flex gap-2 mt-1 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && addFeatureToCurrentTier()}
                />
                <Button onClick={addFeatureToCurrentTier} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentTierFeatures.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {feature}
                    <button
                      onClick={() => removeFeatureFromCurrentTier(index)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={addPricingPlan}>
              Add Pricing Plan
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Current Pricing Plans</Label>
            {(!formData.pricing_plans || formData.pricing_plans.length === 0) ? (
              <p className="text-muted-foreground text-sm">No pricing plans added yet</p>
            ) : (
              formData.pricing_plans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background border rounded">
                  <div>
                    <div className="font-medium capitalize">
                      {plan.tier} - ${plan.price || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.features?.length || 0} features included
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePricingPlan(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Course Instructors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Add Instructors</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add instructor user IDs or email addresses
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                value={newInstructor}
                onChange={(e) => setNewInstructor(e.target.value)}
                placeholder="Instructor ID or email"
                onKeyPress={(e) => e.key === 'Enter' && addInstructor()}
              />
              <Button onClick={addInstructor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.instructor_ids?.map((instructor, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {instructor}
                  <button
                    onClick={() => removeInstructor(index)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO & Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            SEO & Marketing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-keywords">Keywords (for search)</Label>
            <Input
              id="meta-keywords"
              placeholder="web development, javascript, react, programming"
              // This would be stored in a separate field if needed
            />
            <p className="text-sm text-muted-foreground mt-1">
              Comma-separated keywords to help students find your course
            </p>
          </div>

          <div>
            <Label htmlFor="marketing-description">Marketing Description</Label>
            <Textarea
              id="marketing-description"
              placeholder="A compelling description for course marketing and search results..."
              className="min-h-[100px]"
              // This would be stored in a separate field if needed
            />
          </div>
        </CardContent>
      </Card>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Publishing Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-publish"
              defaultChecked={true}
            />
            <Label htmlFor="auto-publish">Publish immediately upon creation</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allow-enrollment"
              defaultChecked={true}
            />
            <Label htmlFor="allow-enrollment">Allow student enrollments</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured-course"
              defaultChecked={false}
            />
            <Label htmlFor="featured-course">Mark as featured course</Label>
          </div>

          <div>
            <Label htmlFor="enrollment-limit">Enrollment Limit</Label>
            <Input
              id="enrollment-limit"
              type="number"
              min="0"
              placeholder="Leave empty for unlimited"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum number of students who can enroll (optional)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2 text-green-800">Ready to Publish!</h4>
          <div className="text-sm space-y-1 text-green-700">
            <p>• Course: {formData.title || 'Untitled Course'}</p>
            <p>• Modules: {formData.modules?.length || 0}</p>
            <p>• Total Lessons: {formData.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0}</p>
            <p>• Pricing Plans: {formData.pricing_plans?.length || 0}</p>
            <p>• Instructors: {formData.instructor_ids?.length || 0}</p>
          </div>
          <p className="text-sm text-green-600 mt-3">
            Review all settings and click "Create Course" to finalize your course!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
