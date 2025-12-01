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

export const GenerateResumeInputSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  summary: z.string(),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.string(),
  template: z.enum(['classic', 'modern', 'elegant']),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

export const GenerateResumeOutputSchema = z.object({
  htmlContent: z.string().describe('The full HTML source code for the generated resume.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;
