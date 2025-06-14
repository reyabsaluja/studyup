import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import { useGeminiChat } from '@/hooks/useGeminiChat';

const AITutor = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, sendMessage, clearMessages } = useGeminiChat();
  const location = useLocation();
  
  // Get course context from navigation state
  const courseContext = location.state as { courseId?: string; courseName?: string; context?: string } | null;

  useEffect(() => {
    // If we have course context and no messages yet, send a greeting
    if (courseContext && messages.length === 0) {
      const greeting = `Hello! I'm here to help you with ${courseContext.courseName}. What would you like to know or work on?`;
      // We don't automatically send this as a message, just show it as context
    }
  }, [courseContext, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    let context = "You are an AI tutor helping students with their academic questions. Be helpful, encouraging, and provide clear explanations.";
    
    // Add course-specific context if available
    if (courseContext) {
      context += ` The student is currently working on ${courseContext.courseName}. Tailor your responses to be relevant to this course when appropriate.`;
    }
    
    await sendMessage(inputMessage, context);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">StudyUp</h1>
                <span className="text-sm text-gray-500">AI Tutor</span>
                {courseContext && (
                  <p className="text-sm text-gray-500">Currently helping with: {courseContext.courseName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={clearMessages} disabled={messages.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Learning Assistant</h2>
              <p className="text-gray-600">
                Ask questions about your studies and get intelligent, personalized help.
                {courseContext && ` Currently focused on ${courseContext.courseName}.`}
              </p>
            </div>

            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Chat with AI Tutor (Powered by Gemini 2.0 Flash)
                  {courseContext && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      - {courseContext.courseName}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 mb-4 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>
                          {courseContext 
                            ? `Ready to help you with ${courseContext.courseName}!`
                            : 'Start a conversation with your AI tutor!'
                          }
                        </p>
                        <p className="text-sm mt-2">Ask questions about any subject, request explanations, or get study tips.</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      courseContext 
                        ? `Ask about ${courseContext.courseName}...`
                        : "Ask your AI tutor anything..."
                    }
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AITutor;
