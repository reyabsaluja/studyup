
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Calendar, FileText, Users, Brain } from "lucide-react";
import Navigation from "@/components/Navigation";
import UserMenu from "@/components/UserMenu";

const Courses = () => {
  const courses = [
    {
      id: 1,
      name: "Advanced Physics",
      code: "PHYS 301",
      color: "bg-blue-500",
      progress: 65,
      nextDeadline: "Assignment due in 2 days",
      materials: 12,
      assignments: 3
    },
    {
      id: 2,
      name: "Calculus III", 
      code: "MATH 203",
      color: "bg-green-500",
      progress: 80,
      nextDeadline: "Quiz in 5 days",
      materials: 8,
      assignments: 2
    },
    {
      id: 3,
      name: "Modern History",
      code: "HIST 250", 
      color: "bg-purple-500",
      progress: 45,
      nextDeadline: "Essay due next week",
      materials: 15,
      assignments: 1
    },
    {
      id: 4,
      name: "Computer Science",
      code: "CS 101",
      color: "bg-orange-500", 
      progress: 90,
      nextDeadline: "Project due in 10 days",
      materials: 20,
      assignments: 4
    }
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
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h2>
            <p className="text-gray-600">Manage your courses, track progress, and access AI-powered features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${course.color} rounded-full`}></div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{course.name}</CardTitle>
                        <p className="text-sm text-gray-500">{course.code}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${course.color} h-2 rounded-full`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {course.nextDeadline}
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        {course.materials} materials
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {course.assignments} assignments
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Brain className="h-4 w-4 mr-1" />
                        Ask AI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">AI Study Planner</h4>
                      <p className="text-sm text-gray-600">Generate optimized study schedules</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Bulk Upload</h4>
                      <p className="text-sm text-gray-600">Upload multiple course materials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Study Groups</h4>
                      <p className="text-sm text-gray-600">Collaborate with AI assistance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Courses;
