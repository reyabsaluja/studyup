
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, BookOpen, Target } from 'lucide-react';

interface AddEventPopoverProps {
  selectedDate: Date;
  onAddStudySession: () => void;
  onAddAssignment: () => void;
}

const AddEventPopover: React.FC<AddEventPopoverProps> = ({
  selectedDate,
  onAddStudySession,
  onAddAssignment
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            Add to {formatDate(selectedDate)}
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onAddStudySession}
            >
              <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
              Study Session
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onAddAssignment}
            >
              <Target className="h-4 w-4 mr-2 text-green-500" />
              Assignment
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddEventPopover;
