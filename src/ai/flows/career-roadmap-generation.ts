'use server';

/**
 * @fileOverview Generates a personalized career roadmap based on user input.
 *
 * - generateCareerRoadmap - A function that generates the career roadmap.
 * - CareerRoadmapInput - The input type for the generateCareerRoadmap function.
 * - CareerRoadmapOutput - The return type for the generateCareerRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { runWithFallback } from '@/ai/fallback-runner';

const CareerRoadmapInputSchema = z.object({
  careerPath: z.string().describe('The desired career path (e.g., Data Scientist, Software Engineer).'),
  currentSkills: z.string().describe('A comma-separated list of the user’s current skills.'),
  timeline: z.string().describe('The desired timeline to achieve the career goal (e.g., 6 months, 1 year).'),
});
export type CareerRoadmapInput = z.infer<typeof CareerRoadmapInputSchema>;

const WeeklyBreakdownSchema = z.object({
  week: z.string().describe('The week identifier (e.g., "Week 1", "Week 2").'),
  subtopics: z.array(z.string()).describe('A list of subtopics or tasks to cover this week.'),
});

const StageSchema = z.object({
  title: z.string().describe('A concise title for this stage of the roadmap (e.g., "Foundational Python").'),
  duration: z.string().describe('The estimated time to complete this stage (e.g., "Month 1", "Weeks 1-2").'),
  description: z.string().describe('A brief (1-2 sentences) description of what this stage covers.'),
  weeklyBreakdown: z.array(WeeklyBreakdownSchema).describe('A weekly breakdown of subtopics for this stage.'),
  resources: z.array(
      z.object({
        name: z.string().describe('The display name of the learning resource.'),
        url: z.string().url().describe('The URL for the learning resource.'),
      })
    ).describe('A list of 2-3 key learning resources (courses, tutorials) for this stage.'),
  project: z.object({
    name: z.string().describe('A descriptive name for the practice project.'),
    description: z.string().describe('A short description of the practice project.'),
  }).describe('A practical project idea to apply the skills learned in this stage.'),
});

const CareerRoadmapOutputSchema = z.object({
  title: z.string().describe('An overall title for the roadmap (e.g., "Software Developer Career Roadmap").'),
  timeline: z.string().describe('The total duration of the roadmap (e.g., "6 Months").'),
  stages: z.array(StageSchema).describe('An array of the different stages in the career roadmap.'),
});
export type CareerRoadmapOutput = z.infer<typeof CareerRoadmapOutputSchema>;

export async function generateCareerRoadmap(input: CareerRoadmapInput): Promise<CareerRoadmapOutput> {
  return careerRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerRoadmapPrompt',
  input: {schema: CareerRoadmapInputSchema},
  output: {schema: CareerRoadmapOutputSchema},
  prompt: `You are a career coach that provides actionable and helpful career roadmaps.

  Based on the user's desired career path, current skills, and timeline, generate a personalized career roadmap.
  The roadmap should be broken down into logical stages. For each stage, you must provide:
  1. A clear title and estimated duration.
  2. A brief description of the stage's goals.
  3. A weekly breakdown containing subtopics to read or learn for each week of the stage.
  4. A list of 2-3 high-quality, real online learning resources (with valid URLs).
  5. A concrete and practical project idea with a name and description.

  Desired Career Path: {{{careerPath}}}
  Current Skills: {{{currentSkills}}}
  Timeline: {{{timeline}}}
  `,
});

const careerRoadmapFlow = ai.defineFlow(
  {
    name: 'careerRoadmapFlow',
    inputSchema: CareerRoadmapInputSchema,
    outputSchema: CareerRoadmapOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.warn('Gemini prompt failed, falling back...', error);
      const rendered = await prompt.render(input);
      const textPrompt = rendered.messages.flatMap(m => m.content.map(c => c.text)).join('\n');
      return runWithFallback<CareerRoadmapOutput>(
        'You are a career coach that provides actionable and helpful career roadmaps. You must return a JSON object.',
        textPrompt
      );
    }
  }
);
