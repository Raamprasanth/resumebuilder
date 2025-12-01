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

const JobRecommendationInputSchema = z.object({
  jobTitle: z.string().describe('The desired job title, e.g., "Software Engineer".'),
  location: z.string().describe('The desired location, e.g., "New York, NY" or "Remote".'),
});
export type JobRecommendationInput = z.infer<
  typeof JobRecommendationInputSchema
>;

const JobRecommendationSchema = z.object({
    id: z.string().describe('A unique identifier for the job.'),
    title: z.string().describe('The job title.'),
    company: z.string().describe('The name of the company.'),
    location: z.string().describe('The location of the job.'),
    logoUrl: z.string().url().describe('A URL for a fictional but realistic company logo. Use picsum.photos for placeholder images (e.g., https://picsum.photos/seed/cologo1/100/100).'),
    description: z.string().describe('A detailed, realistic job description, formatted with markdown (using headings, lists, etc.).'),
    applyUrl: z.string().url().describe('A fictional URL to apply for the job.'),
});
export type JobRecommendation = z.infer<typeof JobRecommendationSchema>;


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
  prompt: `You are a helpful career assistant. Your task is to generate a list of 4-5 realistic-sounding but fictional job recommendations based on a user's desired job title and location.

  For each job, provide a plausible fictional company name. Each job should have a unique ID (e.g., 'job-1', 'job-2').

  Desired Job Title: {{{jobTitle}}}
  Location: {{{location}}}

  Generate a list of recommendations. For each one, provide:
  - A unique id
  - The job title
  - A fictional company name
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
