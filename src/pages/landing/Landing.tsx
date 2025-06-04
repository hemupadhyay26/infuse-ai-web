import { useAuth } from "@/context/AuthContext";
import UnAuthenticated from "./UnAuthenticated";
import Authenticated from "./Authenticated";
// import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) {
    // Optional: Replace with a spinner or skeleton if you have one
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-500">Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Authenticated />;
  }

  return <UnAuthenticated />;
}