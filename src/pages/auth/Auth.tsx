import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
// import { ThemeToggle } from "@/components/theme-toggle";
import React from "react";

interface AuthProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function Auth({ title, description, children }: AuthProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        {/* <ThemeToggle /> */}
      </div>
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h1 className="text-2xl font-bold dark:text-white">Infuse AI</h1>
          </div>
          <CardTitle className="dark:text-white">{title}</CardTitle>
          <CardDescription className="dark:text-gray-300">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}