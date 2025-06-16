import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Upload as UploadIcon, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Archive,
  Trash2,
  Download,
  Eye,
  Search,
  Book,
  ClipboardList
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import { useCourses } from '@/hooks/useCourses';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';
import { useAssignmentMaterials } from '@/hooks/useAssignmentMaterials';
import { useAllAssignments } from '@/hooks/useAssignments';
import { toast } from 'sonner';

const Upload = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [uploadScope, setUploadScope] = useState<'course' | 'assignment'>('course');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const { courses } = useCourses();
  const { assignments } = useAllAssignments();

  const { 
    materials: courseMaterials, 
    uploadMaterial: uploadCourseMaterial, 
    deleteMaterial: deleteCourseMaterial, 
    isUploading: isUploadingCourseMaterial,
  } = useCourseMaterials(selectedCourse);

  const { 
    materials: assignmentMaterials, 
    uploadMaterial: uploadAssignmentMaterial, 
    deleteMaterial: deleteAssignmentMaterial, 
    isUploading: isUploadingAssignmentMaterial,
  } = useAssignmentMaterials(selectedAssignment);

  const isUploading = isUploadingCourseMaterial || isUploadingAssignmentMaterial;

  const courseAssignments = useMemo(() => {
    return assignments.filter(a => a.course_id === selectedCourse);
  }, [assignments, selectedCourse]);
  
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return File;
  };

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('document')) return 'Document';
    if (type.includes('presentation')) return 'Presentation';
    if (type.includes('spreadsheet')) return 'Spreadsheet';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    return 'File';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isUploadTargetSelected = (uploadScope === 'course' && !!selectedCourse) || (uploadScope === 'assignment' && !!selectedAssignment);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!isUploadTargetSelected) {
      toast.error('Please select a course and upload target first');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, [isUploadTargetSelected, uploadScope, selectedCourse, selectedAssignment]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploadTargetSelected) {
      toast.error('Please select a course and upload target first');
      return;
    }

    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 95) { // Stop at 95 to wait for server confirmation
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 150);

        if (uploadScope === 'course') {
            await uploadCourseMaterial({
              course_id: selectedCourse,
              title: file.name,
              type: file.type,
              file: file
            });
        } else {
            await uploadAssignmentMaterial({
              assignment_id: selectedAssignment,
              title: file.name,
              type: file.type,
              file: file,
            });
        }
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        clearInterval(progressInterval);

        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);

      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            const fileId = Object.keys(newProgress).find(k => k.startsWith(file.name));
            if(fileId) delete newProgress[fileId];
            return newProgress;
        });
      }
    }
  };

  const materialsToShow = uploadScope === 'course' ? courseMaterials : assignmentMaterials;

  const filteredMaterials = materialsToShow.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const materialTypeLabel = getFileTypeLabel(material.type);
    const matchesType = filterType === 'all' || materialTypeLabel.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const materialTypes = [...new Set(materialsToShow.map(m => getFileTypeLabel(m.type)))];

  const handleDelete = (material: any) => {
    if (uploadScope === 'course') {
      deleteCourseMaterial(material);
    } else {
      deleteAssignmentMaterial(material);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedAssignment(''); // Reset assignment when course changes
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Upload Materials</h1>
            <UserMenu />
          </div>
        </header>

        <div className="p-6">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Upload Target</CardTitle>
                <CardDescription>
                  Choose where to upload your files. You can add them to a course or a specific assignment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div>
                    <Label htmlFor="course-select">1. Select a Course</Label>
                    <Select value={selectedCourse} onValueChange={handleCourseChange}>
                      <SelectTrigger id="course-select">
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={!selectedCourse ? 'opacity-50' : ''}>
                    <Label>2. Select Upload Scope</Label>
                    <RadioGroup
                      value={uploadScope}
                      onValueChange={(value) => setUploadScope(value as 'course' | 'assignment')}
                      className="mt-2"
                      disabled={!selectedCourse}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="course" id="r-course" />
                        <Label htmlFor="r-course" className="flex items-center gap-2 font-normal">
                          <Book className="h-4 w-4" /> Course Material
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="assignment" id="r-assignment" />
                        <Label htmlFor="r-assignment" className="flex items-center gap-2 font-normal">
                          <ClipboardList className="h-4 w-4" /> Assignment Material
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {uploadScope === 'assignment' && (
                  <div className={!selectedCourse ? 'opacity-50' : ''}>
                    <Label htmlFor="assignment-select">3. Select an Assignment</Label>
                    <Select value={selectedAssignment} onValueChange={setSelectedAssignment} disabled={!selectedCourse || courseAssignments.length === 0}>
                      <SelectTrigger id="assignment-select">
                        <SelectValue placeholder={courseAssignments.length > 0 ? "Choose an assignment" : "No assignments in this course"} />
                      </SelectTrigger>
                      <SelectContent>
                        {courseAssignments.map((assignment) => (
                          <SelectItem key={assignment.id} value={assignment.id}>
                            {assignment.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  } ${isUploadTargetSelected ? 'hover:border-gray-400' : 'opacity-50 cursor-not-allowed'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Support for PDF, images, videos, documents, and more
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    disabled={!isUploadTargetSelected}
                  />
                  <Button asChild disabled={!isUploadTargetSelected}>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>

                {Object.entries(uploadProgress).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([fileId, progress]) => {
                      const fileName = fileId.split('-')[0];
                      return (
                        <div key={fileId} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="truncate pr-4">{fileName}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {isUploadTargetSelected && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {uploadScope === 'course' ? 'Course Materials' : `Materials for: ${courseAssignments.find(a => a.id === selectedAssignment)?.title || 'Assignment'}`}
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search materials..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {materialTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredMaterials.length > 0 ? (
                    <div className="space-y-3">
                      {filteredMaterials.map((material) => {
                        const IconComponent = getFileIcon(material.type);
                        return (
                          <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <IconComponent className="h-8 w-8 text-gray-400 flex-shrink-0" />
                              <div className="overflow-hidden">
                                <p className="font-medium truncate">{material.title}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Badge variant="secondary" className="text-xs">
                                    {getFileTypeLabel(material.type)}
                                  </Badge>
                                  <span>
                                    {new Date(material.created_at!).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(material)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      {searchQuery || filterType !== 'all' 
                        ? 'No materials match your search criteria' 
                        : 'No materials uploaded for this target yet'
                      }
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
