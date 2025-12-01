import { AtsAnalyzerClient } from './client';

export const metadata = {
    title: 'Resume Review | JobGenie',
    description: 'Get an AI-powered review of your resume.',
};

export default function AtsAnalyzerPage() {
  return <AtsAnalyzerClient />;
}
