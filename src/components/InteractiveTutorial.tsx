
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTutorial } from '@/contexts/TutorialContext';

const InteractiveTutorial: React.FC = () => {
  const { isTutorialOpen, closeTutorial, tutorialSteps } = useTutorial();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentStep = tutorialSteps[currentStepIndex];

  useEffect(() => {
    if (!isTutorialOpen) {
      setCurrentStepIndex(0);
      setTargetRect(null);
      return;
    }

    if (!currentStep) return;

    const targetElement = currentStep.target ? document.querySelector(currentStep.target) : null;
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetRect(rect);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [currentStepIndex, isTutorialOpen, currentStep]);

  useEffect(() => {
    const handleResize = () => {
        if (!isTutorialOpen || !currentStep) return;
        const targetElement = currentStep.target ? document.querySelector(currentStep.target) : null;
        if (targetElement) {
            setTargetRect(targetElement.getBoundingClientRect());
        }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTutorialOpen, currentStep]);


  if (!isTutorialOpen || !currentStep) return null;

  const isLastStep = currentStepIndex === tutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      if (currentStep.action) currentStep.action(navigate);
      closeTutorial();
    }
  };
  
  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getPopoverPosition = (): React.CSSProperties => {
    if (!targetRect || currentStep.placement === 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    let styles: React.CSSProperties = {};
    const margin = 16;

    switch (currentStep.placement) {
        case 'top':
            styles.top = targetRect.top - margin;
            styles.left = targetRect.left + targetRect.width / 2;
            styles.transform = 'translate(-50%, -100%)';
            break;
        case 'bottom':
            styles.top = targetRect.bottom + margin;
            styles.left = targetRect.left + targetRect.width / 2;
            styles.transform = 'translateX(-50%)';
            break;
        case 'left':
            styles.top = targetRect.top + targetRect.height / 2;
            styles.left = targetRect.left - margin;
            styles.transform = 'translate(-100%, -50%)';
            break;
        case 'right':
            styles.top = targetRect.top + targetRect.height / 2;
            styles.left = targetRect.right + margin;
            styles.transform = 'translateY(-50%)';
            break;
        default:
            styles.top = '50%';
            styles.left = '50%';
            styles.transform = 'translate(-50%, -50%)';
    }
    return styles;
  };

  return (
    <div className="fixed inset-0 z-[100]" aria-modal="true">
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          boxShadow: targetRect ? `0 0 0 9999px rgba(0, 0, 0, 0.6)` : 'none',
          backgroundColor: !targetRect ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
        }}
        onClick={closeTutorial}
      ></div>
       {targetRect && (
        <div
          className="absolute rounded-md transition-all duration-300 ease-in-out pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            border: '2px solid white',
          }}
        ></div>
      )}
      
      <div
        ref={popoverRef}
        className="absolute bg-background rounded-lg p-5 shadow-2xl max-w-sm w-[calc(100%-2rem)] animate-scale-in"
        style={getPopoverPosition()}
        role="dialog"
      >
        <h3 className="text-lg font-semibold mb-2">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{currentStep.content}</p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {currentStepIndex + 1} / {tutorialSteps.length}
          </span>
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <Button variant="ghost" size="sm" onClick={handlePrev}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={closeTutorial}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close tutorial</span>
        </Button>
      </div>
    </div>
  );
};

export default InteractiveTutorial;
