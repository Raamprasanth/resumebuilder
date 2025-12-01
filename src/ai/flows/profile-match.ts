'use server';

/**
 * @fileOverview A flow for generating a profile match score against a job description.
 *
 * - generateProfileMatch - Generates a profile match score and analysis.
 * - ProfileMatchInput - The input type for the function.
 * - ProfileMatchOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProfileMatchInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The full text content of the user\'s resume.'),
  jobDescription: z
    .string()
    .describe('The full text of the target job description.'),
});
export type ProfileMatchInput = z.infer<typeof ProfileMatchInputSchema>;

const ProfileMatchOutputSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 representing how well the resume matches the job description.'
    ),
  strengths: z
    .array(z.string())
    .describe(
      'A list of 2-3 key strengths from the resume that align with the job description.'
    ),
  areasForImprovement: z
    .array(z.string())
    .describe(
      'A list of 2-3 areas where the resume could be improved or tailored to better match the job.'
    ),
});
export type ProfileMatchOutput = z.infer<typeof ProfileMatchOutputSchema>;

export async function generateProfileMatch(
  input: ProfileMatchInput
): Promise<ProfileMatchOutput> {
  return generateProfileMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileMatchPrompt',
  input: { schema: ProfileMatchInputSchema },
  output: { schema: ProfileMatchOutputSchema },
  prompt: `You are an expert career coach and resume analyst.
  Your task is to analyze a user's resume against a target job description and provide a match report.

  - **Match Score**: Provide a score from 0-100 indicating the strength of the match.
  - **Strengths**: Identify 2-3 key skills or experiences from the resume that are highly relevant to the job.
  - **Areas for Improvement**: Suggest 2-3 ways the user could better tailor their resume to this specific job description.

  Resume Content:
  ---
  {{{resumeContent}}}
  ---

  Job Description:
  ---
  {{{jobDescription}}}
  ---
`,
  config: {
    temperature: 0.3,
  },
});

const generateProfileMatchFlow = ai.defineFlow(
  {
    name: 'generateProfileMatchFlow',
    inputSchema: ProfileMatchInputSchema,
    outputSchema: ProfileMatchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
