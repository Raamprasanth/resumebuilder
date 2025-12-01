'use server';

/**
 * @fileOverview A flow for generating a LaTeX resume from user data and a template.
 *
 * - generateLatexResume - Generates the LaTeX source code for a resume.
 * - GenerateLatexResumeInput - The input type for the generateLatexResume function.
 * - GenerateLatexResumeOutput - The return type for the generateLatexResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  jobDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const EducationSchema = z.object({
  degree: z.string(),
  university: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const GenerateLatexResumeInputSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  summary: z.string(),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.string(),
  template: z.enum(['classic', 'modern', 'elegant']),
});
type GenerateLatexResumeInput = z.infer<typeof GenerateLatexResumeInputSchema>;

const GenerateLatexResumeOutputSchema = z.object({
  latexCode: z.string().describe('The full LaTeX source code for the generated resume.'),
});
type GenerateLatexResumeOutput = z.infer<typeof GenerateLatexResumeOutputSchema>;

export async function generateLatexResume(input: GenerateLatexResumeInput): Promise<GenerateLatexResumeOutput> {
  return generateLatexResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLatexResumePrompt',
  input: { schema: GenerateLatexResumeInputSchema },
  output: { schema: GenerateLatexResumeOutputSchema },
  prompt: `
You are an expert in LaTeX resume design. Generate the complete LaTeX source code for a professional resume based on the user's information and selected template.

**Crucially, the output must be ONLY the raw LaTeX code, starting with \\documentclass{...} and ending with \\end{document}. Do not wrap it in markdown fences or any other text.**

Selected Template: {{{template}}}

User Information:
- Full Name: {{{fullName}}}
- Email: {{{email}}}
- Phone: {{{phone}}}
- Professional Summary: {{{summary}}}

- Experience:
{{#each experiences}}
  - Job Title: {{this.jobTitle}}
    Company: {{this.company}}
    Dates: {{this.startDate}} - {{this.endDate}}
    Description: {{this.jobDescription}}
{{/each}}

- Education:
{{#each education}}
  - Degree: {{this.degree}}
    University: {{this.university}}
    Dates: {{this.startDate}} - {{this.endDate}}
{{/each}}

- Skills: {{{skills}}}

Generate a visually appealing, well-structured resume using the '{{template}}' template style. Use common LaTeX packages like 'geometry', 'fontawesome', and 'enumitem' as needed. Ensure the structure is clean and parsable.
`,
});


const generateLatexResumeFlow = ai.defineFlow(
  {
    name: 'generateLatexResumeFlow',
    inputSchema: GenerateLatexResumeInputSchema,
    outputSchema: GenerateLatexResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
