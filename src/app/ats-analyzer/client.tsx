'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  resumeText: z.string().min(100, {
    message: 'Resume must be at least 100 characters.',
  }),
});

export function AtsAnalyzerClient() {
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeResume(values);
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
                Paste your resume to get an analysis of its strengths and
                weaknesses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your full resume text here..."
                        className="min-h-[400px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
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
              <p className="text-sm">
                Paste your resume and click "Analyze".
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
