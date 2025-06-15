
import React from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, Calendar } from 'lucide-react';

interface TimeSlotSelectionPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startTime: Date;
  endTime: Date;
  onCreateStudySession: () => void;
  onCreateAssignment: () => void;
  children: React.ReactNode;
}

const TimeSlotSelectionPopover = ({
  open,
  onOpenChange,
  startTime,
  endTime,
  onCreateStudySession,
  onCreateAssignment,
  children
}: TimeSlotSelectionPopoverProps) => {
  const handleCreateStudySession = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateStudySession();
    onOpenChange(false);
  };

  const handleCreateAssignment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateAssignment();
    onOpenChange(false);
  };

  const formatTimeRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 z-50" 
        align="center"
        onClick={handleContentClick}
        onPointerDownOutside={(e) => {
          // Only close if clicking outside the calendar area
          const target = e.target as Element;
          if (!target.closest('[data-calendar-grid]')) {
            onOpenChange(false);
          } else {
            e.preventDefault();
          }
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Create event for selected time</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatTimeRange(startTime, endTime)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleCreateStudySession}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <BookOpen className="h-4 w-4 text-blue-500" />
              Create Study Session
            </Button>
            
            <Button
              onClick={handleCreateAssignment}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Target className="h-4 w-4 text-green-500" />
              Create Assignment
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimeSlotSelectionPopover;
