import { z } from 'zod';

export const ExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  jobDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const EducationSchema = z.object({
  degree: z.string(),
  university: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const GenerateLatexResumeInputSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  summary: z.string(),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.string(),
  template: z.enum(['classic', 'modern', 'elegant']),
});
export type GenerateLatexResumeInput = z.infer<typeof GenerateLatexResumeInputSchema>;

export const GenerateLatexResumeOutputSchema = z.object({
  latexCode: z.string().describe('The full LaTeX source code for the generated resume.'),
});
export type GenerateLatexResumeOutput = z.infer<typeof GenerateLatexResumeOutputSchema>;
