import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText, Brain, TrendingUp, Target, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useDashboardStats();

  const statsData = [
    {
      title: "Active Courses",
      value: isLoading ? "-" : stats.activeCourses.toString(),
      description: "Currently enrolled",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Study Streak",
      value: "12",
      description: "Days in a row",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Assignments Due",
      value: isLoading ? "-" : stats.assignmentsDue.toString(),
      description: "This week",
      icon: Target,
      color: "text-orange-600"
    },
    {
      title: "Study Hours",
      value: isLoading ? "-" : stats.studyHours.toString(),
      description: "This month",
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  const recentActivity = [
    { action: "Completed Physics Assignment", course: "PHYS 301", time: "2 hours ago" },
    { action: "Added notes on Calculus", course: "MATH 203", time: "4 hours ago" },
    { action: "Started History essay", course: "HIST 250", time: "1 day ago" },
    { action: "Uploaded CS project", course: "CS 101", time: "2 days ago" }
  ];

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
              <h1 className="text-xl font-semibold text-gray-900">Academic Aura</h1>
            </div>
            <UserMenu />
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Here's what you've accomplished and what's coming up.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.description}</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate("/courses")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Courses
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate("/notebook")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan Study Session
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Ask AI Tutor
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.course} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unlock AI-Powered Learning
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get personalized study plans, instant help, and smart insights to boost your academic performance.
                  </p>
                  <Button>
                    <Brain className="h-4 w-4 mr-2" />
                    Explore AI Features
                  </Button>
                </div>
                <Brain className="h-16 w-16 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
