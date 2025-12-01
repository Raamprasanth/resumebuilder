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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Wand2,
  Loader2,
  Target,
  FileCheck,
  ThumbsUp,
  Lightbulb,
  Upload,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  generateProfileMatch,
  type ProfileMatchOutput,
} from '@/ai/flows/profile-match';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

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
  jobKeywords: z
    .string()
    .min(10, { message: 'Job keywords must be at least 10 characters.' }),
});

const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For this implementation, we will just use the file name
    // A real implementation would parse the PDF/DOCX content
    resolve(`Resume content from file: ${file.name}`);
  });
};


export function ProfileScore() {
  const [matchResult, setMatchResult] = useState<ProfileMatchOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobKeywords: '',
    },
  });

  const fileRef = form.watch('resumeFile');
  const selectedFile = fileRef?.[0];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMatchResult(null);
    try {
      const resumeContent = await fileToText(values.resumeFile[0]);
      const result = await generateProfileMatch({
        resumeContent: resumeContent,
        jobKeywords: values.jobKeywords
      });
      setMatchResult(result);
    } catch (error) {
      console.error('Error generating profile match:', error);
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

  // A simple markdown-to-HTML renderer
const Markdown = ({ content }: { content: string }) => {
    const html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
       // This is a bit of a hack to wrap list items in a <ul>
      .replace(/(<br \/>)?\n/g, '<br />')
      .replace(/(<li.*<\/li>)(?!<li)/gs, '<ul>$1</ul>')
      .replace(/<\/ul><br \/><ul>/g, '');


  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-5" />
          Profile Match Score
        </CardTitle>
        <CardDescription>
          Upload your resume and provide job keywords to see how well you match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                'flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background p-4 text-center text-muted-foreground transition-colors hover:border-primary/50',
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
              <FormField
                control={form.control}
                name="jobKeywords"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <Sparkles className="size-4" /> Target Job Keywords
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Textarea
                        placeholder="e.g., Senior Product Manager, SaaS, Remote, San Francisco"
                        className="h-full min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !selectedFile}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Match Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        {isLoading && (
          <div className="mt-6 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Generating job and comparing profile...
            </p>
          </div>
        )}
        {matchResult && (
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-lg font-semibold">
                  Overall Match Score
                </Label>
                <Badge
                  variant={matchResult.matchScore > 80 ? 'default' : 'secondary'}
                >
                  {matchResult.matchScore} / 100
                </Badge>
              </div>
              <Progress value={matchResult.matchScore} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                This score estimates how well your profile aligns with the AI-generated job
                description.
              </p>
            </div>

            <Separator />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>View Generated Job Description</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 border rounded-md bg-muted/20">
                     <Markdown content={matchResult.generatedJobDescription} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-green-600">
                  <ThumbsUp className="size-5" /> Your Strengths
                </h3>
                <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                  {matchResult.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-amber-600">
                  <Lightbulb className="size-5" /> Areas to Highlight
                </h3>
                <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                  {matchResult.areasForImprovement.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
