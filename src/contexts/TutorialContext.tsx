
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface TutorialContextType {
  isTutorialOpen: boolean;
  startTutorial: (steps: any[]) => void;
  closeTutorial: () => void;
  hasSeenTutorial: boolean;
  tutorialSteps: any[];
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
  const [tutorialSteps, setTutorialSteps] = useState<any[]>([]);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTutorial');
    if (seen) {
      setHasSeenTutorial(true);
    } else {
      setHasSeenTutorial(false);
    }
  }, []);

  const startTutorial = useCallback((steps: any[]) => {
    setTutorialSteps(steps);
    setIsTutorialOpen(true);
  }, []);

  const closeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    if (!hasSeenTutorial) {
      localStorage.setItem('hasSeenTutorial', 'true');
      setHasSeenTutorial(true);
    }
  }, [hasSeenTutorial]);

  return (
    <TutorialContext.Provider value={{ isTutorialOpen, startTutorial, closeTutorial, hasSeenTutorial, tutorialSteps }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
