
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSubmitSessionReport } from '@/hooks/useMentoringSessions';
import { FileText, Star } from 'lucide-react';

interface SessionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export function SessionReportModal({ isOpen, onClose, session }: SessionReportModalProps) {
  const [formData, setFormData] = useState({
    student_progress_assessment: '',
    key_topics_discussed: '',
    recommendations: '',
    next_steps: '',
    overall_rating: 5
  });

  const submitReport = useSubmitSessionReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitReport.mutateAsync({
        session_id: session.id,
        student_progress_assessment: formData.student_progress_assessment,
        key_topics_discussed: formData.key_topics_discussed.split(',').map(topic => topic.trim()).filter(Boolean),
        recommendations: formData.recommendations,
        next_steps: formData.next_steps,
        overall_rating: formData.overall_rating
      });
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Session Report
          </DialogTitle>
        </DialogHeader>

        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <div className="text-sm text-blue-800">
            <strong>Student:</strong> {session.users?.email}
          </div>
          <div className="text-sm text-blue-800">
            <strong>Course:</strong> {session.courses_enhanced?.title || 'General Mentoring'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="assessment">Student Progress Assessment *</Label>
            <Textarea
              id="assessment"
              value={formData.student_progress_assessment}
              onChange={(e) => setFormData(prev => ({ ...prev, student_progress_assessment: e.target.value }))}
              placeholder="Assess the student's current progress, strengths, and areas for improvement..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="topics">Key Topics Discussed *</Label>
            <Input
              id="topics"
              value={formData.key_topics_discussed}
              onChange={(e) => setFormData(prev => ({ ...prev, key_topics_discussed: e.target.value }))}
              placeholder="Topic 1, Topic 2, Topic 3..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Separate topics with commas</p>
          </div>

          <div>
            <Label htmlFor="recommendations">Recommendations *</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
              placeholder="Provide specific recommendations for the student's continued learning..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="next-steps">Next Steps</Label>
            <Textarea
              id="next-steps"
              value={formData.next_steps}
              onChange={(e) => setFormData(prev => ({ ...prev, next_steps: e.target.value }))}
              placeholder="Suggest specific next steps or action items..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="rating">Overall Rating</Label>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, overall_rating: rating }))}
                  className={`p-1 rounded ${
                    rating <= formData.overall_rating
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.overall_rating}/5
              </span>
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Important:</strong> This report must be submitted within 1 hour after the session ends. 
              The student will receive a summary and the chat will become read-only.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitReport.isPending}>
              {submitReport.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
