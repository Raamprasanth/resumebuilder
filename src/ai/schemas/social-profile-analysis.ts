import { z } from 'zod';

export const SocialProfileAnalysisInputSchema = z.object({
  githubUrl: z.string().url().or(z.literal('')).optional().describe("The URL of the user's GitHub profile."),
  leetCodeUrl: z.string().url().or(z.literal('')).optional().describe("The URL of the user's LeetCode profile."),
  stackOverflowUrl: z.string().url().or(z.literal('')).optional().describe("The URL of the user's Stack Overflow profile."),
});
export type SocialProfileAnalysisInput = z.infer<typeof SocialProfileAnalysisInputSchema>;


const GithubAnalysisSchema = z.object({
    repositories: z.number().describe("A realistic but fictional number of public repositories."),
    contributionsLastYear: z.number().describe("A realistic but fictional number of contributions in the last year."),
    activityLevel: z.enum(['Low', 'Medium', 'High', 'Very High']).describe("A qualitative assessment of the GitHub activity."),
    avatarUrl: z.string().url().describe("A placeholder avatar URL."),
    followers: z.number().describe("A realistic but fictional number of followers."),
    bio: z.string().describe("A short, plausible bio."),
});

const LeetCodeAnalysisSchema = z.object({
    totalSolved: z.number().describe("A realistic but fictional number of total problems solved."),
    easySolved: z.number().describe("A realistic but fictional number of easy problems solved."),
    mediumSolved: z.number().describe("A realistic but fictional number of medium problems solved."),
    hardSolved: z.number().describe("A realistic but fictional number of hard problems solved."),
    ranking: z.number().describe("A realistic but fictional overall ranking."),
    reputation: z.number().describe("A realistic but fictional reputation score."),
});

const StackOverflowAnalysisSchema = z.object({
    reputation: z.number().describe("A realistic but fictional reputation score."),
    goldBadges: z.number().describe("A realistic but fictional number of gold badges."),
    silverBadges: z.number().describe("A realistic but fictional number of silver badges."),
    bronzeBadges: z.number().describe("A realistic but fictional number of bronze badges."),
    topTags: z.array(z.string()).describe("A list of 3-5 plausible top technical tags."),
});


export const SocialProfileAnalysisOutputSchema = z.object({
  github: GithubAnalysisSchema.optional(),
  leetCode: LeetCodeAnalysisSchema.optional(),
  stackOverflow: StackOverflowAnalysisSchema.optional(),
});
export type SocialProfileAnalysisOutput = z.infer<typeof SocialProfileAnalysisOutputSchema>;
