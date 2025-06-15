
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, BookOpen, Target, Trash2, Edit, Check, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import EditAssignmentDialog from '@/components/EditAssignmentDialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import type { Database } from '@/integrations/supabase/types';

type Assignment = Database['public']['Tables']['assignments']['Row'];
// NOTE: StudySession in DB has 'topic', but is likely aliased to 'title' in the hook.
type StudySession = Database['public']['Tables']['study_sessions']['Row'] & { title: string; notes?: string };
type Event = Assignment | StudySession;

type Course = {
  id: string;
  name: string;
  color: string;
};

interface PlannerEventSidebarProps {
  event: Event | null;
  eventType: 'assignment' | 'study' | null;
  courses: Course[];
  onClose: () => void;
  onUpdateAssignment: (data: { id: string; updates: any }) => void;
  onCompleteAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (assignmentId: string) => void;
  onUpdateStudySession: (data: { id: string, completed: boolean }) => void;
  onDeleteStudySession: (sessionId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isTogglingCompletion: boolean;
}

function isAssignment(event: Event): event is Assignment {
  return 'due_date' in event;
}

const PlannerEventSidebar: React.FC<PlannerEventSidebarProps> = ({
  event,
  eventType,
  courses,
  onClose,
  onUpdateAssignment,
  onCompleteAssignment,
  onDeleteAssignment,
  onUpdateStudySession,
  onDeleteStudySession,
  isUpdating,
  isDeleting,
  isTogglingCompletion,
}) => {
    if (!event) {
        return (
          <div className="w-96 border-l border-gray-200 bg-white p-6 flex flex-col justify-center items-center text-center h-full">
            <div className="text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Select an event</h3>
              <p className="text-sm">Click on an assignment or study session in the calendar to see its details here.</p>
            </div>
          </div>
        );
    }
    
    const course = courses.find(c => c.id === event.course_id);

    const renderAssignmentDetails = () => {
      if (!isAssignment(event)) return null;

      return (
        <>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                    {course && (
                        <Badge variant="outline" style={{ borderColor: course.color, color: course.color }}>
                            {course.name}
                        </Badge>
                    )}
                    <CardTitle className="mt-2 text-xl font-bold flex items-center gap-2">
                      {event.title}
                      <EditAssignmentDialog
                        assignment={event}
                        onUpdate={onUpdateAssignment}
                        isUpdating={isUpdating}
                      >
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit className="h-4 w-4" />
                        </Button>
                      </EditAssignmentDialog>
                    </CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>Assignment</span>
                </div>
                {event.due_date && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Due on {format(new Date(event.due_date), 'PPp')}</span>
                    </div>
                )}
                {event.description && (
                    <div>
                        <h4 className="font-semibold text-sm">Description</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                <Button asChild className="w-full">
                    <Link to={`/courses/${event.course_id}/assignments/${event.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Assignment
                    </Link>
                </Button>
                <Button
                    onClick={() => onCompleteAssignment(event)}
                    disabled={isTogglingCompletion}
                    variant={event.completed ? 'secondary' : 'default'}
                    className="w-full"
                >
                    <Check className="mr-2 h-4 w-4" />
                    {isTogglingCompletion ? 'Updating...' : (event.completed ? 'Mark as Incomplete' : 'Mark as Complete')}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                        <span className="text-red-500">Delete Assignment</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the assignment "{event.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteAssignment(event.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </>
    )
    };

    const renderStudySessionDetails = () => {
      if (isAssignment(event)) return null;

      return (
        <>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                    {course && (
                        <Badge variant="outline" style={{ borderColor: course.color, color: course.color }}>
                            {course.name}
                        </Badge>
                    )}
                    <CardTitle className="mt-2 text-xl font-bold">
                      {event.title}
                    </CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Study Session</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{format(new Date(event.scheduled_date), 'PPp')}</span>
                </div>
                {event.notes && (
                    <div>
                        <h4 className="font-semibold text-sm">Notes</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.notes}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                 <Button
                    onClick={() => onUpdateStudySession({ id: event.id, completed: !event.completed })}
                    variant={event.completed ? 'secondary' : 'default'}
                    className="w-full"
                >
                    <Check className="mr-2 h-4 w-4" />
                    {event.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                        <span className="text-red-500">Delete Session</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the study session "{event.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteStudySession(event.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </>
      )
    };
    
    return (
        <Card className="w-96 flex-shrink-0 flex flex-col h-full bg-white shadow-lg">
            {eventType === 'assignment' ? renderAssignmentDetails() : renderStudySessionDetails()}
        </Card>
    );
}

export default PlannerEventSidebar;
