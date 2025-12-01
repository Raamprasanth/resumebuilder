'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Target, FileText, FileCheck, ThumbsUp, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  generateProfileMatch,
  type ProfileMatchOutput,
} from '@/ai/flows/profile-match';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '../ui/label';

const formSchema = z.object({
  resumeContent: z
    .string()
    .min(100, { message: 'Resume content must be at least 100 characters.' }),
  jobDescription: z
    .string()
    .min(100, { message: 'Job description must be at least 100 characters.' }),
});

export function ProfileScore() {
  const [matchResult, setMatchResult] = useState<ProfileMatchOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeContent: '',
      jobDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMatchResult(null);
    try {
      const result = await generateProfileMatch(values);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-5" />
          Profile Match Score
        </CardTitle>
        <CardDescription>
          Paste your resume and a job description to see how well you match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="resumeContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileText className="size-4" /> Your Resume</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full content of your resume here..."
                        className="h-48"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileCheck className="size-4" /> Target Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full job description you are interested in..."
                        className="h-48"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
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
            <p className="text-muted-foreground">Comparing your profile to the job...</p>
          </div>
        )}
        {matchResult && (
           <div className="mt-6 space-y-6">
           <div>
             <div className="flex items-center justify-between mb-2">
               <Label className="text-lg font-semibold">
                 Overall Match Score
               </Label>
               <Badge variant={matchResult.matchScore > 80 ? 'default' : 'secondary'}>
                 {matchResult.matchScore} / 100
               </Badge>
             </div>
             <Progress value={matchResult.matchScore} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
               This score estimates how well your profile aligns with the job description.
             </p>
           </div>

           <Separator />

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
