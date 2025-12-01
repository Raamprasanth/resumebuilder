import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import Image from 'next/image';

const mockJobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Innovate Inc.',
    logo: 'https://picsum.photos/seed/logo1/40/40',
    location: 'Remote',
    match: 92,
  },
  {
    title: 'Product Manager, AI',
    company: 'DataDriven Co.',
    logo: 'https://picsum.photos/seed/logo2/40/40',
    location: 'New York, NY',
    match: 88,
  },
  {
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    logo: 'https://picsum.photos/seed/logo3/40/40',
    location: 'San Francisco, CA',
    match: 81,
  },
  {
    title: 'Full-Stack Developer',
    company: 'TechNest',
    logo: 'https://picsum.photos/seed/logo4/40/40',
    location: 'Austin, TX',
    match: 76,
  },
];

export function JobRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="size-5" />
          Job Recommendations
        </CardTitle>
        <CardDescription>Jobs that match your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockJobs.map((job, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-2 rounded-lg hover:bg-accent/50"
            >
              <Image
                src={job.logo}
                alt={`${job.company} logo`}
                width={40}
                height={40}
                className="rounded-md"
                data-ai-hint="company logo"
              />
              <div className="flex-1">
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <p className="text-xs text-muted-foreground">{job.location}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{job.match}%</p>
                <p className="text-xs text-muted-foreground">Match</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View More Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
