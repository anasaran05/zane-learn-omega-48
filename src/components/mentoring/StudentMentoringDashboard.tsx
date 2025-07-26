
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMentoringSessions } from '@/hooks/useMentoringSessions';
import { SessionBookingModal } from './SessionBookingModal';
import { MentorChatBox } from './MentorChatBox';
import { CalendarDays, MessageSquare, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

export function StudentMentoringDashboard() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const { data: sessions = [], isLoading } = useMentoringSessions();

  const activeSessions = sessions.filter(s => s.status === 'accepted' && s.chat_enabled);
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  if (isLoading) {
    return <div>Loading mentoring sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mentoring Sessions</h2>
        <Button onClick={() => setShowBookingModal(true)}>
          <CalendarDays className="h-4 w-4 mr-2" />
          Book Session
        </Button>
      </div>

      {/* Active Chat Session */}
      {activeSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Active Session
          </h3>
          <MentorChatBox session={activeSessions[0]} />
        </div>
      )}

      {/* Pending Sessions */}
      {pendingSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pending Sessions</h3>
          <div className="grid gap-4">
            {pendingSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">
                          {format(new Date(`${session.scheduled_date} ${session.scheduled_time}`), 'PPp')}
                        </span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {session.status}
                        </Badge>
                      </div>
                      {session.courses_enhanced?.title && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Course: {session.courses_enhanced.title}
                        </p>
                      )}
                      {session.student_notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Notes: {session.student_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Sessions</h3>
          <div className="grid gap-4">
            {completedSessions.slice(0, 3).map((session) => (
              <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedSession(session)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          {format(new Date(`${session.scheduled_date} ${session.scheduled_time}`), 'PPp')}
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      {session.courses_enhanced?.title && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Course: {session.courses_enhanced.title}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No mentoring sessions yet</h3>
            <p className="text-muted-foreground mb-4">
              Book your first mentoring session to get personalized guidance from our expert reviewers.
            </p>
            <Button onClick={() => setShowBookingModal(true)}>
              <CalendarDays className="h-4 w-4 mr-2" />
              Book Your First Session
            </Button>
          </CardContent>
        </Card>
      )}

      <SessionBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Session Chat History</h3>
              <Button variant="outline" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <MentorChatBox session={selectedSession} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
