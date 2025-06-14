
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
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-6 transition-colors">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start transition-colors ${
                isActive(item.path) 
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
