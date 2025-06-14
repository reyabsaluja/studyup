
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface AddAssignmentDialogProps {
  onAddAssignment: (assignment: {
    title: string;
    description?: string;
    due_date?: string;
  }) => void;
  isCreating: boolean;
}

const AddAssignmentDialog = ({ onAddAssignment, isCreating }: AddAssignmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddAssignment({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      due_date: formData.due_date || undefined
    });

    // Reset form and close dialog
    setFormData({
      title: '',
      description: '',
      due_date: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Physics Lab Report"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the assignment..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !formData.title.trim()}>
              {isCreating ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentDialog;
