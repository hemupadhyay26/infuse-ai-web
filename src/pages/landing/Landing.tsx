import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UnAuthenticated from "./UnAuthenticated";
import Authenticated from "./Authenticated";
// import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  if (!!isAuthenticated) {
    return (
        <Authenticated navigate={navigate} setIsAuthenticated={setIsAuthenticated} />
    );
}

  return (
<UnAuthenticated navigate={navigate} />
  );
}