import { ProfileScore } from '@/components/dashboard/profile-score';
import { JobRecommendations } from '@/components/dashboard/job-recommendations';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <ProfileScore />
      </div>
      <div className="lg:col-span-1">
        <JobRecommendations />
      </div>
    </div>
  );
}
