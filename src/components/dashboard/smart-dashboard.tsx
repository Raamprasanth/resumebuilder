'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wand2,
  Loader2,
  Upload,
  FileText,
  X,
  Star,
  Search,
  Briefcase,
  MapPin,
  Filter,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { smartScan, type SmartScanOutput } from '@/ai/flows/smart-scan';
import {
  generateJobRecommendations,
  JobRecommendationOutput,
} from '@/ai/flows/job-recommendation';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const scanSchema = z.object({
  resumeFile: z
    .any()
    .refine((files) => files?.length === 1, 'Resume file is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .doc, and .docx files are accepted.'
    ),
});

const searchSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required.'),
  location: z.string().min(1, 'Location is required.'),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  workArrangement: z.string().optional(),
});

export function SmartDashboard() {
  const [scanResult, setScanResult] = useState<SmartScanOutput | null>(null);
  const [searchResult, setSearchResult] =
    useState<JobRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const scanForm = useForm<z.infer<typeof scanSchema>>({
    resolver: zodResolver(scanSchema),
  });

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      jobTitle: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      workArrangement: '',
    },
  });

  const fileRef = scanForm.watch('resumeFile');
  const selectedFile = fileRef?.[0];

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function onScanSubmit(values: z.infer<typeof scanSchema>) {
    setIsLoading(true);
    setScanResult(null);
    setSearchResult(null);
    try {
      const file = values.resumeFile[0];
      const resumeDataUri = await fileToDataUri(file);
      const result = await smartScan({ resumeDataUri });
      setScanResult(result);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(
          'jobRecommendations',
          JSON.stringify(result.recommendations)
        );
      }
    } catch (error) {
      console.error('Error during smart scan:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'There was an error analyzing your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSearchSubmit(values: z.infer<typeof searchSchema>) {
    setIsSearching(true);
    setScanResult(null);
    setSearchResult(null);
    try {
      const result = await generateJobRecommendations(values);
      setSearchResult(result);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(
          'jobRecommendations',
          JSON.stringify(result.recommendations)
        );
      }
    } catch (error) {
      console.error('Error during job search:', error);
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'There was an error finding jobs. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  }

  const handleJobClick = (jobId: string) => {
    startTransition(() => {
      router.push(`/jobs/${jobId}`);
    });
  };

  const recommendations =
    scanResult?.recommendations || searchResult?.recommendations || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search />
            Job Search
          </CardTitle>
          <CardDescription>
            Enter a job title and location to find opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...searchForm}>
            <form
              onSubmit={searchForm.handleSubmit(onSearchSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <FormField
                  control={searchForm.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <Label>Job Title</Label>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="e.g., Software Engineer"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={searchForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <Label>Location</Label>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="e.g., New York, NY"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="w-full"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Find Jobs
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="filters">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 font-semibold">
                      <Filter className="h-4 w-4" />
                      More Filters
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
                      <FormField
                        control={searchForm.control}
                        name="jobType"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Job Type</Label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Job Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full-time">
                                  Full-time
                                </SelectItem>
                                <SelectItem value="part-time">
                                  Part-time
                                </SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">
                                  Internship
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={searchForm.control}
                        name="experienceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Experience Level</Label>
                             <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Experience Level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="entry-level">
                                  Entry-level
                                </SelectItem>
                                <SelectItem value="mid-level">
                                  Mid-level
                                </SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                                 <SelectItem value="lead">Lead</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={searchForm.control}
                        name="workArrangement"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Work Arrangement</Label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Arrangement" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="on-site">On-site</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="smart-scan">
          <AccordionTrigger>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Wand2 />
              AI Smart Scan
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-none shadow-none">
              <CardDescription className="px-6 pb-4">
                Upload your resume to automatically get personalized job
                recommendations and see how you match.
              </CardDescription>
              <CardContent>
                <Form {...scanForm}>
                  <form
                    onSubmit={scanForm.handleSubmit(onScanSubmit)}
                    className="space-y-4"
                  >
                    <div className="mx-auto max-w-md">
                      <FormItem>
                        <FormControl>
                          <Controller
                            name="resumeFile"
                            control={scanForm.control}
                            render={({
                              field: { onChange, onBlur, name, ref },
                            }) => (
                              <div className="relative">
                                <Input
                                  id="resumeFile"
                                  type="file"
                                  className="sr-only"
                                  accept={ACCEPTED_FILE_TYPES.join(',')}
                                  onChange={(e) => onChange(e.target.files)}
                                  onBlur={onBlur}
                                  name={name}
                                  ref={ref}
                                  disabled={isLoading}
                                />
                                <Label
                                  htmlFor="resumeFile"
                                  className={cn(
                                    'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background p-4 text-center text-muted-foreground transition-colors hover:border-primary/50',
                                    {
                                      'cursor-not-allowed opacity-50':
                                        isLoading,
                                    }
                                  )}
                                >
                                  {!selectedFile ? (
                                    <>
                                      <Upload className="mb-2 h-8 w-8" />
                                      <p className="font-semibold">
                                        Click to upload your resume
                                      </p>
                                      <p className="text-xs">
                                        PDF, DOC, or DOCX (max 5MB)
                                      </p>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center text-foreground">
                                      <FileText className="mb-2 h-10 w-10 text-primary" />
                                      <p className="font-semibold">
                                        {selectedFile.name}
                                      </p>
                                      <p className="text-xs">
                                        (
                                        {(selectedFile.size / 1024).toFixed(1)}{' '}
                                        KB)
                                      </p>
                                    </div>
                                  )}
                                </Label>
                                {selectedFile && !isLoading && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 h-6 w-6 rounded-full"
                                    onClick={() =>
                                      scanForm.setValue('resumeFile', null, {
                                        shouldValidate: true,
                                      })
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        disabled={isLoading || !selectedFile}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scanning Resume...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Smart Scan
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {(isLoading || isSearching) && (
        <div className="mt-6 flex min-h-[200px] flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isLoading
              ? 'Analyzing resume and finding jobs...'
              : 'Searching for jobs...'}
          </p>
        </div>
      )}

      {(scanResult || searchResult) && (
        <div className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Job Recommendations
            </h2>
            {scanResult ? (
              <p className="text-muted-foreground">
                Based on your resume for a{' '}
                <span className="font-semibold text-primary">
                  {scanResult.extractedJobTitle}
                </span>{' '}
                role in{' '}
                <span className="font-semibold text-primary">
                  {scanResult.extractedLocation}
                </span>
                .
              </p>
            ) : (
              <p className="text-muted-foreground">
                Showing results for{' '}
                <span className="font-semibold text-primary">
                  {searchForm.getValues('jobTitle')}
                </span>{' '}
                in{' '}
                <span className="font-semibold text-primary">
                  {searchForm.getValues('location')}
                </span>
                .
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendations.map((job) => (
              <Card key={job.id} className="flex flex-col text-center">
                <CardContent className="flex flex-grow flex-col items-center justify-center p-6">
                  <div className="relative mb-4 h-16 w-32">
                    <Image
                      src={job.logoUrl}
                      alt={`${job.company} logo`}
                      fill
                      className="object-contain"
                      data-ai-hint="company logo"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{job.company}</h3>
                  {'platform' in job && job.platform && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {job.platform as string}
                    </span>
                  )}
                  {'analysis' in job && (job as any).analysis?.matchScore && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{((job as any).analysis.matchScore / 20).toFixed(1)}</span>
                      <span>
                        {((job as any).analysis.matchScore * 12.3).toFixed(0)}k reviews
                      </span>
                    </div>
                  )}
                  <p className="mt-3 flex-grow text-sm text-muted-foreground">
                    {job.title}
                  </p>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleJobClick(job.id)}
                    disabled={isPending}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
