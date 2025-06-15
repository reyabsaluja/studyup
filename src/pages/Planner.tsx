import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, BookOpen, Target, Trash2, Edit, Check } from 'lucide-react';
import { format, isToday, isTomorrow, isSameDay, isPast } from 'date-fns';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import AddStudySessionDialog from '@/components/AddStudySessionDialog';
import AddAssignmentDialog from '@/components/AddAssignmentDialog';
import AddEventPopover from '@/components/AddEventPopover';
import TimeGridCalendar from '@/components/TimeGridCalendar';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useCourses } from '@/hooks/useCourses';
import { useAllAssignments } from '@/hooks/useAssignments';
import EditAssignmentDialog from '@/components/EditAssignmentDialog';

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddStudySessionDialog, setShowAddStudySessionDialog] = useState(false);
  const [showAddAssignmentDialog, setShowAddAssignmentDialog] = useState(false);
  const { studySessions, isLoading, updateStudySession, deleteStudySession } = useStudySessions();
  const { courses } = useCourses();
  const {
    assignments,
    deleteAssignment,
    isDeleting,
    updateAssignment,
    isUpdating,
    toggleAssignmentCompletion,
    isTogglingCompletion,
  } = useAllAssignments();

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter(session => {
      const sessionDate = new Date(session.scheduled_date);
      return isSameDay(sessionDate, date);
    });
  };

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter(assignment => {
      if (!assignment.due_date) return false;
      const dueDate = new Date(assignment.due_date);
      return isSameDay(dueDate, date);
    });
  };

  const formatDateLabel = (date: Date) => {
    const now = new Date();
    if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, h:mm a');
  };

  const handleCompleteSession = (sessionId: string, completed: boolean) => {
    updateStudySession({ id: sessionId, completed });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddStudySession = () => {
    setShowAddStudySessionDialog(true);
  };

  const handleAddAssignment = () => {
    setShowAddAssignmentDialog(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    deleteAssignment(assignmentId);
  };

  const handleCompleteAssignment = (assignment: any) => {
    toggleAssignmentCompletion(assignment);
  };

  const handleUpdateAssignment = (data: { id: string; updates: any }) => {
    updateAssignment(data);
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);
  const selectedDateAssignments = getAssignmentsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Navigation />
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Planner</h1>
            <UserMenu />
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Study Calendar</CardTitle>
                <AddEventPopover
                  selectedDate={selectedDate}
                  onAddStudySession={handleAddStudySession}
                  onAddAssignment={handleAddAssignment}
                />
              </div>
            </CardHeader>
            <CardContent>
              <TimeGridCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateClick}
                assignments={assignments}
                studySessions={studySessions}
                courses={courses}
                onAddStudySession={handleAddStudySession}
                onAddAssignment={handleAddAssignment}
              />
              
              {/* Selected Date Events */}
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">
                  Events for {formatDateLabel(selectedDate)}
                </h3>
                
                {/* Study Sessions */}
                {selectedDateSessions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                      Study Sessions
                    </h4>
                    <div className="space-y-2">
                      {selectedDateSessions.map((session) => {
                        const course = courses.find(c => c.id === session.course_id);
                        return (
                          <div key={session.id} className="p-3 border rounded-lg bg-blue-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{session.title}</p>
                                <p className="text-sm text-gray-600">{course?.name}</p>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {session.duration} minutes
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={session.completed ? "default" : "secondary"}>
                                  {session.completed ? "Completed" : "Scheduled"}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCompleteSession(session.id, !session.completed)}
                                >
                                  {session.completed ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteStudySession(session.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Assignments Due */}
                {selectedDateAssignments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1 text-green-500" />
                      Assignments Due
                    </h4>
                    <div className="space-y-2">
                      {selectedDateAssignments.map((assignment) => {
                        const course = courses.find(c => c.id === assignment.course_id);
                        
                        let badgeText: string;
                        let badgeVariant: 'default' | 'destructive' | 'secondary';
                        const dueDate = new Date(assignment.due_date!);

                        if (assignment.completed) {
                          badgeText = "Completed";
                          badgeVariant = "default";
                        } else if (isPast(dueDate) && !isSameDay(dueDate, new Date())) {
                          badgeText = "Overdue";
                          badgeVariant = "destructive";
                        } else if (isToday(dueDate)) {
                          badgeText = "Due Today";
                          badgeVariant = "destructive";
                        } else {
                          badgeText = "Due";
                          badgeVariant = "secondary";
                        }

                        return (
                          <div key={assignment.id} className="p-3 border rounded-lg bg-green-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 pr-4">
                                <p className="font-medium">{assignment.title}</p>
                                <p className="text-sm text-gray-600">{(assignment as any).courses?.name || course?.name || 'Unknown Course'}</p>
                                {assignment.description && (
                                  <p className="text-sm text-gray-500 mt-1 break-words">{assignment.description}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <Badge variant={badgeVariant}>
                                  {badgeText}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCompleteAssignment(assignment)}
                                  disabled={isTogglingCompletion}
                                  title={assignment.completed ? "Mark as not completed" : "Mark as completed"}
                                >
                                  <Check className={`h-4 w-4 ${assignment.completed ? 'text-green-600' : ''}`} />
                                </Button>
                                <EditAssignmentDialog
                                  assignment={assignment}
                                  onUpdateAssignment={handleUpdateAssignment}
                                  isUpdating={isUpdating}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAssignment(assignment.id)}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedDateSessions.length === 0 && selectedDateAssignments.length === 0 && (
                  <p className="text-gray-500">No events scheduled for this day.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AddStudySessionDialog 
        open={showAddStudySessionDialog} 
        onOpenChange={setShowAddStudySessionDialog}
        selectedDate={selectedDate}
      />
      
      <AddAssignmentDialog 
        open={showAddAssignmentDialog} 
        onOpenChange={setShowAddAssignmentDialog}
        initialDueDate={selectedDate}
      />
    </div>
  );
};

export default Planner;
