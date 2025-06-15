
import { NavigateFunction } from 'react-router-dom';

export interface TutorialStep {
  target?: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: (navigate: NavigateFunction) => void;
}

export const dashboardTutorialSteps: TutorialStep[] = [
  {
    placement: 'center',
    title: 'Welcome to StudyUp!',
    content: "Let's take a quick tour to see how you can get the most out of the app.",
  },
  {
    target: '#dashboard-stats-grid',
    title: 'Your At-a-Glance Stats',
    content: 'This area gives you a quick overview of your active courses, upcoming assignments, and progress.',
    placement: 'bottom',
  },
  {
    target: '#dashboard-quick-actions',
    title: 'Quick Actions',
    content: 'Use these buttons to jump directly into common tasks like viewing courses or planning a study session.',
    placement: 'right',
  },
  {
    target: '#dashboard-recent-activity',
    title: 'Recent Activity',
    content: "Keep track of what you've recently accomplished right here.",
    placement: 'left',
  },
   {
    target: '#ai-features-promo',
    title: 'AI-Powered Learning',
    content: 'Explore powerful AI features like the Study Planner and AI Tutor to boost your learning.',
    placement: 'top',
  },
  {
    placement: 'center',
    title: "You're All Set!",
    content: 'You can restart this tour anytime using the help button. We recommend starting by adding a course.',
    action: (navigate) => navigate('/courses'),
  },
];

// We can add more tutorial steps for other pages here in the future.
// For example, for the Planner page to explain calendar interactions.
/*
export const plannerTutorialSteps: TutorialStep[] = [
  {
    target: '#custom-calendar',
    title: 'Your Planner',
    content: 'This is your calendar. Double-click on any day to quickly add an assignment or study session.'
  }
]
*/
