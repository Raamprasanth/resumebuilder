import { AtsAnalyzerClient } from './client';

export const metadata = {
    title: 'Resume Review | JobWizard',
    description: 'Get an AI-powered review of your resume with JobWizard.',
};

export default function AtsAnalyzerPage() {
  return <AtsAnalyzerClient />;
}
