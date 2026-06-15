import { JobPopularityIndexClient } from './client';

export const metadata = {
    title: 'Job Popularity Index | JobWizard',
    description: 'See the most popular jobs and their trends on JobWizard.',
};

export default function JobPopularityIndexPage() {
  return <JobPopularityIndexClient />;
}
