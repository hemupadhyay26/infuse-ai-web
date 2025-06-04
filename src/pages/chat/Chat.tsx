import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, ArrowLeft, Menu, MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";
import { askService } from "@/services/askService";
import { chatHistoryService } from "@/services/chatHistoryService";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// --- Types ---
interface UploadedFile {
  id: string;
  name: string;
  status: "ready";
}

interface QAItem {
  messageId: string;
  question: string;
  answer: string;
  timestamp: string;
  sources?: string[];
}

type ChatMessage =
  | {
      id: string;
      role: "user";
      content: string;
      timestamp: string;
    }
  | {
      id: string;
      role: "assistant";
      content: string;
      timestamp: string;
      sources?: string[];
    };

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const queryClient = useQueryClient();

  // Fetch uploaded files
  const {
    data: uploadedFiles = [],
    isLoading: filesLoading,
  } = useQuery<UploadedFile[]>({
    queryKey: ["uploadedFiles"],
    queryFn: async () => {
      const apiFiles = await fileService.listFiles();
      return apiFiles.map((f: any) => ({
        id: f.fileId,
        name: f.fileName,
        status: "ready" as const,
      }));
    },
  });

  // Fetch chat history (Q&A pairs)
  const {
    data: qaHistory = [],
    isLoading: historyLoading,
  } = useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const allChats: QAItem[] = await chatHistoryService.getAll();
      // Sort by timestamp ascending and flatten to user/assistant messages
      const sorted = allChats.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return sorted.flatMap<ChatMessage>((item, idx) => [
        {
          id: (item.messageId || `q-${idx}`) + "-q",
          role: "user",
          content: item.question,
          timestamp: item.timestamp,
        },
        {
          id: (item.messageId || `q-${idx}`) + "-a",
          role: "assistant",
          content: item.answer,
          timestamp: item.timestamp,
          sources: item.sources,
        },
      ]);
    },
  });

  // Mutation for sending a new question
  const askMutation = useMutation({
    mutationFn: async ({ input, fileId }: { input: string; fileId: string }) => {
      return await askService.ask(input, fileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaHistory, askMutation.isPending]);

  // Handle form submit
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const fileId = uploadedFiles[0]?.id;
    if (!input.trim() || !fileId) return;
    askMutation.mutate({ input, fileId });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-2 sm:mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Button>
              </Link>
              <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Infuse AI</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="block lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((v) => !v)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/history">
                  <Button variant="outline">View History</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Upload More</Button>
                </Link>
                {/* <ThemeToggle /> */}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-0 sm:px-4 py-2 sm:py-6 flex flex-col lg:flex-row gap-0 lg:gap-6">
        {/* Sidebar with uploaded files */}
        <ChatSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          files={uploadedFiles}
          filesLoading={filesLoading}
        />

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col dark:bg-gray-800 dark:border-gray-700 h-[60vh] lg:h-[calc(100vh-200px)] pb-0">
            <CardHeader className="border-b dark:border-gray-600 py-3">
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Your Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ChatMessages
                messages={qaHistory}
                loading={historyLoading}
                askPending={askMutation.isPending}
                messagesEndRef={messagesEndRef}
              />
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleFormSubmit}
                askPending={askMutation.isPending}
                hasFiles={uploadedFiles.length > 0}
              />
            </CardContent>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 italic pb-2">
              Infuse AI can make mistakes in some cases.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}