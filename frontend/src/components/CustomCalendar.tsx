
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AddEventPopover from '@/components/AddEventPopover';

interface Assignment {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  course_id: string;
}

interface StudySession {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration: number;
  completed: boolean;
  course_id: string;
}

interface Course {
  id: string;
  name: string;
  color?: string;
}

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  assignments: Assignment[];
  studySessions: StudySession[];
  courses: Course[];
  onAddStudySession?: () => void;
  onAddAssignment?: () => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
  assignments,
  studySessions,
  courses,
  onAddStudySession,
  onAddAssignment
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showPopover, setShowPopover] = useState(false);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDate = (date: Date) => {
    const dayAssignments = assignments.filter(assignment => {
      if (!assignment.due_date) return false;
      const dueDate = new Date(assignment.due_date);
      return isSameDay(dueDate, date);
    });

    const daySessions = studySessions.filter(session => {
      const sessionDate = new Date(session.scheduled_date);
      return isSameDay(sessionDate, date);
    });

    return { assignments: dayAssignments, sessions: daySessions };
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  const handleDayClick = (date: Date) => {
    onDateSelect(date);
  };

  const handleDayDoubleClick = (date: Date) => {
    setPopoverDate(date);
    onDateSelect(date);
    setShowPopover(true);
  };

  const handleAddStudySession = () => {
    setShowPopover(false);
    if (onAddStudySession) {
      onAddStudySession();
    }
  };

  const handleAddAssignment = () => {
    setShowPopover(false);
    if (onAddAssignment) {
      onAddAssignment();
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-sm"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, dayIdx) => {
            const events = getEventsForDate(day);
            const hasEvents = events.assignments.length > 0 || events.sessions.length > 0;
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={dayIdx}
                className={`
                  min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-all hover:bg-gray-50
                  ${isSelected ? 'bg-blue-50 border-blue-200' : ''}
                  ${!isCurrentMonth ? 'text-gray-300 bg-gray-50/50' : ''}
                `}
                onClick={() => handleDayClick(day)}
                onDoubleClick={() => handleDayDoubleClick(day)}
                title="Double-click to add event"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-sm font-medium flex items-center justify-center w-6 h-6 rounded-full
                        ${isCurrentDay ? 'bg-blue-600 text-white' : ''}
                        ${isSelected && !isCurrentDay ? 'bg-blue-100 text-blue-600' : ''}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Event indicators */}
                  <div className="flex-1 space-y-1">
                    {events.sessions.slice(0, 2).map((session) => (
                      <div
                        key={session.id}
                        className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate"
                        title={session.title}
                      >
                        <BookOpen className="h-2 w-2 inline mr-1" />
                        {session.title}
                      </div>
                    ))}
                    {events.assignments.slice(0, 2).map((assignment) => (
                      <div
                        key={assignment.id}
                        className={`text-xs p-1 rounded truncate ${
                          assignment.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                        title={assignment.title}
                      >
                        <Target className="h-2 w-2 inline mr-1" />
                        {assignment.title}
                      </div>
                    ))}
                    {(events.sessions.length + events.assignments.length) > 4 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{(events.sessions.length + events.assignments.length) - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover for adding events on double-click */}
      {showPopover && popoverDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 shadow-lg border max-w-sm w-full mx-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Add to {popoverDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleAddStudySession}
                >
                  <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                  Study Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleAddAssignment}
                >
                  <Target className="h-4 w-4 mr-2 text-green-500" />
                  Assignment
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowPopover(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
