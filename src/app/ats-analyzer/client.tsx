'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeResume,
  type AnalyzeResumeOutput,
} from '@/ai/flows/ats-resume-analysis';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Progress } from '@/components/ui/progress';
import { Loader2, Wand2, Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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

export function AtsAnalyzerClient() {
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    setAnalysisResult(null);

    try {
      const file = values.resumeFile[0];
      const resumeDataUri = await fileToDataUri(file);
      const result = await analyzeResume({ resumeDataUri });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Analysis Failed',
        description:
          'There was an error processing your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>ATS Resume Analyzer</CardTitle>
              <CardDescription>
                Upload your resume to get an analysis of its strengths and
                weaknesses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="resumeFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume</FormLabel>
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
                                {
                                  'cursor-not-allowed opacity-50': isLoading,
                                }
                              )}
                            >
                              {!selectedFile ? (
                                <>
                                  <Upload className="mb-2 h-8 w-8" />
                                  <p className="font-semibold">
                                    Click to upload a file
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
                                    ({(selectedFile.size / 1024).toFixed(1)}{' '}
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
                                onClick={() => form.setValue('resumeFile', null, { shouldValidate: true })}
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
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>
            {isLoading
              ? 'Generating your report...'
              : 'Results of your resume analysis will appear here.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Running AI analysis...</p>
            </div>
          )}
          {analysisResult && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">
                  Overall Score: {analysisResult.atsScore}%
                </Label>
                <Progress value={analysisResult.atsScore} className="mt-2" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Feedback & Suggestions
                </h3>
                <div className="whitespace-pre-wrap rounded-md border p-4 bg-secondary/30 text-sm text-muted-foreground">
                  {analysisResult.feedback}
                </div>
              </div>
            </div>
          )}
          {!isLoading && !analysisResult && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px] border-2 border-dashed rounded-lg">
              <p>Your report is waiting.</p>
              <p className="text-sm">Upload your resume to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
