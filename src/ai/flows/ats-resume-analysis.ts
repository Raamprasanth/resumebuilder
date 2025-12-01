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

const FeedbackItemSchema = z.object({
  type: z.enum(['positive', 'negative']),
  message: z.string(),
});

const AnalyzeResumeOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('The overall resume score from 0 to 100.'),
  scoreBreakdown: z.array(ScoreItemSchema).describe('A breakdown of the score into different categories like Tone, Content, Structure, and Skills.'),
  headline: z.string().describe('A short, encouraging headline for the feedback card (e.g., "Great Job!").'),
  feedback: z.array(FeedbackItemSchema).describe('A list of specific feedback points, both positive and negative.'),
  summary: z.string().describe('A concluding sentence to encourage the user to keep refining their resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsResumeAnalysisPrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert resume reviewer and career coach specializing in ATS (Applicant Tracking Systems).
  Analyze the provided resume document and return a detailed scoring and feedback report.

  Your analysis should be structured as a JSON object with the following keys:
  1.  **overallScore**: A single integer from 0 to 100 representing the overall quality and ATS-friendliness of the resume.
  2.  **scoreBreakdown**: An array of objects for specific analysis categories. You must include these four categories: 'Tone & Style', 'Content', 'Structure', and 'Skills'. For each, provide a 'category', a 'score' (0-100), and a 'badge' ("Strong", "Good Start", "Needs Improvement").
  3.  **headline**: A short, encouraging headline for the feedback card (e.g., "Great Job!", "A Solid Foundation").
  4.  **feedback**: An array of 3-5 specific, actionable feedback points. For each point, provide:
      - **type**: 'positive' for things done well, or 'negative' for areas of improvement.
      - **message**: The feedback text itself (e.g., "Good use of relevant keywords for the target position" or "Future internship dates may confuse ATS systems").
  5.  **summary**: A brief, concluding sentence to encourage refinement.

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
