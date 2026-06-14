'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { JobRecommendation } from '@/ai/schemas/resume-generation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// A simple markdown-to-HTML renderer
const Markdown = ({ content }: { content: string }) => {
    const html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br />')
      // This is a bit of a hack to wrap list items in a <ul>
      .replace(/(<li.*<\/li>)(?!<li)/g, '<ul>$1</ul>')
      .replace(/<\/ul><br \/><ul>/g, '');


  return <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />;
};


export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedJobs = sessionStorage.getItem('jobRecommendations');
      if (storedJobs) {
        const jobs: JobRecommendation[] = JSON.parse(storedJobs);
        const foundJob = jobs.find((j) => j.id === id);
        if (foundJob) {
          setJob(foundJob);
        }
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find the job you were looking for.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" /> Back to Recommendations
      </Button>
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={job.logoUrl}
              alt={`${job.company} logo`}
              fill
              className="rounded-md object-contain"
              data-ai-hint="company logo"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <CardDescription className="text-base">
              <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                <span className="flex items-center gap-1.5"><Briefcase className="size-4" /> {job.company}</span>
                <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {job.location}</span>
                {job.platform && <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{job.platform}</span>}
              </div>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Job Description</h2>
                <Markdown content={job.description} />
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full sm:w-auto">
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="ml-2" />
                </a>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function JobDetailsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto">
             <Skeleton className="h-10 w-48 mb-4" />
            <Card>
                <CardHeader className="flex flex-row items-start gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-6 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </div>
    )
}
