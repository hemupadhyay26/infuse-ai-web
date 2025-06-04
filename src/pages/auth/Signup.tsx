import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Auth from "./Auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // shadcn/ui alert

function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signup(name, password, email); // Signup using context
      navigate("/"); // Redirect after signup
    } catch (err: any) {
      console.error("Signup failed", err);
      setError(err?.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Auth title="Create Account" description="Sign up to start using Infuse AI">
      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Signup Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name" className="dark:text-gray-200">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-gray-200">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="dark:text-gray-200">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="dark:text-gray-200">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full bg-foreground hover:bg-foreground/70" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Auth>
  );
}

export default Signup;