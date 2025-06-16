
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  BookOpen, 
  Target, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import EditAssignmentDialog from './EditAssignmentDialog';

interface EventDetailsSidebarProps {
  event: any | null;
  eventType: 'assignment' | 'study' | null;
  courses: any[];
  onClose: () => void;
  onUpdateAssignment?: (data: { id: string; updates: any }) => void;
  onCompleteAssignment?: (assignment: any) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
  onUpdateStudySession?: (data: { id: string; completed: boolean }) => void;
  onDeleteStudySession?: (sessionId: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isTogglingCompletion?: boolean;
}

const EventDetailsSidebar = ({
  event,
  eventType,
  courses,
  onClose,
  onUpdateAssignment,
  onCompleteAssignment,
  onDeleteAssignment,
  onUpdateStudySession,
  onDeleteStudySession,
  isUpdating = false,
  isDeleting = false,
  isTogglingCompletion = false,
}: EventDetailsSidebarProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);

  // Update local state when event prop changes
  useEffect(() => {
    setCurrentEvent(event);
  }, [event]);

  if (!currentEvent || !eventType) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Select an event to view details</p>
        </div>
      </div>
    );
  }

  const course = courses.find(c => c.id === currentEvent.course_id);
  const isAssignment = eventType === 'assignment';
  const isStudySession = eventType === 'study';

  const handleEdit = () => {
    if (isAssignment) {
      setShowEditDialog(true);
    }
  };

  const handleComplete = async () => {
    if (isAssignment && onCompleteAssignment) {
      onCompleteAssignment(currentEvent);
      // Optimistically update the local state
      setCurrentEvent({ ...currentEvent, completed: !currentEvent.completed });
    } else if (isStudySession && onUpdateStudySession) {
      onUpdateStudySession({ id: currentEvent.id, completed: !currentEvent.completed });
      // Optimistically update the local state
      setCurrentEvent({ ...currentEvent, completed: !currentEvent.completed });
    }
  };

  const handleDelete = () => {
    if (isAssignment && onDeleteAssignment) {
      onDeleteAssignment(currentEvent.id);
    } else if (isStudySession && onDeleteStudySession) {
      onDeleteStudySession(currentEvent.id);
    }
  };

  const handleUpdateAssignment = (data: { id: string; updates: any }) => {
    if (onUpdateAssignment) {
      onUpdateAssignment(data);
      // Optimistically update the local state
      setCurrentEvent({ ...currentEvent, ...data.updates });
    }
  };

  const getEventIcon = () => {
    return isAssignment ? <Target className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />;
  };

  const getEventColor = () => {
    return isAssignment ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getEventIcon()}
          <span className="font-medium">
            {isAssignment ? 'Assignment' : 'Study Session'}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {currentEvent.title}
            </h2>
            {currentEvent.description && (
              <p className="text-sm text-gray-600">{currentEvent.description}</p>
            )}
          </div>

          <Separator />

          {/* Course */}
          {course && (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: course.color || '#6366f1' }}
              />
              <span className="text-sm font-medium">{course.name}</span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={currentEvent.completed ? "default" : "secondary"}
              className={currentEvent.completed ? "bg-green-100 text-green-800" : ""}
            >
              {currentEvent.completed ? 'Completed' : 'Pending'}
            </Badge>
          </div>

          {/* Date/Time Information */}
          <div className="space-y-2">
            {isAssignment && currentEvent.due_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(new Date(currentEvent.due_date), 'MMM d, yyyy \'at\' h:mm a')}</span>
              </div>
            )}
            
            {isStudySession && currentEvent.scheduled_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Scheduled: {format(new Date(currentEvent.scheduled_date), 'MMM d, yyyy \'at\' h:mm a')}</span>
              </div>
            )}

            {isStudySession && currentEvent.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Duration: {currentEvent.duration} minutes</span>
              </div>
            )}
          </div>

          {/* Priority (for assignments) */}
          {isAssignment && currentEvent.priority && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              <span>Priority: {currentEvent.priority}</span>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleEdit}
              disabled={isUpdating}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit {isAssignment ? 'Assignment' : 'Session'}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleComplete}
              disabled={isTogglingCompletion}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as {currentEvent.completed ? 'Incomplete' : 'Complete'}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {isAssignment ? 'Assignment' : 'Session'}
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Edit Dialog for Assignments */}
      {isAssignment && (
        <EditAssignmentDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          assignment={currentEvent}
          onUpdate={handleUpdateAssignment}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default EventDetailsSidebar;
