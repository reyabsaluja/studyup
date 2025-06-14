
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Upload, MessageSquare, Settings, CheckSquare } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Taski</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="font-medium">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="w-8 h-8 bg-muted rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
          </div>

          {/* AI Assistant Quick Access */}
          <Card className="mb-8 border border-border bg-gradient-to-r from-muted/50 to-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Ask Your AI Assistant</h3>
                  <p className="text-muted-foreground mb-4">Upload content, ask questions, or get study suggestions</p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="font-medium">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button variant="outline" size="sm" className="font-medium">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Brain className="h-16 w-16 text-muted-foreground/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">4</div>
                <p className="text-xs text-muted-foreground mt-1">2 assignments due this week</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">23</div>
                <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">AI Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">28</div>
                <p className="text-xs text-muted-foreground mt-1">Questions answered today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <p className="font-medium text-foreground">Physics Assignment</p>
                      <p className="text-sm text-muted-foreground">Due in 2 days</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div>
                      <p className="font-medium text-foreground">Math Quiz</p>
                      <p className="text-sm text-muted-foreground">Due in 5 days</p>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <p className="font-medium text-foreground">History Essay</p>
                      <p className="text-sm text-muted-foreground">Due next week</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent AI Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground mb-1">Quantum Physics Lecture</p>
                    <p className="text-sm text-muted-foreground">AI summary of 45-min video lecture</p>
                    <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">
                      View Summary →
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground mb-1">Calculus Textbook Ch. 5</p>
                    <p className="text-sm text-muted-foreground">PDF analysis and key points</p>
                    <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">
                      View Summary →
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground mb-1">Study Plan Generated</p>
                    <p className="text-sm text-muted-foreground">AI-optimized schedule for finals</p>
                    <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">
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
