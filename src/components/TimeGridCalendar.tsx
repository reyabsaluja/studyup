
import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  startOfHour,
  addHours,
  isSameDay,
  subWeeks,
  addWeeks,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface TimeGridCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  assignments: Assignment[];
  studySessions: StudySession[];
  courses: Course[];
  onAddStudySession?: () => void;
  onAddAssignment?: () => void;
}

const TimeGridCalendar: React.FC<TimeGridCalendarProps> = ({
  selectedDate,
  onDateSelect,
  assignments,
  studySessions,
  courses,
  onAddStudySession,
  onAddAssignment,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday

  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }).map((_, i) => i); // 0-23

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
  };

  return (
    <div className="bg-white rounded-lg border flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="sm" onClick={handleGoToToday}>
            Today
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handlePrevWeek} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNextWeek} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Time column */}
        <div className="w-20 text-xs text-center text-gray-500">
           {/*This is a spacer for the day headers */}
          <div className="h-20 flex-shrink-0"></div>
          {hours.map(hour => (
            <div key={hour} className="h-16 flex items-center justify-center border-r border-t -mt-px">
              { hour > 0 && <span className="relative -top-2">{format(new Date(2000, 0, 1, hour), 'ha')}</span>}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex-1 grid grid-cols-7 min-w-[600px]">
          {/* Day headers */}
          <div className="col-span-7 grid grid-cols-7 sticky top-0 bg-white z-10 border-b">
            {days.map(day => (
              <div key={day.toISOString()} className="text-center p-2 h-20 flex flex-col justify-center items-center border-l">
                <p className="text-sm text-gray-500">{format(day, 'E')}</p>
                <p className={cn(
                  "text-2xl font-medium w-10 h-10 flex items-center justify-center rounded-full",
                  isToday(day) && 'bg-blue-600 text-white',
                  isSameDay(day, selectedDate) && !isToday(day) && 'bg-blue-100 text-blue-600'
                )}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="col-span-7 grid grid-cols-7">
            {days.map(day => (
              <div key={day.toISOString()} className="relative border-l">
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="h-16 border-t cursor-pointer hover:bg-blue-50"
                    onClick={() => onDateSelect(addHours(startOfHour(day), hour))}
                  >
                    {/* Content for each hour cell */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeGridCalendar;
