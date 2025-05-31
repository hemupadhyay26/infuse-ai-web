import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Upload, MessageSquare, History, Brain, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Authenticated() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/title - always left */}
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-foreground">Infuse AI</h1>
            </div>
            {/* Mobile hamburger - right side on mobile */}
            <div className="md:hidden ml-auto">
              <Button variant="ghost" size="icon" onClick={() => setNavOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
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
                  logout();
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile nav drawer - left side */}
        {navOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setNavOpen(false)}>
            <div
              className="absolute top-0 left-0 w-56 bg-white dark:bg-gray-800 shadow-lg h-full flex flex-col p-4 gap-2"
              onClick={e => e.stopPropagation()}
            >
              <Button className="w-full mb-2" variant="ghost" onClick={() => { setNavOpen(false); navigate("/dashboard"); }}>
                Dashboard
              </Button>
              <Button className="w-full mb-2" variant="ghost" onClick={() => { setNavOpen(false); navigate("/chat"); }}>
                Chat
              </Button>
              <Button className="w-full mb-2" variant="ghost" onClick={() => { setNavOpen(false); navigate("/history"); }}>
                History
              </Button>
              {/* <ThemeToggle /> */}
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={() => {
                  logout();
                  setNavOpen(false);
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
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

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome to Your AI Assistant
          </h2>
          <p className="text-muted-foreground mb-8">
            Choose an action to get started
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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