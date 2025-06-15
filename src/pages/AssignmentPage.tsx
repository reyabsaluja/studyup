
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, MessageSquare, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import { useAssignment } from '@/hooks/useAssignment';
import { useAiChats } from '@/hooks/useAiChats';
import type { Database } from '@/integrations/supabase/types';

type AiChat = Database['public']['Tables']['ai_chats']['Row'];

const AssignmentPage = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const navigate = useNavigate();

  const { assignment, isLoading: assignmentLoading } = useAssignment(assignmentId);
  const { chats, isLoading: chatsLoading } = useAiChats(assignmentId);

  const handleChatClick = (chat: AiChat) => {
    navigate('/ai-tutor', { state: { chatToLoad: chat } });
  };

  if (assignmentLoading || chatsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation />
        <main className="flex-1 flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Assignment not found</h2>
            <Button onClick={() => navigate(`/courses/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="icon" onClick={() => navigate(`/courses/${courseId}`)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{assignment.title}</h1>
                <p className="text-sm text-gray-500">
                  Part of <Link to={`/courses/${courseId}`} className="text-blue-600 hover:underline">{assignment.courses?.name}</Link>
                </p>
              </div>
            </div>
            <UserMenu />
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700">{assignment.description || 'No description provided.'}</p>
              </div>
              {assignment.due_date && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Due on {new Date(assignment.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Linked AI Tutor Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chats && chats.length > 0 ? (
                <ul className="space-y-3">
                  {chats.map(chat => (
                    <li key={chat.id}>
                      <button
                        onClick={() => handleChatClick(chat)}
                        className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-semibold">{chat.title}</p>
                        <p className="text-sm text-gray-500">
                          Saved on {new Date(chat.created_at).toLocaleString()}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No AI chats have been linked to this assignment yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AssignmentPage;
