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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Map, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  careerPath: z.string().min(3, 'Career path must be at least 3 characters.'),
  currentSkills: z.string().min(3, 'Please list at least one skill.'),
  timeline: z.string().min(2, 'Timeline must be at least 2 characters.'),
});

// A simple parser for the AI's output
const parseRoadmap = (roadmapText: string) => {
  const stages = roadmapText.split(/Stage \d+:/).filter((s) => s.trim() !== '');
  return stages.map((stageText, index) => {
    const titleMatch = stageText.match(/(.*?)\n/);
    const title = titleMatch ? titleMatch[1].trim() : `Stage ${index + 1}`;

    const resourcesMatch = stageText.match(
      /Learning Resources:([\s\S]*?)(?=Practice Project Idea:)/s
    );
    const resources = resourcesMatch
      ? resourcesMatch[1]
          .trim()
          .split('\n')
          .filter((r) => r.trim() !== '')
          .map((r) => r.replace(/^- /, ''))
      : [];

    const projectMatch = stageText.match(/Practice Project Idea:([\s\S]*)/s);
    const project = projectMatch
      ? projectMatch[1].trim()
      : 'No project idea provided.';

    return { title, resources, project };
  });
};

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

  const parsedRoadmap = roadmap ? parseRoadmap(roadmap.roadmap) : [];

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
                        <Input placeholder="e.g., Software Engineer" {...field} />
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
                        <Input placeholder="e.g., Python, SQL, Git" {...field} />
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
                        <Input placeholder="e.g., 6 months, 1 year" {...field} />
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
              Follow these stages to achieve your career goals.
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
            {parsedRoadmap.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {parsedRoadmap.map((stage, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">
                      Stage {index + 1}: {stage.title}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pl-2">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Learning Resources
                        </h4>
                        <ul className="space-y-2 list-disc pl-5">
                          {stage.resources.map((res, i) => {
                            const linkMatch = res.match(/\((https?:\/\/[^\s)]+)\)/);
                            const url = linkMatch ? linkMatch[1] : '#';
                            const text = linkMatch
                              ? res.replace(linkMatch[0], '').trim()
                              : res;
                            return (
                              <li key={i} className="text-sm">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  {text}
                                  {url !== '#' && (
                                    <ExternalLink className="size-3 shrink-0" />
                                  )}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">
                          Practice Project Idea
                        </h4>
                        <p className="text-muted-foreground">{stage.project}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {!isLoading && parsedRoadmap.length === 0 && (
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
