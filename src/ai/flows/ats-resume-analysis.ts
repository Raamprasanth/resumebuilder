'use server';

/**
 * @fileOverview A flow for analyzing a resume against a job description for ATS optimization.
 *
 * - analyzeResume - Analyzes the resume against the job description and provides feedback.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
  jobDescription: z
    .string()
    .describe('The text content of the job description.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  feedback: z
    .string()
    .describe('Feedback on keyword matching and formatting for ATS optimization.'),
  atsScore: z.number().describe('A score representing how well the resume is optimized for ATS.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsResumeAnalysisPrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert in Applicant Tracking Systems (ATS) and resume optimization.
  Analyze the following resume against the job description provided.
  Provide feedback on keyword matching, formatting issues that might hinder ATS parsing,
  and suggestions for improvement to increase the resume's ATS compatibility.
  Also, provide an ATS score from 0 to 100, representing how well the resume is optimized for ATS.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}`,
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
