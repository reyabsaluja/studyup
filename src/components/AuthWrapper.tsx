
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useTutorial } from "@/contexts/TutorialContext";
import HelpButton from "./HelpButton";
import InteractiveTutorial from "./InteractiveTutorial";
import { dashboardTutorialSteps } from "@/config/tutorialSteps";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { startTutorial, hasSeenTutorial } = useTutorial();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const publicPaths = ["/auth", "/"];
      if (!user && !publicPaths.includes(location.pathname)) {
        navigate("/auth");
      } else if (user && publicPaths.includes(location.pathname)) {
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate, location.pathname]);

  useEffect(() => {
    if (user && !loading && !hasSeenTutorial && location.pathname === '/dashboard') {
      setTimeout(() => startTutorial(dashboardTutorialSteps), 500);
    }
  }, [user, loading, hasSeenTutorial, location.pathname, startTutorial]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const showHelpButton = user && !["/auth", "/"].includes(location.pathname);

  return (
    <>
      {children}
      {showHelpButton && <HelpButton />}
      <InteractiveTutorial />
    </>
  );
};

export default AuthWrapper;
