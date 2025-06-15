
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface StudyPlanSession {
  title: string;
  description: string;
  scheduled_date: string;
  duration: number;
}

interface StudyPlan {
  rationale: string;
  sessions: StudyPlanSession[];
}

interface StudyPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: StudyPlan | null;
  onConfirm: () => void;
  isAdding: boolean;
  assignmentTitle: string;
}

const StudyPlanDialog: React.FC<StudyPlanDialogProps> = ({
  open,
  onOpenChange,
  plan,
  onConfirm,
  isAdding,
  assignmentTitle,
}) => {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            Generated Study Plan for "{assignmentTitle}"
          </DialogTitle>
          <DialogDescription>
            Here is a suggested study plan. Review it and add it to your planner if it looks good.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 py-4 min-h-0">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Rationale</h3>
            <ScrollArea className="flex-1">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap pr-4">{plan.rationale}</p>
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-4">
             <h3 className="font-semibold text-lg">Proposed Sessions</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {plan.sessions.map((session, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="font-semibold">{session.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(session.scheduled_date), 'MMM d, yyyy @ h:mm a')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration} mins
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isAdding}>
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add to Planner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudyPlanDialog;
