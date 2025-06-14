
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, BookOpen, Target, Calendar as CalendarIcon } from 'lucide-react';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, addDays } from 'date-fns';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import AddStudySessionDialog from '@/components/AddStudySessionDialog';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useCourses } from '@/hooks/useCourses';
import { useAssignments } from '@/hooks/useAssignments';

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { studySessions, isLoading } = useStudySessions();
  const { courses } = useCourses();
  const { assignments } = useAssignments('');

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter(session => {
      const sessionDate = new Date(session.scheduled_date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    return assignments
      .filter(assignment => assignment.due_date && new Date(assignment.due_date) > now && !assignment.completed)
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5);
  };

  const getWeeklyProgress = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const weekSessions = studySessions.filter(session => {
      const sessionDate = new Date(session.scheduled_date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const completedSessions = weekSessions.filter(session => session.completed).length;
    const totalSessions = weekSessions.length;
    
    return { completed: completedSessions, total: totalSessions };
  };

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);
  const upcomingDeadlines = getUpcomingDeadlines();
  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
              <p className="text-gray-600">Plan and track your study sessions</p>
            </div>
            <UserMenu />
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Study Calendar</CardTitle>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Study Session
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">
                        Sessions for {formatDateLabel(selectedDate)}
                      </h3>
                      {selectedDateSessions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedDateSessions.map((session) => {
                            const course = courses.find(c => c.id === session.course_id);
                            return (
                              <div key={session.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-sm text-gray-600">{course?.name}</p>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {session.duration} minutes
                                    </div>
                                  </div>
                                  <Badge variant={session.completed ? "default" : "secondary"}>
                                    {session.completed ? "Completed" : "Scheduled"}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">No study sessions scheduled for this day.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Study Sessions</span>
                        <span>{weeklyProgress.completed}/{weeklyProgress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ 
                            width: weeklyProgress.total > 0 
                              ? `${(weeklyProgress.completed / weeklyProgress.total) * 100}%` 
                              : '0%' 
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = addDays(startOfWeek(new Date()), i);
                        const dayCode = format(date, 'EEE').substring(0, 1);
                        const hasSessions = getSessionsForDate(date).length > 0;
                        return (
                          <div 
                            key={i} 
                            className={`text-center p-1 rounded ${
                              hasSessions ? 'bg-blue-100 text-blue-800' : 'text-gray-400'
                            }`}
                          >
                            {dayCode}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((assignment) => {
                        const course = courses.find(c => c.id === assignment.course_id);
                        const dueDate = new Date(assignment.due_date!);
                        const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div key={assignment.id} className="p-3 border rounded-lg">
                            <p className="font-medium text-sm">{assignment.title}</p>
                            <p className="text-xs text-gray-600">{course?.name}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {format(dueDate, 'MMM d')}
                              </span>
                              <Badge 
                                variant={daysUntilDue <= 3 ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {daysUntilDue} days
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming deadlines</p>
                  )}
                </CardContent>
              </Card>

              {/* Study Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Study Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Sessions</span>
                      <span className="font-medium">{studySessions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-medium text-green-600">
                        {studySessions.filter(s => s.completed).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Courses</span>
                      <span className="font-medium">{courses.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <AddStudySessionDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Planner;
