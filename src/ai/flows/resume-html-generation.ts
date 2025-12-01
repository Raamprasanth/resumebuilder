'use server';

/**
 * @fileOverview A flow for generating an HTML resume from user data and a template.
 *
 * - generateHtmlResume - Generates the HTML source code for a resume.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateResumeInputSchema,
  GenerateResumeOutputSchema,
  type GenerateResumeInput,
  type GenerateResumeOutput,
} from '@/ai/schemas/resume-generation';

export async function generateHtmlResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateHtmlResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHtmlResumePrompt',
  input: { schema: GenerateResumeInputSchema },
  output: { schema: GenerateResumeOutputSchema },
  prompt: `
You are an expert in HTML resume design. Your task is to generate the complete HTML source code for a professional resume by populating a given template with the user's information.

**Crucially, the output must be ONLY the raw HTML code, enclosed in a single root <div> element with an id of "resume-container". Do not wrap it in markdown fences, explanations, or any other text. Use inline CSS for all styling.**

The user has selected the '{{{template}}}' template.

**User Information:**
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

---

**Follow the structure for the selected '{{{template}}}' template VERY CAREFULLY.**

**IF template is 'classic' USE THIS STRUCTURE:**
A single-column layout with clear sections. Use a professional and clean design with serif fonts.

\'\'\'html
<div id="resume-container" style="font-family: Georgia, serif; line-height: 1.6; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 25mm;">
    <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 36px; font-weight: bold;">{{{fullName}}}</h1>
        <p style="margin: 5px 0 0; font-size: 14px;">{{{email}}} | {{{phone}}}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Summary</h2>
        <p style="font-size: 14px;">{{{summary}}}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Experience</h2>
        {{#each experiences}}
        <div style="margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">{{this.jobTitle}}</h3>
            <div style="display: flex; justify-content: space-between; font-style: italic; margin-bottom: 5px;">
                <span>{{this.company}}</span>
                <span>{{this.startDate}} - {{this.endDate}}</span>
            </div>
            <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
                {{#each (split this.jobDescription '\n')}}
                <li>{{{this}}}</li>
                {{/each}}
            </ul>
        </div>
        {{/each}}
    </div>

    <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Education</h2>
        {{#each education}}
        <div style="margin-bottom: 10px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">{{this.degree}}</h3>
            <div style="display: flex; justify-content: space-between; font-style: italic;">
                <span>{{this.university}}</span>
                <span>{{this.startDate}} - {{this.endDate}}</span>
            </div>
        </div>
        {{/each}}
    </div>

    <div>
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Skills</h2>
        <p style="font-size: 14px;">{{{skills}}}</p>
    </div>
</div>
\'\'\'


**IF template is 'modern' USE THIS STRUCTURE:**
A two-column layout with a colored sidebar. Use sans-serif fonts and a clean, contemporary design.

\'\'\'html
<div id="resume-container" style="display: flex; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; width: 210mm; min-height: 297mm;">
    <div style="width: 35%; background-color: #4A5568; color: #fff; padding: 30px;">
        <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">{{{fullName}}}</h1>
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #A0AEC0; padding-bottom: 5px; margin-bottom: 10px;">Contact</h2>
            <p style="font-size: 14px; margin: 5px 0;">{{{email}}}</p>
            <p style="font-size: 14px; margin: 5px 0;">{{{phone}}}</p>
        </div>
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #A0AEC0; padding-bottom: 5px; margin-bottom: 10px;">Education</h2>
            {{#each education}}
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: bold;">{{this.degree}}</h3>
                <p style="margin: 0; font-size: 12px;">{{this.university}}</p>
                <p style="margin: 0; font-size: 12px; font-style: italic;">{{this.startDate}} - {{this.endDate}}</p>
            </div>
            {{/each}}
        </div>
        <div>
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #A0AEC0; padding-bottom: 5px; margin-bottom: 10px;">Skills</h2>
            <ul style="padding-left: 0; list-style-type: none; margin: 0; font-size: 14px;">
                {{#each (split skills ',')}}
                <li style="margin-bottom: 5px;">{{{trim this}}}</li>
                {{/each}}
            </ul>
        </div>
    </div>
    <div style="width: 65%; padding: 30px; color: #333;">
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; font-weight: bold; color: #2D3748; border-bottom: 2px solid #2D3748; padding-bottom: 5px; margin-bottom: 15px;">Summary</h2>
            <p style="font-size: 14px; line-height: 1.6;">{{{summary}}}</p>
        </div>
        <div>
            <h2 style="font-size: 20px; font-weight: bold; color: #2D3748; border-bottom: 2px solid #2D3748; padding-bottom: 5px; margin-bottom: 15px;">Experience</h2>
            {{#each experiences}}
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">{{this.jobTitle}}</h3>
                <div style="display: flex; justify-content: space-between; font-style: italic; color: #718096; margin-bottom: 5px; font-size: 14px;">
                    <span>{{this.company}}</span>
                    <span>{{this.startDate}} - {{this.endDate}}</span>
                </div>
                <ul style="padding-left: 20px; margin: 0; font-size: 14px; line-height: 1.6;">
                    {{#each (split this.jobDescription '\n')}}
                    <li>{{{this}}}</li>
                    {{/each}}
                </ul>
            </div>
            {{/each}}
        </div>
    </div>
</div>
\'\'\'


**IF template is 'elegant' USE THIS STRUCTURE:**
A minimalist, stylish design that uses whitespace effectively.

\'\'\'html
<div id="resume-container" style="font-family: 'Garamond', 'Baskerville', 'Times New Roman', serif; line-height: 1.5; color: #1a1a1a; background-color: #fff; width: 210mm; min-height: 297mm; padding: 25mm 30mm;">
    <h1 style="font-size: 48px; font-weight: normal; text-align: center; letter-spacing: 2px; margin: 0 0 5px 0;">{{{fullName}}}</h1>
    <p style="text-align: center; font-size: 14px; margin-bottom: 30px;">{{{email}}} &nbsp;&bull;&nbsp; {{{phone}}}</p>

    <p style="text-align: center; font-size: 16px; font-style: italic; margin-bottom: 30px;">{{{summary}}}</p>

    <hr style="border: 0; height: 1px; background-color: #ccc; margin: 30px 0;">

    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Experience</h2>
    {{#each experiences}}
    <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 18px; font-weight: bold;">{{this.jobTitle}}</h3>
            <span style="font-size: 14px; font-style: italic;">{{this.startDate}} - {{this.endDate}}</span>
        </div>
        <p style="margin: 0 0 10px 0; font-size: 16px; font-style: italic;">{{this.company}}</p>
        <div style="font-size: 14px; padding-left: 15px;">
            {{#each (split this.jobDescription '\n')}}
            <p style="margin: 0 0 5px 0;">&ndash; {{{this}}}</p>
            {{/each}}
        </div>
    </div>
    {{/each}}

    <hr style="border: 0; height: 1px; background-color: #ccc; margin: 30px 0;">

    <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
            <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Education</h2>
            {{#each education}}
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: bold;">{{this.degree}}</h3>
                <p style="margin: 0; font-size: 16px; font-style: italic;">{{this.university}}</p>
                <p style="margin: 0; font-size: 14px; font-style: italic;">{{this.startDate}} - {{this.endDate}}</p>
            </div>
            {{/each}}
        </div>
        <div style="width: 48%;">
            <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Skills</h2>
            <p style="font-size: 14px;">{{{skills}}}</p>
        </div>
    </div>
</div>
\'\'\'

Generate the HTML code based *only* on the selected template's structure.
`,
  helpers: {
    split: (str: string, separator: string) => str.split(separator).map(s => s.trim()).filter(s => s),
    trim: (str: string) => str.trim(),
  },
  config: {
    temperature: 0.2,
  }
});


const generateHtmlResumeFlow = ai.defineFlow(
  {
    name: 'generateHtmlResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
