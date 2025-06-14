import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Search, Plus, FileText, Image, Mic, Tag, Filter } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import UserMenu from "@/components/UserMenu";

const Notebook = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const notes = [
    {
      id: 1,
      title: "Quantum Mechanics - Wave Functions",
      content: "Wave functions are mathematical descriptions of the quantum state of isolated quantum systems...",
      course: "Advanced Physics",
      tags: ["quantum", "physics", "wave-functions"],
      date: "2 hours ago",
      type: "text",
      aiSummary: "Key concepts about wave functions and their role in quantum mechanics"
    },
    {
      id: 2, 
      title: "Calculus Integration Techniques",
      content: "Integration by parts, substitution method, and partial fractions...",
      course: "Calculus III",
      tags: ["calculus", "integration", "math"],
      date: "Yesterday",
      type: "image",
      aiSummary: "Various integration methods with step-by-step examples"
    },
    {
      id: 3,
      title: "World War II Lecture Notes",
      content: "Causes of WWII, major battles, key figures and outcomes...",
      course: "Modern History", 
      tags: ["history", "wwii", "lectures"],
      date: "3 days ago",
      type: "audio",
      aiSummary: "Comprehensive overview of WWII causes, events, and consequences"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'text-blue-600 bg-blue-50';
      case 'audio': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Notebook</h1>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Notebook</h2>
            <p className="text-gray-600">AI-enhanced note-taking with multimodal support and smart organization.</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes, tags, or content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* AI Quick Actions */}
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Note Assistant</h3>
                  <p className="text-gray-600 mb-4">Upload content or ask questions about your notes</p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Image className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Note
                    </Button>
                    <Button variant="outline" size="sm">
                      <Brain className="h-4 w-4 mr-2" />
                      Ask AI
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1 rounded ${getTypeColor(note.type)}`}>
                          {getTypeIcon(note.type)}
                        </div>
                        <span className="text-xs text-gray-500">{note.course}</span>
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2">{note.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{note.date}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                  
                  {/* AI Summary */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">AI Summary</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.aiSummary}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Brain className="h-4 w-4 mr-1" />
                      Quiz Me
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create New Note Options */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">Text Note</h4>
                  <p className="text-sm text-gray-500 mt-1">Create a new text-based note</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Image className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">Image Note</h4>
                  <p className="text-sm text-gray-500 mt-1">Upload and analyze images</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Mic className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">Voice Note</h4>
                  <p className="text-sm text-gray-500 mt-1">Record and transcribe audio</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">AI Generate</h4>
                  <p className="text-sm text-gray-500 mt-1">Let AI create notes from prompts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notebook;
