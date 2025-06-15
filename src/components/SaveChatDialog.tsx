
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type Assignment = Database['public']['Tables']['assignments']['Row'];

interface SaveChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignments: Assignment[];
  onSave: (data: { title: string; assignment_id?: string }) => void;
  isSaving: boolean;
}

const SaveChatDialog = ({ open, onOpenChange, assignments, onSave, isSaving }: SaveChatDialogProps) => {
  const [title, setTitle] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    const assignmentIdToSend = (selectedAssignmentId === 'none' || !selectedAssignmentId) ? undefined : selectedAssignmentId;
    onSave({ title: title.trim(), assignment_id: assignmentIdToSend });
    onOpenChange(false);
  };
  
  // Reset form when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        setTitle('');
        setSelectedAssignmentId('');
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Chat Session</DialogTitle>
          <DialogDescription>
            Save this chat session for future reference. You can optionally link it to an assignment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chat-title">Chat Title</Label>
              <Input
                id="chat-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Brainstorming for essay"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignment-link">Link to Assignment (Optional)</Label>
              <Select onValueChange={setSelectedAssignmentId} value={selectedAssignmentId}>
                <SelectTrigger id="assignment-link">
                  <SelectValue placeholder="Select an assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Don't link to any assignment</SelectItem>
                  {assignments.map(assignment => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !title.trim()}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveChatDialog;
