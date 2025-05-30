import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MessageSquare, History, Brain } from "lucide-react";

interface AuthenticatedProps {
  navigate: (path: string) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export default function Authenticated({ navigate, setIsAuthenticated }: AuthenticatedProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-foreground">Infuse AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/chat")}>
                Chat
              </Button>
              <Button variant="ghost" onClick={() => navigate("/history")}>
                History
              </Button>
              {/* <ThemeToggle /> */}
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  setIsAuthenticated(false);
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome to Your AI Assistant
          </h2>
          <p className="text-muted-foreground mb-8">
            Choose an action to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <CardHeader className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Upload and manage your PDF documents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/chat")}
          >
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Start Chatting</CardTitle>
              <CardDescription>
                Ask questions about your uploaded documents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/history")}
          >
            <CardHeader className="text-center">
              <History className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>View History</CardTitle>
              <CardDescription>
                Access your previous conversations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}