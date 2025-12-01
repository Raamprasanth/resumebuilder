
'use server';

/**
 * @fileOverview A flow for analyzing a user's social coding profiles like GitHub and LeetCode.
 *
 * - analyzeSocialProfiles - Generates an analysis of the profiles.
 */

import { ai } from '@/ai/genkit';
import { SocialProfileAnalysisInputSchema, SocialProfileAnalysisOutputSchema, type SocialProfileAnalysisInput, type SocialProfileAnalysisOutput } from '@/ai/schemas/social-profile-analysis';

export async function analyzeSocialProfiles(input: SocialProfileAnalysisInput): Promise<SocialProfileAnalysisOutput> {
    return analyzeSocialProfilesFlow(input);
}


const prompt = ai.definePrompt({
    name: 'socialProfileAnalysisPrompt',
    input: { schema: SocialProfileAnalysisInputSchema },
    output: { schema: SocialProfileAnalysisOutputSchema },
    prompt: `You are a helpful AI assistant that simulates a social profile analysis. Based on the provided profile URLs, generate a realistic-sounding but fictional analysis.

    Do not attempt to access the URLs. Generate plausible data for the fields.
    
    {{#if githubUrl}}
    - For GitHub, generate a random number of repositories between 10 and 150.
    - Generate a random number of contributions between 50 and 2000.
    - Determine an activity level based on the contribution count.
    {{/if}}

    {{#if leetCodeUrl}}
    - For LeetCode, generate a total number of solved problems between 20 and 800.
    - Distribute the solved problems plausibly among easy, medium, and hard difficulties. The sum should match the total.
    {{/if}}

    Return a JSON object with keys 'github' and/or 'leetCode' containing the fictional analysis. If a URL is not provided, omit the corresponding key from the output.
    `,
});


const analyzeSocialProfilesFlow = ai.defineFlow({
    name: 'analyzeSocialProfilesFlow',
    inputSchema: SocialProfileAnalysisInputSchema,
    outputSchema: SocialProfileAnalysisOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output!;
});
