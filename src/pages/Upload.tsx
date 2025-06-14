import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Search
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import UserMenu from '@/components/UserMenu';
import { useCourses } from '@/hooks/useCourses';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';
import { toast } from 'sonner';

const Upload = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const { courses } = useCourses();
  const { materials, uploadMaterial, deleteMaterial, isUploading } = useCourseMaterials(selectedCourse);

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

    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, [selectedCourse]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }

    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        // Simulate upload progress
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 200);

        await uploadMaterial({
          course_id: selectedCourse,
          title: file.name,
          type: file.type,
          file: file
        });

        // Clear progress after successful upload
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);

      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || getFileTypeLabel(material.type).toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const materialTypes = [...new Set(materials.map(m => getFileTypeLabel(m.type)))];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Upload</h1>
            <UserMenu />
          </div>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Materials</CardTitle>
                  <CardDescription>
                    Drag and drop files or click to select files to upload
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="course-select">Select Course</Label>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger>
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

                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
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
                        disabled={!selectedCourse}
                      />
                      <Button asChild disabled={!selectedCourse}>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose Files
                        </label>
                      </Button>
                    </div>

                    {/* Upload Progress */}
                    {Object.entries(uploadProgress).length > 0 && (
                      <div className="space-y-2">
                        {Object.entries(uploadProgress).map(([fileId, progress]) => {
                          const fileName = fileId.split('-')[0];
                          return (
                            <div key={fileId} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{fileName}</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Materials List */}
              {selectedCourse && (
                <Card className="mt-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Course Materials</CardTitle>
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
                              <div className="flex items-center space-x-3">
                                <IconComponent className="h-8 w-8 text-gray-400" />
                                <div>
                                  <p className="font-medium">{material.title}</p>
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
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteMaterial(material)}
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
                          : 'No materials uploaded yet'
                        }
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Files</span>
                      <span className="font-medium">{materials.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">File Types</span>
                      <span className="font-medium">{materialTypes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-medium">
                        {materials.filter(m => {
                          const uploadDate = new Date(m.created_at!);
                          const thisMonth = new Date();
                          return uploadDate.getMonth() === thisMonth.getMonth() && 
                                 uploadDate.getFullYear() === thisMonth.getFullYear();
                        }).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Types Breakdown */}
              {materialTypes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>File Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {materialTypes.map((type) => {
                        const count = materials.filter(m => getFileTypeLabel(m.type) === type).length;
                        const percentage = (count / materials.length) * 100;
                        return (
                          <div key={type}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{type}</span>
                              <span>{count}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Organize files by course for better management</p>
                    <p>• Use descriptive filenames for easy searching</p>
                    <p>• PDF files are great for textbooks and notes</p>
                    <p>• Images work well for diagrams and screenshots</p>
                    <p>• Videos can store recorded lectures</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
