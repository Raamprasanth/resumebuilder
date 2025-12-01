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

const CareerRoadmapInputSchema = z.object({
  careerPath: z.string().describe('The desired career path (e.g., Data Scientist, Software Engineer).'),
  currentSkills: z.string().describe('A comma-separated list of the user\u2019s current skills.'),
  timeline: z.string().describe('The desired timeline to achieve the career goal (e.g., 6 months, 1 year).'),
});
export type CareerRoadmapInput = z.infer<typeof CareerRoadmapInputSchema>;

const CareerRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('A detailed career roadmap with stages, learning resources, and practice project ideas.'),
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
  The roadmap should include stage-wise learning resources (links to courses, tutorials, documentation) and practice project ideas.
  Make sure that each stage has a source link for the learning and a practice project idea.

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
    const {output} = await prompt(input);
    return output!;
  }
);
