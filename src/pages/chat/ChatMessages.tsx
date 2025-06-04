import { Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
};

export default function ChatMessages({
  messages,
  loading,
  askPending,
  messagesEndRef,
}: {
  messages: ChatMessage[];
  loading: boolean;
  askPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <ScrollArea className="flex-1 p-2 sm:p-6 overflow-y-auto overflow-x-auto h-[60vh] lg:h-[calc(100vh-290px)] max-h-[calc(100vh-290px)]">
      <div className="space-y-6 pb-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500 dark:text-gray-400">
            Loading chat...
          </div>
        ) : messages.length === 0 ? (
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
                  pairs.push([userMsg]);
                  i += 1;
                }
              }
              return pairs.map((pair, idx) => {
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
                            {(() => {
                              const answer = pair[1].content?.trim() || "";
                              if (/^\d+\./.test(answer) || answer.includes("\n1.")) {
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
                              if (answer.length < 120 && !answer.includes('\n')) {
                                return <span className="font-semibold text-lg">{answer}</span>;
                              }
                              return answer.split('\n').map((line: string, i: number) =>
                                <span key={i}>
                                  {line}
                                  <br />
                                </span>
                              );
                            })()}
                          </div>
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
            {askPending && (
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
  );
}
