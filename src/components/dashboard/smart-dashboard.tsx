
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
  CardFooter
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
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { smartScan, type SmartScanOutput } from '@/ai/flows/smart-scan';
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
        <div className="mt-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Top Company Recommendations</h2>
                <p className="text-muted-foreground">
                  Based on your resume for a <span className="font-semibold text-primary">{scanResult.extractedJobTitle}</span> role in <span className="font-semibold text-primary">{scanResult.extractedLocation}</span>.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {scanResult.recommendations.map((job) => (
                <Card key={job.id} className="flex flex-col text-center">
                    <CardContent className="flex-grow flex flex-col items-center justify-center p-6">
                         <div className="relative h-16 w-32 mb-4">
                            <Image
                                src={job.logoUrl}
                                alt={`${job.company} logo`}
                                fill
                                className="object-contain"
                                data-ai-hint="company logo"
                            />
                        </div>
                        <h3 className="font-semibold text-lg">{job.company}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>{(job.analysis.matchScore / 20).toFixed(1)}</span>
                             <span>({(job.analysis.matchScore * 12.3).toFixed(0)}k reviews)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 flex-grow">{job.description.split(' ').slice(0, 15).join(' ')}...</p>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
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
