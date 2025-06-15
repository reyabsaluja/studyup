
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, BookOpen, Target, Calendar as CalendarIcon, Trash2, Edit, Check } from 'lucide-react';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, addDays, isSameDay, isPast } from 'date-fns';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import AddStudySessionDialog from '@/components/AddStudySessionDialog';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useCourses } from '@/hooks/useCourses';
import { useAllAssignments } from '@/hooks/useAssignments';

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { studySessions, isLoading, updateStudySession, deleteStudySession } = useStudySessions();
  const { courses } = useCourses();
  const { assignments } = useAllAssignments();

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

  const getUpcomingDeadlines = () => {
    const now = new Date();
    return assignments
      .filter(assignment => {
        if (!assignment.due_date || assignment.completed) return false;
        const dueDate = new Date(assignment.due_date);
        return dueDate > now;
      })
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

  const getDatesWithEvents = () => {
    const datesWithEvents = new Set<string>();
    studySessions.forEach(session => {
      const sessionDate = new Date(session.scheduled_date);
      datesWithEvents.add(sessionDate.toDateString());
    });
    assignments.forEach(assignment => {
      if (assignment.due_date) {
        const dueDate = new Date(assignment.due_date);
        datesWithEvents.add(dueDate.toDateString());
      }
    });
    return datesWithEvents;
  };

  const handleCompleteSession = (sessionId: string, completed: boolean) => {
    updateStudySession({ id: sessionId, completed });
  };
  const handleDateClick = (date: Date) => setSelectedDate(date);

  const selectedDateSessions = getSessionsForDate(selectedDate);
  const selectedDateAssignments = getAssignmentsForDate(selectedDate);
  const upcomingDeadlines = getUpcomingDeadlines();
  const weeklyProgress = getWeeklyProgress();
  const datesWithEvents = getDatesWithEvents();

  // Layout: SidebarProvider wraps horizontal flex, nav left, then main area with main and sidebar
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen font-sans bg-gray-50">
        <Navigation />
        <main className="flex-1 flex">
          {/* Main Vertical (Calendar) */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Planner</h1>
              <UserMenu />
            </header>
            {/* Calendar */}
            <div className="flex-1 flex-grow flex flex-col p-6">
              <div className="flex flex-col h-full">
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                  {/* Calendar left column */}
                  <div className="flex justify-center items-start">
                    <div className="w-full max-w-xl">
                      <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Study Calendar</CardTitle>
                          <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Study Session
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={date => date && handleDateClick(date)}
                            className="rounded-md border w-full pointer-events-auto"
                            components={{
                              Day: ({ date }) => {
                                const hasStudySessions = getSessionsForDate(date).length > 0;
                                const hasAssignments = getAssignmentsForDate(date).length > 0;
                                const isSelected = selectedDate && isSameDay(date, selectedDate);
                                return (
                                  <div className="relative">
                                    <button
                                      className={`relative w-9 h-9 p-0 font-normal aria-selected:opacity-100 ${
                                        isSelected
                                          ? 'bg-primary text-primary-foreground rounded-lg'
                                          : ''
                                      }`}
                                      onClick={() => handleDateClick(date)}
                                    >
                                      {date.getDate()}
                                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                        {hasStudySessions && (
                                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        )}
                                        {hasAssignments && (
                                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                );
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  {/* Events for selected date */}
                  <div className="flex flex-col w-full">
                    <Card className="flex-1 flex flex-col">
                      <CardContent className="flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg mb-4">
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
                                if (assignment.completed) {
                                  badgeText = "Completed";
                                  badgeVariant = "default";
                                } else if (isToday(selectedDate)) {
                                  badgeText = "Due Today";
                                  badgeVariant = "destructive";
                                } else if (isPast(selectedDate) && !isToday(selectedDate)) {
                                  badgeText = "Overdue";
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
                                        <p className="text-sm text-gray-600">{course?.name || 'Unknown Course'}</p>
                                        {assignment.description && (
                                          <p className="text-sm text-gray-500 mt-1 break-words">{assignment.description}</p>
                                        )}
                                      </div>
                                      <Badge variant={badgeVariant} className="flex-shrink-0">
                                        {badgeText}
                                      </Badge>
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
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar using shadcn primitives */}
          <Sidebar className="hidden lg:flex w-[340px] border-l bg-white">
            <SidebarContent className="p-6 space-y-6">
              <SidebarGroup>
                <SidebarGroupLabel>This Week</SidebarGroupLabel>
                <SidebarGroupContent>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Weekly Progress
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
                                className={`text-center p-1 rounded ${hasSessions ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}
                              >
                                {dayCode}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Upcoming Deadlines</SidebarGroupLabel>
                <SidebarGroupContent>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        Deadlines
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
                              <div key={assignment.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                <p className="font-medium text-sm">{assignment.title}</p>
                                <p className="text-xs text-gray-600">{course?.name || 'Unknown Course'}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">{format(dueDate, 'MMM d')}</span>
                                  <Badge 
                                    variant={daysUntilDue <= 3 ? "destructive" : "secondary"}
                                    className="text-xs"
                                  >
                                    {daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue} days`}
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
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Study Stats</SidebarGroupLabel>
                <SidebarGroupContent>
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
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Pending Assignments</span>
                          <span className="font-medium text-orange-600">
                            {assignments.filter(a => !a.completed && a.due_date && new Date(a.due_date) > new Date()).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </main>
        <AddStudySessionDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
          selectedDate={selectedDate}
        />
      </div>
    </SidebarProvider>
  );
};

export default Planner;
