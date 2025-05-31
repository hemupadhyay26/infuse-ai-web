import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, ArrowLeft } from "lucide-react";
// import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "react-router-dom";
import { fileService } from "@/services/fileService";
import { uploadService } from "@/services/uploadService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: "processing" | "ready" | "error";
  progress?: number;
}

export default function Dashboard() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchFiles = async () => {
    try {
      const apiFiles = await fileService.listFiles();
      // Map API response to UploadedFile[]
      const mappedFiles = apiFiles.map((f: any) => ({
        id: f.fileId,
        name: f.fileName,
        size: f.fileSize || 0, // If backend doesn't provide, default to 0
        uploadDate: f.uploadedAt,
        status: "ready" as const,
      }));
      setFiles(mappedFiles);
    } catch (err) {
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setUploading(true);

    for (const file of Array.from(selectedFiles)) {
      // Use a more unique tempId
      const tempId = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setFiles((prev) => [
        ...prev,
        {
          id: tempId,
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          status: "processing",
          progress: 0,
        },
      ]);

      try {
        await uploadService.uploadFile(file);
        // Always refetch file list after upload to avoid NaN and ensure latest data
        await fetchFiles();
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempId
              ? { ...f, status: "error" as const }
              : f
          )
        );
      }
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDeleteClick = (id: string) => {
    setFileToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      await fileService.deleteFile(fileToDelete);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete));
    } catch {
      // Optionally handle error (e.g., show notification)
    }
    setShowDeleteDialog(false);
    setFileToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setFileToDelete(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/chat">
                <Button>Start Chatting</Button>
              </Link>
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Documents</h2>
          <p className="text-gray-600 dark:text-gray-300">Upload PDF files to start chatting with your documents</p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-400"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drop your PDF files here</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">or click to browse and select files</p>
              <Button onClick={() => fileInputRef.current?.click()} className="mb-2" disabled={uploading}>
                {uploading ? "Uploading..." : "Choose Files"}
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supports PDF files up to 10MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Uploaded Documents ({files.length})</CardTitle>
            <CardDescription className="dark:text-gray-300">Manage your uploaded PDF documents</CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No documents uploaded yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload your first PDF to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file, idx) => (
                  <div
                    key={file.id + '-' + idx}
                    className="flex items-center justify-between p-4 border dark:border-gray-600 rounded-lg dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <FileText className="h-8 w-8 text-red-500 dark:text-red-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                        {file.status === "processing" && file.progress !== undefined && (
                          <div className="mt-2">
                            <Progress value={file.progress} className="w-full" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Processing... {file.progress}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          file.status === "ready"
                            ? "default"
                            : file.status === "processing"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {file.status === "ready"
                          ? "Ready"
                          : file.status === "processing"
                            ? "Processing"
                            : "Error"}
                      </Badge>
                      {/* <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(file.id)}>
                        <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this file?</div>
          <DialogFooter>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}