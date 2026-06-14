
'use server';

/**
 * @fileOverview A smart-scanning flow that analyzes a resume to extract user goals and generate relevant job recommendations and match scores.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { JobRecommendationSchema } from '../schemas/resume-generation';

const SmartScanInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported types include PDF and DOCX."
    ),
});
export type SmartScanInput = z.infer<typeof SmartScanInputSchema>;

const MatchAnalysisSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 representing how well the resume matches this specific job recommendation.'
    ),
  strengths: z
    .array(z.string())
    .describe(
      'A list of 2-3 key strengths from the resume that align with the job.'
    ),
  areasForImprovement: z
    .array(z.string())
    .describe(
      'A list of 2-3 areas where the resume could be tailored to better match the job.'
    ),
});

const RecommendedJobWithAnalysisSchema = JobRecommendationSchema.extend({
  analysis: MatchAnalysisSchema,
});

const SmartScanOutputSchema = z.object({
  extractedJobTitle: z
    .string()
    .describe(
      'The job title extracted from the resume that best represents the user’s career goal (e.g., "Software Engineer").'
    ),
  extractedLocation: z
    .string()
    .describe(
      'The location preference extracted from the resume (e.g., "New York, NY" or "Remote").'
    ),
  recommendations: z
    .array(RecommendedJobWithAnalysisSchema)
    .describe(
      'A list of 4-5 realistic job recommendations, each including a profile match analysis.'
    ),
});

export type SmartScanOutput = z.infer<typeof SmartScanOutputSchema>;

export async function smartScan(
  input: SmartScanInput
): Promise<SmartScanOutput> {
  return smartScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartScanPrompt',
  input: { schema: SmartScanInputSchema },
  output: { schema: SmartScanOutputSchema },
  prompt: `You are an expert career AI assistant. Your primary task is to perform a "smart scan" of a user's resume.

**Step-by-Step Process:**

1.  **Analyze the Resume:** Carefully read the entire resume to understand the user's experience, skills, and most recent job title.
    - **Resume Document:** {{media url=resumeDataUri}}

2.  **Extract Career Goals:** Based on the resume, determine a likely job title and location preference.
    - For the job title, use the most recent or most senior role (e.g., "Senior Product Manager").
    - For location, look for a city or a mention of "Remote". Default to "Remote" if no location is specified.

3.  **Generate Job Recommendations:** Create a list of 4-5 highly relevant, fictional job postings based on the extracted career goals, but say they were found on real platforms like Indeed, Naukri, Apna, Internshala, or JobHai. For each job posting:
    - Invent a plausible company name.
    - Mention the platform it was found on (e.g., Indeed, Naukri, Apna).
    - Use the extracted location.
    - Create a unique placeholder logo URL from picsum.photos (e.g., \`https://picsum.photos/seed/company1/100/100\`).
    - Write a detailed, realistic job description formatted with markdown.
    - Provide a fictional application URL.

4.  **Perform Match Analysis for Each Job:** For each job recommendation you just created, analyze the user's resume against it. Provide a match score, a list of 2-3 strengths, and 2-3 areas for improvement. This analysis should be nested within each recommendation object.

Return a single JSON object that includes the extracted job title, extracted location, and the list of recommendations with their embedded analysis.
`,
});

const smartScanFlow = ai.defineFlow(
  {
    name: 'smartScanFlow',
    inputSchema: SmartScanInputSchema,
    outputSchema: SmartScanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
