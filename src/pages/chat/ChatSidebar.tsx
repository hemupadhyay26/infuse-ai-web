import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UploadedFile {
  id: string;
  name: string;
  status: "ready";
}

export default function ChatSidebar({
  open,
  setOpen,
  files,
  filesLoading,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  files: UploadedFile[];
  filesLoading: boolean;
}) {
  return (
    <div
      className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform
        lg:static lg:w-80
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${open ? "block" : "hidden"} lg:block
      `}
    >
      <div className="h-full flex flex-col">
        <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Available Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="h-96 flex-1">
              {filesLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
              ) : files.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">No documents uploaded</p>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload Documents
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={file.id}
                      className={`flex items-center p-2 border dark:border-gray-600 rounded dark:bg-gray-700/50 cursor-pointer ${idx === 0
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                        : ""
                        }`}
                    >
                      <FileText className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate dark:text-white">{file.name}</p>
                        <Badge
                          variant={file.status === "ready" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {file.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="block lg:hidden mt-4 flex flex-col gap-2">
              <Link to="/history">
                <Button variant="outline" className="w-full">View History</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full mt-0">Upload More</Button>
              </Link>
              {/* <ThemeToggle /> */}
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
