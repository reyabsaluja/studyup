
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';
import { useLocation } from 'react-router-dom';
import { dashboardTutorialSteps } from '@/config/tutorialSteps';

const HelpButton = () => {
  const { startTutorial } = useTutorial();
  const location = useLocation();

  const getStepsForPath = () => {
    if (location.pathname === '/dashboard') {
      return dashboardTutorialSteps;
    }
    // Add other pages here in the future
    // if (location.pathname === '/planner') {
    //   return plannerTutorialSteps;
    // }
    return [];
  };

  const handleStartTutorial = () => {
    const steps = getStepsForPath();
    if (steps.length > 0) {
      startTutorial(steps);
    }
  };

  if (getStepsForPath().length === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={handleStartTutorial}
      aria-label="Show tutorial"
    >
      <HelpCircle className="h-6 w-6" />
    </Button>
  );
};

export default HelpButton;
