import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  askPending,
  hasFiles,
}: {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  askPending: boolean;
  hasFiles: boolean;
}) {
  return (
    <div className="border-t p-2 sm:p-4">
      <form onSubmit={onSubmit} className="space-y-2 sm:space-y-4">
        <div className="flex gap-2 flex-col sm:flex-row">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!askPending && input.trim()) {
                  onSubmit(e as any);
                }
              }
            }}
            placeholder={
              hasFiles
                ? "Ask a question about your selected document..."
                : "Upload and select a document to start chatting..."
            }
            className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            disabled={askPending || !hasFiles}
          />
          <Button
            type="submit"
            disabled={askPending || !input.trim() || !hasFiles}
            className="w-full sm:w-auto"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
