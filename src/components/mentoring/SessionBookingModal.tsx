
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookMentorSession } from '@/hooks/useMentoringSessions';
import { useAvailableReviewers } from '@/hooks/useReviewers';
import { CalendarDays, Clock, MessageSquare, User } from 'lucide-react';

interface SessionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionBookingModal({ isOpen, onClose }: SessionBookingModalProps) {
  const [formData, setFormData] = useState({
    reviewer_id: '',
    scheduled_date: '',
    scheduled_time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    student_notes: ''
  });

  const bookSession = useBookMentorSession();
  const { data: reviewers = [] } = useAvailableReviewers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await bookSession.mutateAsync(formData);
      onClose();
      setFormData({
        reviewer_id: '',
        scheduled_date: '',
        scheduled_time: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        student_notes: ''
      });
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Book Mentoring Session
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reviewer">Select Mentor</Label>
            <Select value={formData.reviewer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, reviewer_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a mentor" />
              </SelectTrigger>
              <SelectContent>
                {reviewers.map((reviewer) => (
                  <SelectItem key={reviewer.id} value={reviewer.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {reviewer.email}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London Time</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">What would you like to discuss?</Label>
            <Textarea
              id="notes"
              value={formData.student_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, student_notes: e.target.value }))}
              placeholder="Briefly describe what topics you'd like to cover in this session..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Session duration: 2 hours maximum
            </span>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={bookSession.isPending || !formData.reviewer_id}
            >
              {bookSession.isPending ? 'Booking...' : 'Book Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
