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
    .describe("The full text content of the user's resume."),
  jobKeywords: z
    .string()
    .describe(
      'Keywords describing the target job, e.g., "Senior React Developer, Next.js, New York".'
    ),
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
  generatedJobDescription: z
    .string()
    .describe('The fictional job description that was generated based on the user keywords and used for the analysis.')
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
  Your task is to perform a two-step process:

  Step 1: Generate a realistic but fictional job description based on the user-provided keywords.
  Step 2: Analyze the user's resume against that generated job description and provide a match report.

  **User's Job Keywords:**
  ---
  {{{jobKeywords}}}
  ---

  **User's Resume Content:**
  ---
  {{{resumeContent}}}
  ---

  **Your Output:**
  Return a JSON object with the following structure:
  - **generatedJobDescription**: The full, fictional job description you created.
  - **matchScore**: A score from 0-100 indicating the strength of the match between the resume and the generated description.
  - **strengths**: Identify 2-3 key skills or experiences from the resume that are highly relevant to the job.
  - **areasForImprovement**: Suggest 2-3 ways the user could better tailor their resume to this specific job.
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
