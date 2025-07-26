
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useMentorChat, useSendChatMessage } from '@/hooks/useMentoringSessions';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send, Clock, Video } from 'lucide-react';
import { format } from 'date-fns';

interface MentorChatBoxProps {
  session: any;
  isReviewer?: boolean;
}

export function MentorChatBox({ session, isReviewer = false }: MentorChatBoxProps) {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { data: messages = [], isLoading } = useMentorChat(session.id);
  const sendMessage = useSendChatMessage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isChatEnabled = session.chat_enabled && session.status === 'accepted';
  const isExpired = session.chat_expires_at && new Date() > new Date(session.chat_expires_at);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isChatEnabled || isExpired) return;

    try {
      await sendMessage.mutateAsync({
        sessionId: session.id,
        message: message.trim()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[session.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {session.status}
      </Badge>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mentoring Session
          </CardTitle>
          {getStatusBadge()}
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {format(new Date(`${session.scheduled_date} ${session.scheduled_time}`), 'PPp')} ({session.timezone})
          </div>
          {session.course_id && (
            <div>Course: {session.courses_enhanced?.title}</div>
          )}
          {session.chat_expires_at && isChatEnabled && (
            <div className="text-orange-600">
              Chat expires: {format(new Date(session.chat_expires_at), 'p')}
            </div>
          )}
        </div>

        {session.student_notes && (
          <div className="bg-blue-50 p-2 rounded text-sm">
            <strong>Student notes:</strong> {session.student_notes}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        {!isChatEnabled && session.status === 'pending' && (
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-yellow-800">
              {isReviewer ? 
                "Accept this session to enable chat" : 
                "Waiting for reviewer to accept the session"
              }
            </p>
          </div>
        )}

        {isExpired && (
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <p className="text-red-800">Chat session has expired</p>
          </div>
        )}

        {isChatEnabled && !isExpired && (
          <>
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isOwn
                            ? 'bg-blue-600 text-white'
                            : msg.message_type === 'system'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {format(new Date(msg.created_at), 'p')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sendMessage.isPending}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || sendMessage.isPending}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        )}

        {session.status === 'completed' && messages.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg text-center mt-4">
            <p className="text-green-800">Session completed. Chat is now read-only.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
