
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload, Loader2, Paperclip } from 'lucide-react';

interface AddAssignmentMaterialDialogProps {
  assignmentId: string;
  onAddMaterial: (data: { title: string; type: string; file: File; assignment_id: string }) => void;
  isUploading: boolean;
  children?: React.ReactNode;
}

const AddAssignmentMaterialDialog: React.FC<AddAssignmentMaterialDialogProps> = ({ assignmentId, onAddMaterial, isUploading, children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !assignmentId) return;

    onAddMaterial({
      title: title.trim(),
      type: file.type,
      file: file,
      assignment_id: assignmentId
    });
  };
  
  useEffect(() => {
    if (!isUploading && open) {
      const timer = setTimeout(() => {
        setOpen(false);
        setTitle('');
        setFile(null);
      }, 500); // give a bit of time for toast to show
      return () => clearTimeout(timer);
    }
  }, [isUploading, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
            <Button size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Add Material
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Assignment Material</DialogTitle>
          <DialogDescription>
            Upload a file to add to this assignment's materials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment-file">Select File</Label>
            <Input
              id="assignment-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment-material-title">Title</Label>
            <Input
              id="assignment-material-title"
              type="text"
              placeholder="Enter material title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || !title.trim() || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentMaterialDialog;
