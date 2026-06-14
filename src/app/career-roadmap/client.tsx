'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateCareerRoadmap,
  type CareerRoadmapOutput,
} from '@/ai/flows/career-roadmap-generation';

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
import {
  Loader2,
  Map,
  ExternalLink,
  BookOpen,
  Rocket,
  Milestone,
  CalendarDays,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  careerPath: z.string().min(3, 'Career path must be at least 3 characters.'),
  currentSkills: z.string().min(3, 'Please list at least one skill.'),
  timeline: z.string().min(2, 'Timeline must be at least 2 characters.'),
});

export function CareerRoadmapClient() {
  const [roadmap, setRoadmap] = useState<CareerRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerPath: '',
      currentSkills: '',
      timeline: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const result = await generateCareerRoadmap(values);
      setRoadmap(result);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: 'Generation Failed',
        description:
          'There was an error generating your roadmap. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Career Roadmap Generator</CardTitle>
                <CardDescription>
                  Tell us your goals, and we'll map out the journey for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="careerPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Career Path</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Software Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Skills</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Python, SQL, Git"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Timeline</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 6 months, 1 year"
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Map className="mr-2 h-4 w-4" />
                      Generate Roadmap
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle>Your Personalized Roadmap</CardTitle>
            <CardDescription>
              {roadmap?.title ? `${roadmap.title} - ${roadmap.timeline}` : 'Follow these stages to achieve your career goals.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 pt-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Building your path to success...
                </p>
              </div>
            )}
            {roadmap && roadmap.stages.length > 0 && (
              <div className="space-y-8">
                {roadmap.stages.map((stage, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Milestone className="size-4" />
                    </div>
                    {index < roadmap.stages.length - 1 && (
                       <div className="absolute left-3 top-8 h-full w-px bg-border"></div>
                    )}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{stage.title}</h3>
                      <Badge variant="secondary">{stage.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">{stage.description}</p>

                    <div className="space-y-4">
                      {stage.weeklyBreakdown && stage.weeklyBreakdown.length > 0 && (
                        <>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <CalendarDays className="size-4" />
                              Weekly Breakdown
                            </h4>
                            <div className="space-y-3 pl-2 border-l-2 border-primary/20 ml-1">
                              {stage.weeklyBreakdown.map((wb, wbi) => (
                                <div key={wbi} className="pl-4">
                                  <span className="font-medium text-sm text-primary">{wb.week}</span>
                                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1">
                                    {wb.subtopics.map((subtopic, sti) => (
                                      <li key={sti} className="text-sm text-muted-foreground">{subtopic}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="size-4" />
                          Learning Resources
                        </h4>
                        <ul className="space-y-1.5 list-none pl-2">
                          {stage.resources.map((res, i) => (
                            <li key={i} className="text-sm">
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary hover:underline"
                              >
                                <ExternalLink className="size-3 shrink-0" />
                                {res.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                       <Separator />
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Rocket className="size-4" />
                          Practice Project: {stage.project.name}
                        </h4>
                        <p className="text-sm text-muted-foreground pl-2">{stage.project.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && (!roadmap || roadmap.stages.length === 0) && (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed text-center text-muted-foreground">
                <p>Your roadmap awaits.</p>
                <p className="text-sm">
                  Fill out the form to generate your career path.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
