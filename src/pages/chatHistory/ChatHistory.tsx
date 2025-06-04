import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, MessageSquare, Calendar, Clock, User, Bot, Trash2, Menu } from "lucide-react";
import { chatHistoryService } from "@/services/chatHistoryService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API returns a flat array of Q&A objects, not grouped by chat session
interface QAItem {
  messageId: string;
  question: string;
  answer: string;
  timestamp: string;
  sources?: string[];
}

export default function ChatHistory() {
  const queryClient = useQueryClient();

  // Fetch chat history with React Query
  const {
    data: qaHistory = [],
    isLoading: loading,
    isError,
  } = useQuery<QAItem[]>({
    queryKey: ["chatHistory"],
    queryFn: chatHistoryService.getAll,
  });

  // Mutations for deleting messages and all history
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => chatHistoryService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => chatHistoryService.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });

  const [deleting, setDeleting] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteMessage = async (messageId: string) => {
    setDeleting(messageId);
    try {
      await deleteMessageMutation.mutateAsync(messageId);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    setShowConfirm(false);
    setDeleting("all");
    try {
      await deleteAllMutation.mutateAsync();
    } finally {
      setDeleting(null);
    }
  };

  // Group Q&A by date
  function groupByDate(items: QAItem[]) {
    const groups: { [date: string]: QAItem[] } = {};
    items.forEach((item) => {
      const dateObj = new Date(item.timestamp);
      const dateStr = dateObj.toLocaleDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(item);
    });
    // Sort by date descending
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, items]) => ({ date, items }));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Chat History</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Hamburger menu for mobile */}
              <div className="block lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setNavOpen((v) => !v)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              {/* Desktop nav buttons */}
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/chat">
                  <Button>Continue Chat</Button>
                </Link>
                {qaHistory.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(true)}
                    disabled={deleting === "all" || deleteAllMutation.isPending}
                  >
                    {deleting === "all" || deleteAllMutation.isPending ? "Clearing..." : "Clear All"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile nav drawer - open from left */}
        {navOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setNavOpen(false)}>
            <div
              className="absolute top-0 left-0 w-56 bg-white dark:bg-gray-800 shadow-lg h-full flex flex-col p-4 gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to="/chat">
                <Button className="w-full mb-2" onClick={() => setNavOpen(false)}>
                  Continue Chat
                </Button>
              </Link>
              {qaHistory.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={() => {
                    setNavOpen(false);
                    setShowConfirm(true);
                  }}
                  disabled={deleting === "all" || deleteAllMutation.isPending}
                >
                  {deleting === "all" || deleteAllMutation.isPending ? "Clearing..." : "Clear All"}
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setNavOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-1 sm:px-2 py-2 sm:py-4 flex flex-col h-[90vh]">
        <Card className="flex-1 w-full flex flex-col overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <MessageSquare className="h-5 w-5" />
              Your Chat History
              <Badge variant="secondary">{qaHistory.length} Q&A</Badge>
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              View and manage your previous questions and answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to clear all chat history?</DialogTitle>
                </DialogHeader>
                <div className="py-2 text-gray-700 dark:text-gray-300">
                  This action cannot be undone. All your chat history will be permanently deleted.
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAll}
                    disabled={deleting === "all" || deleteAllMutation.isPending}
                  >
                    {deleting === "all" || deleteAllMutation.isPending ? "Clearing..." : "Yes, Clear All"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : isError ? (
              <div className="text-center py-12 text-red-500">Failed to load chat history.</div>
            ) : qaHistory.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No chat history</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start chatting with the AI to see your conversation history here.
                </p>
                <Link to="/chat">
                  <Button>Start Your First Chat</Button>
                </Link>
              </div>
            ) : (
              <ScrollArea className="flex-1 w-full h-full rounded-lg border-none min-h-0">
                <div className="space-y-8 pr-1 sm:pr-2">
                  {groupByDate(qaHistory).map(({ date, items }) => (
                    <div key={date} className="space-y-2">
                      {/* Date Separator */}
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold">
                          <Calendar className="h-3 w-3" />
                          {date}
                        </span>
                      </div>
                      {/* Q&A for this date */}
                      <div className="flex flex-col gap-3">
                        {items.map((item) => (
                          <div
                            key={item.messageId}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 sm:p-3 flex flex-col gap-2 shadow-sm"
                          >
                            {/* User question */}
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 pt-1">
                                <User className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold dark:text-white">You</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3 inline" />
                                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                  </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-xs sm:text-sm overflow-x-auto">
                                  <span className="break-words whitespace-pre-wrap">{item.question}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMessage(item.messageId)}
                                disabled={deleting === item.messageId || deleteMessageMutation.isPending}
                                title="Delete Q&A"
                                className="ml-1 mt-1"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            {/* AI answer */}
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 pt-1">
                                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold dark:text-white">AI</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-xs sm:text-sm overflow-x-auto">
                                  <span className="break-words whitespace-pre-wrap">{item.answer}</span>
                                  {item.sources && item.sources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">Sources: </span>
                                      {item.sources.map((src, i) => (
                                        <Badge key={src + i} variant="secondary" className="m-1 mt-0">{src}</Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}