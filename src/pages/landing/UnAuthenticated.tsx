import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MessageSquare, History, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnAuthenticated() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="absolute top-4 right-4">
        {/* <ThemeToggle /> */}
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Infuse AI</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your PDFs and chat with an AI that understands your documents. Get intelligent answers with source citations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8 bg-foreground hover:bg-foreground/70" onClick={() => navigate("/auth/login")}>
              Sign In
            </Button>
            <Button variant="secondary" size="lg" className="px-8 bg-secondary/50 hover:bg-foreground/10 " onClick={() => navigate("/auth/signup")}>
              Sign Up
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Upload PDFs</CardTitle>
              <CardDescription>
                Easily upload and manage your PDF documents for AI analysis
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Intelligent Chat</CardTitle>
              <CardDescription>
                Ask questions about your documents and get accurate answers with sources
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <History className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Chat History</CardTitle>
              <CardDescription>
                Access your previous conversations and continue where you left off
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-center mb-6 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Upload", "Process", "Ask", "Get Answers"].map((step, i) => (
              <div className="text-center" key={step}>
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">{i + 1}</span>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{step}</h3>
                <p className="text-sm text-muted-foreground">
                  {[
                    "Upload your PDF documents",
                    "AI analyzes and indexes content",
                    "Ask questions about your documents",
                    "Receive answers with source citations",
                  ][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}