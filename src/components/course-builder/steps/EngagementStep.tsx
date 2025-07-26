
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Users, Calendar, UserCheck } from 'lucide-react';
import { CourseFormData } from '@/hooks/useCourseCreation';
import { useState } from 'react';

interface EngagementStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
}

export function EngagementStep({ formData, updateFormData }: EngagementStepProps) {
  const [newMentor, setNewMentor] = useState('');
  const [scheduleDay, setScheduleDay] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleDuration, setScheduleDuration] = useState('60');

  const engagementSettings = formData.engagement_settings || {};

  const updateEngagementSettings = (updates: any) => {
    updateFormData({
      engagement_settings: {
        ...engagementSettings,
        ...updates
      }
    });
  };

  const addMentor = () => {
    if (newMentor.trim()) {
      const mentors = [...(engagementSettings.mentor_assignments || []), newMentor.trim()];
      updateEngagementSettings({ mentor_assignments: mentors });
      setNewMentor('');
    }
  };

  const removeMentor = (index: number) => {
    const mentors = engagementSettings.mentor_assignments?.filter((_, i) => i !== index) || [];
    updateEngagementSettings({ mentor_assignments: mentors });
  };

  const addLiveSession = () => {
    if (scheduleDay && scheduleTime) {
      const schedule = engagementSettings.live_session_schedule || {};
      const sessions = schedule.sessions || [];
      
      const newSession = {
        day: scheduleDay,
        time: scheduleTime,
        duration: parseInt(scheduleDuration),
        id: Date.now().toString()
      };

      updateEngagementSettings({
        live_session_schedule: {
          ...schedule,
          sessions: [...sessions, newSession]
        }
      });

      setScheduleDay('');
      setScheduleTime('');
      setScheduleDuration('60');
    }
  };

  const removeSession = (sessionId: string) => {
    const schedule = engagementSettings.live_session_schedule || {};
    const sessions = (schedule.sessions || []).filter((session: any) => session.id !== sessionId);
    
    updateEngagementSettings({
      live_session_schedule: {
        ...schedule,
        sessions
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Engagement Settings</h3>
        <p className="text-muted-foreground mb-6">
          Configure community features and live interactions to boost student engagement.
        </p>
      </div>

      {/* Discussion Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Discussion Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="discussion-groups"
              checked={engagementSettings.discussion_groups_enabled || false}
              onCheckedChange={(checked) => updateEngagementSettings({ discussion_groups_enabled: checked })}
            />
            <Label htmlFor="discussion-groups">Enable student discussion groups</Label>
          </div>
          
          {engagementSettings.discussion_groups_enabled && (
            <div className="space-y-4 border-l-2 border-cherry-500 pl-4">
              <div>
                <Label>Group Formation Method</Label>
                <Select
                  value={engagementSettings.domain_group_mapping?.method || 'automatic'}
                  onValueChange={(value) => updateEngagementSettings({
                    domain_group_mapping: {
                      ...engagementSettings.domain_group_mapping,
                      method: value
                    }
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic Assignment</SelectItem>
                    <SelectItem value="skill-based">Skill-Based Grouping</SelectItem>
                    <SelectItem value="random">Random Assignment</SelectItem>
                    <SelectItem value="self-select">Student Self-Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="group-size">Group Size</Label>
                  <Input
                    id="group-size"
                    type="number"
                    min="2"
                    max="10"
                    value={engagementSettings.domain_group_mapping?.groupSize || 4}
                    onChange={(e) => updateEngagementSettings({
                      domain_group_mapping: {
                        ...engagementSettings.domain_group_mapping,
                        groupSize: parseInt(e.target.value) || 4
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-groups">Max Groups</Label>
                  <Input
                    id="max-groups"
                    type="number"
                    min="1"
                    value={engagementSettings.domain_group_mapping?.maxGroups || 10}
                    onChange={(e) => updateEngagementSettings({
                      domain_group_mapping: {
                        ...engagementSettings.domain_group_mapping,
                        maxGroups: parseInt(e.target.value) || 10
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Live Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="live-sessions"
              checked={engagementSettings.live_sessions_enabled || false}
              onCheckedChange={(checked) => updateEngagementSettings({ live_sessions_enabled: checked })}
            />
            <Label htmlFor="live-sessions">Schedule live instructor sessions</Label>
          </div>
          
          {engagementSettings.live_sessions_enabled && (
            <div className="space-y-4 border-l-2 border-cherry-500 pl-4">
              <div>
                <Label>Add Session Schedule</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Select value={scheduleDay} onValueChange={setScheduleDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                  
                  <Select value={scheduleDuration} onValueChange={setScheduleDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={addLiveSession}
                    disabled={!scheduleDay || !scheduleTime}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Scheduled Sessions</Label>
                {engagementSettings.live_session_schedule?.sessions?.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-background border rounded">
                    <span className="text-sm">
                      {session.day.charAt(0).toUpperCase() + session.day.slice(1)} at {session.time} ({session.duration} min)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSession(session.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No sessions scheduled yet</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mentor Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Mentor Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Assign Mentors</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add mentor names or IDs who will guide students through this course
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                value={newMentor}
                onChange={(e) => setNewMentor(e.target.value)}
                placeholder="Mentor name or email"
                onKeyPress={(e) => e.key === 'Enter' && addMentor()}
              />
              <Button onClick={addMentor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {engagementSettings.mentor_assignments?.map((mentor, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {mentor}
                  <button
                    onClick={() => removeMentor(index)}
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

      {/* Summary */}
      {(engagementSettings.discussion_groups_enabled || engagementSettings.live_sessions_enabled || (engagementSettings.mentor_assignments && engagementSettings.mentor_assignments.length > 0)) && (
        <Card className="bg-cherry-50 border-cherry-200">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Engagement Features Summary:</h4>
            <ul className="text-sm space-y-1">
              {engagementSettings.discussion_groups_enabled && (
                <li>• Discussion groups with {engagementSettings.domain_group_mapping?.method || 'automatic'} assignment</li>
              )}
              {engagementSettings.live_sessions_enabled && (
                <li>• {engagementSettings.live_session_schedule?.sessions?.length || 0} live sessions scheduled</li>
              )}
              {engagementSettings.mentor_assignments && engagementSettings.mentor_assignments.length > 0 && (
                <li>• {engagementSettings.mentor_assignments.length} mentors assigned</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
