'use server';

/**
 * @fileOverview A flow for analyzing a resume.
 *
 * - analyzeResume - Analyzes the resume and provides feedback.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported types include PDF and DOCX."
    ),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const ScoreItemSchema = z.object({
  category: z.string().describe("The category being scored (e.g., 'Tone & Style', 'Content')."),
  score: z.number().min(0).max(100).describe('The score for this category, from 0 to 100.'),
  badge: z.string().describe("A qualitative badge for the score (e.g., 'Strong', 'Good Start', 'Needs Improvement')."),
});


const AnalyzeResumeOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('The overall resume score from 0 to 100.'),
  scoreBreakdown: z.array(ScoreItemSchema).describe('A breakdown of the score into different categories like Tone, Content, Structure, and Skills.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsResumeAnalysisPrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert resume reviewer and career coach.
  Analyze the provided resume document and return a detailed scoring report.

  Your analysis should be structured as a JSON object with two main keys:
  1.  **overallScore**: A single integer from 0 to 100 representing the overall quality and ATS-friendliness of the resume.
  2.  **scoreBreakdown**: An array of objects, where each object represents a specific analysis category. You must include the following four categories:
      - 'Tone & Style'
      - 'Content' (Clarity, impact, and use of action verbs)
      - 'Structure' (Formatting, readability, and ATS parsing friendliness)
      - 'Skills' (Relevance and presentation of skills)

  For each item in the scoreBreakdown array, provide:
  - **category**: The name of the category.
  - **score**: An integer score from 0 to 100 for that category.
  - **badge**: A short, qualitative assessment badge (e.g., "Strong", "Good Start", "Needs Improvement").

  Resume:
  {{media url=resumeDataUri}}
`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
