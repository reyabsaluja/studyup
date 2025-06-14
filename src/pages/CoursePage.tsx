
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText, Brain, ArrowLeft, Plus, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import UserMenu from "@/components/UserMenu";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import AddAssignmentDialog from "@/components/AddAssignmentDialog";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, isLoading: coursesLoading } = useCourses();
  const { assignments, isLoading: assignmentsLoading, createAssignment, isCreating } = useAssignments(courseId || '');

  const course = courses.find(c => c.id === courseId);

  const handleAddAssignment = (assignmentData: {
    title: string;
    description?: string;
    due_date?: string;
  }) => {
    if (courseId) {
      createAssignment({
        ...assignmentData,
        course_id: courseId
      });
    }
  };

  const handleAskAI = () => {
    if (course) {
      navigate('/ai-tutor', { 
        state: { 
          courseId: course.id, 
          courseName: course.name,
          context: `I'm working on ${course.name} (${course.code}). Help me with questions related to this course.`
        } 
      });
    }
  };

  if (coursesLoading || assignmentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading course...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
            <Button onClick={() => navigate('/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
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
              <Button variant="outline" onClick={() => navigate('/courses')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-4 h-4 ${course.color} rounded-full`}></div>
              <h2 className="text-3xl font-bold text-gray-900">{course.name}</h2>
            </div>
            <p className="text-lg text-gray-600 mb-2">{course.code}</p>
            {course.description && (
              <p className="text-gray-600">{course.description}</p>
            )}
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments?.length || 0}</p>
                    <p className="text-xs text-gray-500">Total assignments</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Materials</p>
                    <p className="text-2xl font-bold text-gray-900">{course.materialCount}</p>
                    <p className="text-xs text-gray-500">Course materials</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{course.progress || 0}%</p>
                    <p className="text-xs text-gray-500">Course completion</p>
                  </div>
                  <div className={`w-8 h-8 ${course.color} rounded-full opacity-80`}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <AddAssignmentDialog onAddAssignment={handleAddAssignment} isCreating={isCreating} />
              <Button variant="outline" onClick={handleAskAI}>
                <Brain className="h-4 w-4 mr-2" />
                Ask AI About This Course
              </Button>
            </div>
          </div>

          {/* Assignments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Assignments</span>
                  <AddAssignmentDialog onAddAssignment={handleAddAssignment} isCreating={isCreating} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignments && assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                            {assignment.description && (
                              <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                            )}
                            {assignment.due_date && (
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${assignment.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h4>
                    <p className="text-gray-500 mb-4">Start by adding your first assignment.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Materials */}
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h4>
                  <p className="text-gray-500 mb-4">Upload course materials to get started.</p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
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

export default CoursePage;
