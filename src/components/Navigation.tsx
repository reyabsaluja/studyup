
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Brain, Upload, MessageSquare, CheckSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: CheckSquare },
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
    <aside className="w-64 bg-background border-r border-border min-h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Taski</h1>
        </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={`w-full justify-start font-medium text-sm ${
                isActive(item.path) 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
