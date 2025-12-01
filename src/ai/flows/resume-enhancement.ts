'use server';

/**
 * @fileOverview A flow for enhancing resume content using AI.
 *
 * - enhanceResume - Rewrites and improves resume content based on user input and instructions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  ExperienceSchema,
  EducationSchema,
} from '@/ai/schemas/resume-generation';

const EnhanceResumeInputSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  summary: z.string(),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.string(),
  enhancementInstructions: z
    .string()
    .describe(
      'User-provided instructions, such as a job description or a request to make the tone more professional.'
    ),
});
export type EnhanceResumeInput = z.infer<typeof EnhanceResumeInputSchema>;

const EnhancedExperienceSchema = ExperienceSchema.extend({
  jobDescription: z.string().describe("The rewritten, enhanced job description, using professional language and action verbs. Should be a single string with bullet points prefixed by '• '.")
});

const EnhanceResumeOutputSchema = z.object({
  summary: z
    .string()
    .describe('The rewritten, enhanced professional summary.'),
  experiences: z
    .array(EnhancedExperienceSchema)
    .describe('The list of experiences with enhanced descriptions.'),
});
export type EnhanceResumeOutput = z.infer<typeof EnhanceResumeOutputSchema>;

export async function enhanceResume(
  input: EnhanceResumeInput
): Promise<EnhanceResumeOutput> {
  return enhanceResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceResumePrompt',
  input: { schema: EnhanceResumeInputSchema },
  output: { schema: EnhanceResumeOutputSchema },
  prompt: `You are an expert resume writer and career coach. Your task is to enhance the user's resume content to make it more professional, impactful, and tailored to their goals.

**User's Enhancement Instructions:**
---
{{{enhancementInstructions}}}
---

**User's Current Resume Data:**
- Name: {{{fullName}}}
- Summary: {{{summary}}}
- Experience:
{{#each experiences}}
  - Job Title: {{this.jobTitle}}
    Company: {{this.company}}
    Description: {{this.jobDescription}}
{{/each}}
- Skills: {{{skills}}}

**Your Task:**
1.  **Rewrite the Professional Summary:** Make it concise, powerful, and aligned with the user's instructions.
2.  **Enhance Job Descriptions:** For each experience, rewrite the description. Focus on:
    - Using strong action verbs.
    - Quantifying achievements with metrics where possible (if not available, focus on the impact).
    - Ensuring the language is professional and ATS-friendly.
    - Formatting each description as a single string, with bullet points starting with '• '.

Return a JSON object with the enhanced 'summary' and 'experiences'. Do not change the job titles, companies, or dates.`,
  config: {
    temperature: 0.5,
  },
});

const enhanceResumeFlow = ai.defineFlow(
  {
    name: 'enhanceResumeFlow',
    inputSchema: EnhanceResumeInputSchema,
    outputSchema: EnhanceResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
