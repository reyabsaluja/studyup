
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Trash2, FileText } from 'lucide-react';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import { useGeminiChat } from '@/hooks/useGeminiChat';
import ReactMarkdown from 'react-markdown';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';

// Custom CSS animation for highlighting new assistant responses
const highlightStyle = `
@keyframes ai-highlight {
  0% { background: #fffbe7; }
  100% { background: transparent; }
}
.ai-highlight {
  animation: ai-highlight 1.2s ease;
}
`;

const AITutor = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, sendMessage, clearMessages } = useGeminiChat();
  const location = useLocation();

  // For highlighting the latest assistant message
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const prevMessagesLength = useRef(messages.length);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get course context from navigation state
  const courseContext = location.state as { courseId?: string; courseName?: string; context?: string } | null;
  
  // Fetch course materials if a courseId is present
  const { materials } = useCourseMaterials(courseContext?.courseId ?? '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Detect if a new assistant message arrived
    if (
      messages.length > prevMessagesLength.current &&
      messages[messages.length - 1]?.role === 'assistant'
    ) {
      const newAssistantId = messages[messages.length - 1].id;
      setHighlightId(newAssistantId);
      // Remove highlight after 1.1s (less than animation duration)
      setTimeout(() => setHighlightId(null), 1100);
    }
    prevMessagesLength.current = messages.length;
    scrollToBottom();
  }, [messages]);

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

    // Add course materials to the context
    if (materials && materials.length > 0) {
      const materialList = materials.map(m => `- "${m.title}" (Type: ${m.type})`).join('\n');
      context += `\n\nHere are the course materials available to the student for reference:\n${materialList}\nWhen a question seems related to these materials, you can base your answer on them. Note that you cannot access the content of these files, only their titles and types. If asked to summarize a document, explain this limitation.`;
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
      {/* Inject animation CSS style */}
      <style>{highlightStyle}</style>
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

              <CardContent className="flex-1 flex flex-col overflow-hidden">
                {/* Course material context indicator */}
                {materials && materials.length > 0 && (
                  <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-800 flex items-center space-x-2">
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span>
                      This chat has context from {materials.length} course material(s). The AI will use this to better answer your questions.
                    </span>
                  </div>
                )}
                
                {/* Chat messages scrollable container */}
                <ScrollArea className="flex-1 mb-4 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>
                          {courseContext
                            ? `Ready to help you with ${courseContext.courseName}!`
                            : "Start a conversation with your AI tutor!"
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
                            className={`max-w-[80%] md:max-w-[65%] w-full p-3 rounded-lg transition-colors
                              ${message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }
                              ${message.role === 'assistant' && message.id === highlightId ? 'ai-highlight' : ''}
                            `}
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              overflow: 'hidden',
                              whiteSpace: 'pre-wrap',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                              minWidth: 0,
                            }}
                          >
                            {message.role === 'assistant' ? (
                              <div
                                className="prose prose-sm break-words whitespace-pre-wrap max-w-full overflow-x-auto"
                                style={{
                                  maxWidth: '100%',
                                  minWidth: 0,
                                  overflowX: 'auto', // So code/markdown blocks can scroll horizontally!
                                  wordBreak: 'break-word',
                                }}
                              >
                                <ReactMarkdown
                                  components={{
                                    // Clamp super long words and enable horizontal scroll for code/tables within markdown!
                                    code: ({node, ...props}) => (
                                      <code
                                        style={{ wordBreak: 'break-all', overflowX: 'auto', maxWidth: '100%' }}
                                        className="inline-block max-w-full break-all overflow-x-auto"
                                        {...props}
                                      />
                                    ),
                                    pre: ({node, ...props}) => (
                                      <pre
                                        style={{ overflowX: 'auto', maxWidth: '100%' }}
                                        className="max-w-full overflow-x-auto"
                                        {...props}
                                      />
                                    ),
                                    table: ({node, ...props}) => (
                                      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                                        <table className="max-w-full" {...props} />
                                      </div>
                                    ),
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                            )}
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
                    <div ref={messagesEndRef} />
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
