import { JobPopularityIndexClient } from './client';

export const metadata = {
    title: 'Job Popularity Index | JobGenie',
    description: 'See the most popular jobs and their trends on JobGenie.',
};

export default function JobPopularityIndexPage() {
  return <JobPopularityIndexClient />;
}
