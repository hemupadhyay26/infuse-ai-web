import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Brain, ArrowLeft, Send, FileText, User, Bot, MessageSquare, Menu } from "lucide-react";
import { fileService } from "@/services/fileService";
import { askService } from "@/services/askService";
import { chatHistoryService } from "@/services/chatHistoryService"; // <-- Add this import



export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch uploaded files from API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const apiFiles = await fileService.listFiles();
        const mappedFiles = apiFiles.map((f: any) => ({
          id: f.fileId,
          name: f.fileName,
          status: "ready",
        }));
        setUploadedFiles(mappedFiles);
      } catch {
        setUploadedFiles([]);
      }
    };
    fetchFiles();
  }, []);

  // Fetch chat history from API when page loads (not dependent on uploadedFiles)
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const allChats = await chatHistoryService.getAll();
        // allChats is an array of Q&A objects as shown in your example
        // Sort by timestamp ascending
        const sorted = allChats.slice().sort((a: any, b: any) => {
          const aTime = new Date(a.timestamp).getTime();
          const bTime = new Date(b.timestamp).getTime();
          return aTime - bTime;
        });
        // Flatten Q&A into user/assistant messages for UI
        const flatMessages = sorted.flatMap((item: any, idx: number) => [
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
        setMessages(flatMessages);
      } catch {
        setMessages([]);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Communicate with backend /api/ask (non-stream)
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Always use first file if available
    const fileId = uploadedFiles[0]?.id;
    if (!input.trim() || !fileId) return;

    setIsLoading(true);
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await askService.ask(input, fileId);
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.answer || "No response from AI.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      // No need to manually save, since backend handles storing chat
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "Sorry, there was an error processing your question.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
              {/* Hamburger menu for mobile */}
              <div className="block lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((v) => !v)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              {/* Desktop nav buttons */}
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
        {/* Sidebar with uploaded files (hidden on mobile, toggled with hamburger) */}
        <div
          className={`
            fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform
            lg:static lg:w-80
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            ${sidebarOpen ? "block" : "hidden"} lg:block
          `}
        >
          {/* Only show sidebar on desktop or if open on mobile */}
          <div className="h-full flex flex-col">
            <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Available Documents</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="h-96 flex-1">
                  {uploadedFiles.length === 0 ? (
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
                      {uploadedFiles.map((file, idx) => (
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
                {/* Mobile nav buttons inside sidebar */}
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
                    onClick={() => setSidebarOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
            {/* Chat Header */}
            <CardHeader className="border-b dark:border-gray-600 py-3">
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Your Chat
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Responsive chat area height and scroll */}
              <ScrollArea className="flex-1 p-2 sm:p-6 overflow-y-auto overflow-x-auto h-[60vh] lg:h-[calc(100vh-290px)] max-h-[calc(100vh-290px)]">
                <div className="space-y-6 pb-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400 mb-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Start a conversation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                        Ask questions about your uploaded documents or upload new PDFs to get started.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge variant="outline">{"What's in this document?"}</Badge>
                        <Badge variant="outline">{"Summarize the main points"}</Badge>
                        <Badge variant="outline">{"Find specific information"}</Badge>
                      </div>
                    </div>

                  ) : (
                    <div className="space-y-6">
                      {/* Render messages as Q&A pairs if possible */}
                      {(() => {
                        // Group messages into Q&A pairs if they follow the user/assistant pattern
                        const pairs: any[] = [];
                        for (let i = 0; i < messages.length;) {
                          const userMsg = messages[i];
                          const aiMsg = messages[i + 1];
                          if (
                            userMsg &&
                            userMsg.role === "user" &&
                            aiMsg &&
                            aiMsg.role === "assistant"
                          ) {
                            pairs.push([userMsg, aiMsg]);
                            i += 2;
                          } else {
                            // fallback: push single message
                            pairs.push([userMsg]);
                            i += 1;
                          }
                        }
                        return pairs.map((pair, idx) => {
                          // Use id if present, otherwise fallback to index for uniqueness
                          const userKey = pair[0]?.id ?? `user-${idx}`;
                          const aiKey = pair[1]?.id ?? `ai-${idx}`;
                          const pairKey = `${userKey}-${aiKey}`;
                          return (
                            <div key={pairKey}>
                              {/* User question */}
                              <div className="flex gap-4 mb-2">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="prose prose-sm max-w-none dark:prose-invert dark:text-gray-200">
                                    {pair[0].content}
                                  </div>
                                </div>
                              </div>
                              {/* AI answer */}
                              {pair[1] && (
                                <div className="flex gap-4 mb-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8  rounded-full flex items-center justify-center">
                                      <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="prose prose-sm max-w-none dark:prose-invert dark:text-gray-200">
                                      {/* Enhanced answer rendering */}
                                      {(() => {
                                        const answer = pair[1].content?.trim() || "";
                                        // If answer starts with a numbered list, render as <ol>
                                        if (/^\d+\./.test(answer) || answer.includes("\n1.")) {
                                          // Split into lines, filter numbered steps
                                          const lines: string[] = answer.split('\n').filter((l: string) => l.trim().match(/^\d+\./));
                                          if (lines.length > 0) {
                                            return (
                                              <ol className="list-decimal ml-5">
                                                {lines.map((line: string, i: number) => (
                                                  <li key={i} className="mb-1">{line.replace(/^\d+\.\s*/, "")}</li>
                                                ))}
                                              </ol>
                                            );
                                          }
                                        }
                                        // If answer is a single line, render bold
                                        if (answer.length < 120 && !answer.includes('\n')) {
                                          return <span className="font-semibold text-lg">{answer}</span>;
                                        }
                                        // Otherwise, render with line breaks for clarity
                                        return answer.split('\n').map((line: string, i: number) =>
                                          <span key={i}>
                                            {line}
                                            <br />
                                          </span>
                                        );
                                      })()}
                                    </div>
                                    {/* Optionally show sources */}
                                    {pair[1].sources && pair[1].sources.length > 0 && (
                                      <div className="mt-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Sources: </span>
                                        {pair[1].sources.map((src: string, i: number) => (
                                          <Badge key={src + i} variant="secondary" className="m-1 mt-0">{src}</Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                      {/* Loading animation for AI response */}
                      {isLoading && (
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              {/* Input Area */}
              <div className="border-t p-2 sm:p-4">
                <form onSubmit={handleFormSubmit} className="space-y-2 sm:space-y-4">
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!isLoading && input.trim()) {
                            handleFormSubmit(e as any);
                          }
                        }
                      }}
                      placeholder={
                        uploadedFiles.length > 0
                          ? "Ask a question about your selected document..."
                          : "Upload and select a document to start chatting..."
                      }
                      className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      disabled={isLoading || uploadedFiles.length === 0}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim() || uploadedFiles.length === 0}
                      className="w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
            {/* Footer message about AI mistakes */}
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 italic pb-2">
              Infuse AI can make mistakes in some cases.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}