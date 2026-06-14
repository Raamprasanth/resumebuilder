'use server';

/**
 * @fileOverview A flow for generating realistic job recommendations.
 *
 * - generateJobRecommendations - Generates a list of job recommendations.
 * - JobRecommendationInput - The input type for the function.
 * - JobRecommendationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { JobRecommendationSchema } from '../schemas/resume-generation';

const JobRecommendationInputSchema = z.object({
  jobTitle: z.string().describe('The desired job title, e.g., "Software Engineer".'),
  location: z.string().describe('The desired location, e.g., "New York, NY" or "Remote".'),
  jobType: z.string().optional().describe('The desired job type, e.g., "Full-time", "Part-time", "Contract".'),
  experienceLevel: z.string().optional().describe('The desired experience level, e.g., "Entry-level", "Mid-level", "Senior".'),
  workArrangement: z.string().optional().describe('The desired work arrangement, e.g., "Remote", "On-site", "Hybrid".'),
});
export type JobRecommendationInput = z.infer<
  typeof JobRecommendationInputSchema
>;

const JobRecommendationOutputSchema = z.object({
  recommendations: z.array(JobRecommendationSchema).describe('A list of 4-5 realistic job recommendations.'),
});
export type JobRecommendationOutput = z.infer<
  typeof JobRecommendationOutputSchema
>;

export async function generateJobRecommendations(
  input: JobRecommendationInput
): Promise<JobRecommendationOutput> {
  return generateJobRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobRecommendationPrompt',
  input: { schema: JobRecommendationInputSchema },
  output: { schema: JobRecommendationOutputSchema },
  prompt: `You are a helpful career assistant. Your task is to generate a list of 4-5 realistic-sounding but fictional job recommendations based on a user's desired job title and location, and other filter criteria.

  For each job, provide a plausible fictional company name. Each job should have a unique ID (e.g., 'job-1', 'job-2').

  Desired Job Title: {{{jobTitle}}}
  Location: {{{location}}}
  {{#if jobType}}Job Type: {{{jobType}}}{{/if}}
  {{#if experienceLevel}}Experience Level: {{{experienceLevel}}}{{/if}}
  {{#if workArrangement}}Work Arrangement: {{{workArrangement}}}{{/if}}

  Generate a list of recommendations from platforms like Indeed, Naukri, Apna, Internshala, and JobHai. For each one, provide:
  - A unique id
  - The job title
  - A fictional company name
  - The platform it was found on (e.g., Indeed, Naukri, Apna)
  - The location
  - A placeholder logo URL from picsum.photos (make sure each logo URL has a unique seed).
  - A detailed job description (at least 3 paragraphs, using markdown for formatting).
  - A fictional application URL.
`,
});

const generateJobRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateJobRecommendationsFlow',
    inputSchema: JobRecommendationInputSchema,
    outputSchema: JobRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
