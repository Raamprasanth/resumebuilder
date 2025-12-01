
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
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Wand2,
  Loader2,
  Upload,
  FileText,
  X,
  Briefcase,
  Target,
  ThumbsUp,
  Lightbulb,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { smartScan, type SmartScanOutput } from '@/ai/flows/smart-scan';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Separator } from '../ui/separator';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formSchema = z.object({
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

export function SmartDashboard() {
  const [scanResult, setScanResult] = useState<SmartScanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.watch('resumeFile');
  const selectedFile = fileRef?.[0];

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setScanResult(null);
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

  const handleJobClick = (jobId: string) => {
    startTransition(() => {
      router.push(`/jobs/${jobId}`);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 />
            Smart Dashboard
          </CardTitle>
          <CardDescription>
            Upload your resume to automatically generate job recommendations and
            see how you match.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="mx-auto max-w-md">
                <FormItem>
                  <FormControl>
                    <Controller
                      name="resumeFile"
                      control={form.control}
                      render={({ field: { onChange, onBlur, name, ref } }) => (
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
                              { 'cursor-not-allowed opacity-50': isLoading }
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
                                  ({(selectedFile.size / 1024).toFixed(1)} KB)
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
                                form.setValue('resumeFile', null, {
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
                <Button type="submit" disabled={isLoading || !selectedFile}>
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

      {isLoading && (
        <div className="mt-6 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Analyzing resume, finding jobs, and calculating scores...
          </p>
        </div>
      )}

      {scanResult && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target />
                  Your Top Matches
                </CardTitle>
                <CardDescription>
                  Based on your resume, we think you're a great fit for{' '}
                  <span className="font-bold text-primary">
                    {scanResult.extractedJobTitle}
                  </span>{' '}
                  roles in{' '}
                  <span className="font-bold text-primary">
                    {scanResult.extractedLocation}
                  </span>
                  . Here are your scores for the recommended jobs:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {scanResult.recommendations.map((job) => (
                  <div key={job.id}>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold truncate">
                        {job.title} at {job.company}
                      </Label>
                      <Badge
                        variant={
                          job.analysis.matchScore > 80 ? 'default' : 'secondary'
                        }
                      >
                        {job.analysis.matchScore} / 100
                      </Badge>
                    </div>
                    <Progress value={job.analysis.matchScore} className="h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div className="space-y-2">
                         <h3 className="font-semibold flex items-center gap-2 text-green-500">
                           <ThumbsUp className="size-4" /> Strengths
                         </h3>
                         <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
                          {job.analysis.strengths.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                         </ul>
                      </div>
                       <div className="space-y-2">
                         <h3 className="font-semibold flex items-center gap-2 text-amber-500">
                           <Lightbulb className="size-4" /> To Highlight
                         </h3>
                         <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
                          {job.analysis.areasForImprovement.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                         </ul>
                      </div>
                    </div>
                     <Separator className="mt-6" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase />
                  Job Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {(isPending) && (
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
                {!isPending && (
                  <div className="space-y-1">
                    {scanResult.recommendations.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => handleJobClick(job.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent/50">
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
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

    