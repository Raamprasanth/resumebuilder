import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { JobRecommendations } from '@/components/dashboard/job-recommendations';
import { Scoreboard } from '@/components/dashboard/scoreboard';
import { SocialAccounts } from '@/components/dashboard/social-accounts';
import { Terminal } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Welcome to CareerCompass AI!</AlertTitle>
          <AlertDescription>
            Your AI-powered career co-pilot. Analyze your resume, build a new
            one, get a career roadmap, and find your dream job.
          </AlertDescription>
        </Alert>
        <Scoreboard />
        <SocialAccounts />
      </div>
      <div className="lg:col-span-1">
        <JobRecommendations />
      </div>
    </div>
  );
}
