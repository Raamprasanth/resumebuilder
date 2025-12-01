'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateJobRecommendations,
  type JobRecommendation,
} from '@/ai/flows/job-recommendation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Briefcase, Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  jobTitle: z
    .string()
    .min(2, { message: 'Job title must be at least 2 characters.' }),
  location: z
    .string()
    .min(2, { message: 'Location must be at least 2 characters.' }),
});

export function JobRecommendations() {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: 'Software Engineer',
      location: 'Remote',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await generateJobRecommendations(values);
      setRecommendations(result.recommendations);
      // Store in session storage to pass to the job page
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(
          'jobRecommendations',
          JSON.stringify(result.recommendations)
        );
      }
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to get recommendations',
        description: 'There was an error fetching job recommendations.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleJobClick = (jobId: string) => {
    startTransition(() => {
      router.push(`/jobs/${jobId}`);
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="size-5" />
          Job Recommendations
        </CardTitle>
        <CardDescription>
          Find jobs that match your desired role and location.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Product Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Jobs
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 space-y-4">
          {(isLoading || isPending) && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-muted animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse"></div>
                    <div className="h-4 w-1/2 rounded bg-muted animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isLoading && !isPending && recommendations.length > 0 && (
            <div className="space-y-1">
              {recommendations.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleJobClick(job.id)}
                  className="w-full text-left"
                >
                  <div
                    className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent/50"
                  >
                    <div className="relative h-12 w-12 shrink-0">
                      <Image
                        src={job.logoUrl}
                        alt={`${job.company} logo`}
                        fill
                        className="rounded-md object-contain"
                        data-ai-hint="company logo"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {job.location}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {!isLoading && !isPending && recommendations.length === 0 && (
            <Alert className="mt-6">
              <AlertTitle>Find Your Next Role</AlertTitle>
              <AlertDescription>
                Enter a job title and location to discover open positions
                tailored to you.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
