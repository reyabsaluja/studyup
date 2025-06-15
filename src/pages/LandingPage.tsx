
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Linkedin, Github, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <header className="container mx-auto px-6 py-4 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">StudyUp</span>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Login
          </Button>
          <Button onClick={() => navigate('/auth')} variant="default">
            Try It Out <ArrowRight className="ml-2 h-4 w-4 hidden md:inline" />
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 py-2">
          Unlock Your Academic Potential
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl lg:max-w-2xl mx-auto">
          StudyUp is the all-in-one academic planner and AI tutor designed to help you succeed. Organize your schedule, manage assignments, and get instant help.
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="relative mt-16 md:mt-24 w-full max-w-5xl mx-auto px-4">
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-2xl"></div>
          <img 
            src="/lovable-uploads/8321a47f-6fa8-4086-870a-1b76b48edcb3.png" 
            alt="StudyUp application screenshot" 
            className="relative rounded-lg shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
          />
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-16 md:mt-24 flex justify-between items-center text-muted-foreground text-sm z-10">
        <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">StudyUp</span>
        </div>
        <div className="flex items-center space-x-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
            </a>
        </div>
    </footer>
    </div>
  );
};

export default LandingPage;
