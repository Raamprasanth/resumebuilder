'use server';

/**
 * @fileOverview A flow for enhancing resume content using AI.
 *
 * - enhanceResume - Rewrites and improves resume content based on user input and instructions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EnhanceResumeInputSchema = z.object({
  htmlContent: z.string(),
  enhancementInstructions: z
    .string()
    .describe(
      'User-provided instructions, such as a job description or a request to make the tone more professional.'
    ),
});
export type EnhanceResumeInput = z.infer<typeof EnhanceResumeInputSchema>;

const EnhanceResumeOutputSchema = z.object({
  enhancedHtmlContent: z
    .string()
    .describe('The rewritten, enhanced HTML content.'),
});
export type EnhanceResumeOutput = z.infer<typeof EnhanceResumeOutputSchema>;

import { runWithFallback } from '@/ai/fallback-runner';

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

**User's Current Resume HTML:**
---
{{{htmlContent}}}
---

**Your Task:**
1.  Read the current HTML content of the resume.
2.  Enhance the textual content (Summary, Experience, Projects, Skills) based on the user's instructions.
3.  Rewrite job descriptions to use strong action verbs and quantify achievements with metrics where possible.
4.  Ensure the language is professional and ATS-friendly.
5.  **CRITICAL**: Return the EXACT same HTML structure. Do not remove or alter any HTML tags, classes, or IDs. ONLY rewrite the text content within the tags.

Return a JSON object with the \`enhancedHtmlContent\`.`,
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
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error) {
      console.warn('Gemini prompt failed, falling back...', error);
      const rendered = await prompt.render(input);
      const textPrompt = rendered.messages.flatMap(m => m.content.map(c => c.text)).join('\n');
      return runWithFallback<EnhanceResumeOutput>(
        'You are an expert resume writer and career coach. You must return a JSON object.',
        textPrompt
      );
    }
  }
);
