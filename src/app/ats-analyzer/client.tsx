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
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Loader2,
  Wand2,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { Separator } from '@/components/ui/separator';

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

  const getBadgeVariant = (badgeText: string) => {
    switch (badgeText.toLowerCase()) {
      case 'strong':
        return 'default';
      case 'good start':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Resume Review</h1>

      {!analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Get an instant analysis of your resume's strengths and weaknesses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="resumeFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Controller
                          name="resumeFile"
                          control={form.control}
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
                  )}
                />
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
                      Analyze Resume
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Running AI analysis...</p>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-32 w-32 shrink-0">
                  <ChartContainer
                    config={{
                      score: {
                        label: 'Score',
                        color: 'hsl(var(--primary))',
                      },
                    }}
                    className="mx-auto aspect-square h-full w-full"
                  >
                    <RadialBarChart
                      data={[
                        {
                          name: 'Score',
                          value: analysisResult.overallScore,
                          fill: 'hsl(var(--primary))',
                        },
                      ]}
                      startAngle={-270}
                      endAngle={90}
                      innerRadius="70%"
                      outerRadius="100%"
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        tick={false}
                      />
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        background={{ fill: 'hsl(var(--muted))' }}
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-2xl font-bold"
                      >
                        {analysisResult.overallScore}/100
                      </text>
                    </RadialBarChart>
                  </ChartContainer>
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-3xl">Your Resume Score</CardTitle>
                  <CardDescription>
                    This score is calculated based on the variables listed
                    below.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysisResult.scoreBreakdown.map((item, index) => (
                <>
                  <div key={item.category} className="flex items-center justify-between rounded-lg p-4 bg-muted/30 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{item.category}</p>
                      <Badge variant={getBadgeVariant(item.badge)}>{item.badge}</Badge>
                    </div>
                    <p className={cn("font-bold text-lg", getScoreColor(item.score))}>{item.score}/100</p>
                  </div>
                  {index < analysisResult.scoreBreakdown.length - 1 && <Separator />}
                </>
              ))}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={() => setAnalysisResult(null)}
                    variant="outline"
                    className="w-full"
                >
                    Analyze Another Resume
                </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
