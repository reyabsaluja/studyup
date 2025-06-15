import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthWrapper from "@/components/AuthWrapper";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import Notebook from "./pages/Notebook";
import Planner from "./pages/Planner";
import Upload from "./pages/Upload";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AITutor from "./pages/AITutor";
import LandingPage from "./pages/LandingPage";
import AssignmentPage from "./pages/AssignmentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/courses/:courseId/assignments/:assignmentId" element={<AssignmentPage />} />
            <Route path="/notebook" element={<Notebook />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
