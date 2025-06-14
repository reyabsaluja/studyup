
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Brain, Upload, MessageSquare, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: BookOpen },
    { path: "/courses", label: "Courses", icon: BookOpen },
    { path: "/planner", label: "Planner", icon: Calendar },
    { path: "/notebook", label: "Notebook", icon: BookOpen },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/ai-tutor", label: "AI Tutor", icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 transition-colors">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start transition-colors ${
                isActive(item.path) 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Navigation;
