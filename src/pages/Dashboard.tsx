
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText, Brain, CheckSquare, Target, Users, Activity } from "lucide-react";
import Navigation from "@/components/Navigation";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useActivities } from "@/hooks/useActivities";

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useActivities();

  const statsData = [
    {
      title: "Active Courses",
      value: isLoading ? "-" : stats.activeCourses.toString(),
      description: "Currently enrolled",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Total Assignments",
      value: isLoading ? "-" : stats.totalAssignments.toString(),
      description: "Across all courses",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Due This Week",
      value: isLoading ? "-" : stats.assignmentsDue.toString(),
      description: "Assignments pending",
      icon: Activity,
      color: "text-orange-600"
    },
    {
      title: "Course Materials",
      value: "24",
      description: "Uploaded files",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your tasks and coursework</p>
            </div>
            <UserMenu />
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">Here's what you've accomplished and what's coming up.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-muted`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start font-medium" 
                  variant="ghost"
                  onClick={() => navigate("/courses")}
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  View All Courses
                </Button>
                <Button 
                  className="w-full justify-start font-medium" 
                  variant="ghost"
                  onClick={() => navigate("/notebook")}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Create New Note
                </Button>
                <Button className="w-full justify-start font-medium" variant="ghost">
                  <Calendar className="h-4 w-4 mr-3" />
                  Plan Study Session
                </Button>
                <Button 
                  className="w-full justify-start font-medium" 
                  variant="ghost"
                  onClick={() => navigate("/ai-tutor")}
                >
                  <Brain className="h-4 w-4 mr-3" />
                  Ask AI Tutor
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activitiesLoading ? (
                    <div className="text-sm text-muted-foreground">Loading activities...</div>
                  ) : activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.activity_description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.related_course_name && `${activity.related_course_name} • `}
                            {formatActivityTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No recent activity. Start by creating a course or assignment!</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features */}
          <Card className="border border-border bg-gradient-to-r from-muted/50 to-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Unlock AI-Powered Learning
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get personalized study plans, instant help, and smart insights to boost your academic performance.
                  </p>
                  <Button onClick={() => navigate("/ai-tutor")} className="font-medium">
                    <Brain className="h-4 w-4 mr-2" />
                    Explore AI Features
                  </Button>
                </div>
                <Brain className="h-16 w-16 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
