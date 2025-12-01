import { z } from 'zod';

export const SocialProfileAnalysisInputSchema = z.object({
  githubUrl: z.string().url().optional().describe("The URL of the user's GitHub profile."),
  leetCodeUrl: z.string().url().optional().describe("The URL of the user's LeetCode profile."),
});
export type SocialProfileAnalysisInput = z.infer<typeof SocialProfileAnalysisInputSchema>;


const GithubAnalysisSchema = z.object({
    repositories: z.number().describe("A realistic but fictional number of public repositories."),
    contributionsLastYear: z.number().describe("A realistic but fictional number of contributions in the last year."),
    activityLevel: z.enum(['Low', 'Medium', 'High', 'Very High']).describe("A qualitative assessment of the GitHub activity."),
});

const LeetCodeAnalysisSchema = z.object({
    totalSolved: z.number().describe("A realistic but fictional number of total problems solved."),
    easySolved: z.number().describe("A realistic but fictional number of easy problems solved."),
    mediumSolved: z.number().describe("A realistic but fictional number of medium problems solved."),
    hardSolved: z.number().describe("A realistic but fictional number of hard problems solved."),
});


export const SocialProfileAnalysisOutputSchema = z.object({
  github: GithubAnalysisSchema.optional(),
  leetCode: LeetCodeAnalysisSchema.optional(),
});
export type SocialProfileAnalysisOutput = z.infer<typeof SocialProfileAnalysisOutputSchema>;
