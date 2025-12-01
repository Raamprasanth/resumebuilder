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

const AnalyzeResumeOutputSchema = z.object({
  summary: z.string().describe('A brief, overall summary of the resume analysis.'),
  strengths: z.array(z.string()).describe('A list of key strengths identified in the resume.'),
  areasForImprovement: z.array(z.string()).describe('A list of areas where the resume can be improved.'),
  atsScore: z.number().describe('A score from 0 to 100 representing the overall quality and ATS-friendliness of the resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsResumeAnalysisPrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert in resumes and Applicant Tracking Systems (ATS).
  Analyze the following resume document.

  Your analysis should be structured with the following sections:
  1.  **Summary**: A brief, overall summary of the resume analysis.
  2.  **Strengths**: Identify and list 3-4 key strengths of the resume.
  3.  **Areas for Improvement**: Identify and list 3-4 actionable areas for improvement. Focus on structure, clarity, keyword optimization, and formatting for ATS parsing.
  4.  **ATS Score**: Provide an overall score from 0 to 100, representing how well-structured and optimized the resume is for ATS.

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
