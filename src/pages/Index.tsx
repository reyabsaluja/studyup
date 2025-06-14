
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Upload, MessageSquare, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Here's what's happening with your studies today.</p>
          </div>

          {/* AI Assistant Quick Access */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Your AI Assistant</h3>
                  <p className="text-gray-600 mb-4">Upload content, ask questions, or get study suggestions</p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Brain className="h-16 w-16 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">4</div>
                <p className="text-xs text-gray-500 mt-1">2 assignments due this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Study Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">12.5</div>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">AI Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">28</div>
                <p className="text-xs text-gray-500 mt-1">Questions answered today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Physics Assignment</p>
                      <p className="text-sm text-gray-600">Due in 2 days</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Math Quiz</p>
                      <p className="text-sm text-gray-600">Due in 5 days</p>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">History Essay</p>
                      <p className="text-sm text-gray-600">Due next week</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent AI Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Quantum Physics Lecture</p>
                    <p className="text-sm text-gray-600">AI summary of 45-min video lecture</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                      View Summary →
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Calculus Textbook Ch. 5</p>
                    <p className="text-sm text-gray-600">PDF analysis and key points</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                      View Summary →
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Study Plan Generated</p>
                    <p className="text-sm text-gray-600">AI-optimized schedule for finals</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                      View Plan →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
