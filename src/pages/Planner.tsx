import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, BookOpen, Target, Trash2, Edit, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow, isSameDay, isPast, addWeeks, subWeeks } from 'date-fns';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import AddStudySessionDialog from '@/components/AddStudySessionDialog';
import AddAssignmentDialog from '@/components/AddAssignmentDialog';
import TimeGridCalendar from '@/components/TimeGridCalendar';
import TimeSlotSelectionPopover from '@/components/TimeSlotSelectionPopover';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useCourses } from '@/hooks/useCourses';
import { useAllAssignments } from '@/hooks/useAssignments';
import EditAssignmentDialog from '@/components/EditAssignmentDialog';

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddStudySessionDialog, setShowAddStudySessionDialog] = useState(false);
  const [showAddAssignmentDialog, setShowAddAssignmentDialog] = useState(false);
  const [showTimeSlotPopover, setShowTimeSlotPopover] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: Date;
    endTime: Date;
  } | null>(null);
  const [popoverAnchorElement, setPopoverAnchorElement] = useState<HTMLElement | null>(null);

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
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const handleCompleteSession = (sessionId: string, completed: boolean) => {
    updateStudySession({ id: sessionId, completed });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (startTime: Date, endTime: Date, element: HTMLElement) => {
    console.log('Time slot selected:', { startTime, endTime });
    setSelectedTimeSlot({ startTime, endTime });
    setPopoverAnchorElement(element);
    setShowTimeSlotPopover(true);
  };

  const handleAddStudySession = () => {
    setShowAddStudySessionDialog(true);
    setShowTimeSlotPopover(false);
  };

  const handleAddAssignment = () => {
    setShowAddAssignmentDialog(true);
    setShowTimeSlotPopover(false);
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

  const handlePreviousWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);
  const selectedDateAssignments = getAssignmentsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Navigation />
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Planner</h1>
            <UserMenu />
          </div>
        </header>

        <div className="p-6 flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>{format(selectedDate, 'MMMM yyyy')}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousWeek}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextWeek}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-0">
              <div className="h-full" data-calendar-grid>
                <TimeGridCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateClick}
                  assignments={assignments}
                  studySessions={studySessions}
                  courses={courses}
                  onAddStudySession={handleAddStudySession}
                  onAddAssignment={handleAddAssignment}
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              </div>
              
              {popoverAnchorElement && (
                <TimeSlotSelectionPopover
                  open={showTimeSlotPopover}
                  onOpenChange={setShowTimeSlotPopover}
                  startTime={selectedTimeSlot?.startTime || new Date()}
                  endTime={selectedTimeSlot?.endTime || new Date()}
                  onCreateStudySession={handleAddStudySession}
                  onCreateAssignment={handleAddAssignment}
                  anchorElement={popoverAnchorElement}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AddStudySessionDialog 
        open={showAddStudySessionDialog} 
        onOpenChange={setShowAddStudySessionDialog}
        selectedDate={selectedTimeSlot?.startTime || selectedDate}
      />
      
      <AddAssignmentDialog 
        open={showAddAssignmentDialog} 
        onOpenChange={setShowAddAssignmentDialog}
        initialDueDate={selectedTimeSlot?.endTime || selectedDate}
      />
    </div>
  );
};

export default Planner;
