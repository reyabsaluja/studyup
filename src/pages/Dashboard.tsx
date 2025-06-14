
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText, Brain, Target, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import UserMenu from "@/components/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
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
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Completed Tasks",
      value: isLoading ? "-" : Math.floor(stats.totalAssignments * 0.7).toString(),
      description: "This month",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Assignments Due",
      value: isLoading ? "-" : stats.assignmentsDue.toString(),
      description: "This week",
      icon: AlertCircle,
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Total Assignments",
      value: isLoading ? "-" : stats.totalAssignments.toString(),
      description: "All courses",
      icon: Target,
      color: "text-purple-600 dark:text-purple-400"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Taski</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back!</h2>
            <p className="text-gray-600 dark:text-gray-400">Here's what you've accomplished and what's coming up.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" 
                  variant="outline"
                  onClick={() => navigate("/courses")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Courses
                </Button>
                <Button 
                  className="w-full justify-start bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" 
                  variant="outline"
                  onClick={() => navigate("/notebook")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
                <Button className="w-full justify-start bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan Study Session
                </Button>
                <Button 
                  className="w-full justify-start bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" 
                  variant="outline"
                  onClick={() => navigate("/ai-tutor")}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Ask AI Tutor
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activitiesLoading ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">Loading activities...</div>
                  ) : activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.activity_description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.related_course_name && `${activity.related_course_name} • `}
                            {formatActivityTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">No recent activity. Start by creating a course or assignment!</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Unlock AI-Powered Learning
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get personalized study plans, instant help, and smart insights to boost your academic performance.
                  </p>
                  <Button onClick={() => navigate("/ai-tutor")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Explore AI Features
                  </Button>
                </div>
                <Brain className="h-16 w-16 text-blue-600 dark:text-blue-400 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
