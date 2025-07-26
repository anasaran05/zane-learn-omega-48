
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReviewerSessions, useUpdateSessionStatus } from '@/hooks/useMentoringSessions';
import { MentorChatBox } from './MentorChatBox';
import { SessionReportModal } from './SessionReportModal';
import { CalendarDays, MessageSquare, Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

export function ReviewerMentoringDashboard() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSession, setReportSession] = useState(null);
  const { data: sessions = [], isLoading } = useReviewerSessions();
  const updateStatus = useUpdateSessionStatus();

  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const activeSessions = sessions.filter(s => s.status === 'accepted' && s.chat_enabled);
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const handleAcceptSession = async (sessionId: string) => {
    await updateStatus.mutateAsync({ sessionId, status: 'accepted' });
  };

  const handleRejectSession = async (sessionId: string) => {
    await updateStatus.mutateAsync({ sessionId, status: 'rejected' });
  };

  const openReportModal = (session: any) => {
    setReportSession(session);
    setShowReportModal(true);
  };

  if (isLoading) {
    return <div>Loading mentoring sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mentoring Sessions</h2>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            Pending ({pendingSessions.length})
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Active ({activeSessions.length})
          </span>
        </div>
      </div>

      {/* Pending Sessions */}
      {pendingSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Requests ({pendingSessions.length})
          </h3>
          <div className="grid gap-4">
            {pendingSessions.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-orange-400">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{session.users?.email}</span>
                        <Badge className="bg-yellow-100 text-yellow-800">New Request</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {format(new Date(`${session.scheduled_date} ${session.scheduled_time}`), 'PPp')} ({session.timezone})
                        </div>
                        {session.courses_enhanced?.title && (
                          <div>Course: {session.courses_enhanced.title}</div>
                        )}
                      </div>
                      {session.student_notes && (
                        <div className="bg-blue-50 p-2 rounded mt-2">
                          <p className="text-sm"><strong>Student notes:</strong> {session.student_notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectSession(session.id)}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptSession(session.id)}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-500" />
            Active Sessions ({activeSessions.length})
          </h3>
          <div className="grid gap-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="space-y-4">
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">Session with {session.users?.email}</p>
                    <p className="text-sm text-green-700">
                      Expires: {session.chat_expires_at ? format(new Date(session.chat_expires_at), 'p') : 'No limit'}
                    </p>
                  </div>
                  <Button
                    onClick={() => openReportModal(session)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                </div>
                <MentorChatBox session={session} isReviewer={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Completed Sessions</h3>
          <div className="grid gap-4">
            {completedSessions.slice(0, 5).map((session) => (
              <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedSession(session)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{session.users?.email}</span>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(`${session.scheduled_date} ${session.scheduled_time}`), 'PPp')}
                        {session.courses_enhanced?.title && ` • ${session.courses_enhanced.title}`}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
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
            <p className="text-muted-foreground">
              Students will be able to book mentoring sessions with you. Accepted sessions will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Session Details</h3>
              <Button variant="outline" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <MentorChatBox session={selectedSession} isReviewer={true} />
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportSession && (
        <SessionReportModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportSession(null);
          }}
          session={reportSession}
        />
      )}
    </div>
  );
}
