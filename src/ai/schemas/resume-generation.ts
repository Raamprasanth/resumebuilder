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

export const ProjectSchema = z.object({
  name: z.string(),
  timeline: z.string(),
  description: z.string(),
});

export const GenerateResumeInputSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  summary: z.string(),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema).optional(),
  skills: z.string(),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

export const GenerateResumeOutputSchema = z.object({
  htmlContent: z.string().describe('The full HTML source code for the generated resume.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export const JobRecommendationSchema = z.object({
    id: z.string().describe('A unique identifier for the job.'),
    title: z.string().describe('The job title.'),
    company: z.string().describe('The name of the company.'),
    platform: z.string().optional().describe('The job board platform (e.g., Indeed, Naukri, Apna, Internshala, JobHai).'),
    location: z.string().describe('The location of the job.'),
    logoUrl: z.string().url().describe('A URL for a fictional but realistic company logo. Use picsum.photos for placeholder images (e.g., https://picsum.photos/seed/cologo1/100/100).'),
    description: z.string().describe('A detailed, realistic job description, formatted with markdown (using headings, lists, etc.).'),
    applyUrl: z.string().url().describe('A fictional URL to apply for the job.'),
});
export type JobRecommendation = z.infer<typeof JobRecommendationSchema>;
