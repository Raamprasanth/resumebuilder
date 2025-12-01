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

**Crucially, you must return a JSON object with a single key "htmlContent" containing the raw HTML code as a string. Do not add any other explanations or text. The HTML must be a single root <div> element with an id of "resume-container". Use inline CSS for all styling.**

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

**IF template is 'elegant' USE THIS STRUCTURE:**
\'\'\'html
<div id="resume-container" style="font-family: 'Garamond', 'Baskerville', 'Times New Roman', serif; line-height: 1.5; color: #1a1a1a; background-color: #f9f9f9; width: 210mm; min-height: 297mm; padding: 25mm 30mm; border: 1px solid #ddd;">
    <h1 style="font-size: 42px; font-weight: normal; text-align: center; letter-spacing: 2px; margin: 0 0 5px 0; color: #2c3e50;">{{{fullName}}}</h1>
    <p style="text-align: center; font-size: 14px; margin-bottom: 25px; color: #555;">{{{email}}} &nbsp;&bull;&nbsp; {{{phone}}}</p>

    <p style="text-align: center; font-size: 16px; font-style: italic; margin: 0 10% 25px 10%; color: #34495e;">{{{summary}}}</p>

    <hr style="border: 0; height: 1.5px; background-color: #3498db; margin: 25px 0;">

    <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; color: #3498db; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Experience</h2>
    {{#each experiences}}
    <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 17px; font-weight: bold; color: #2c3e50;">{{this.jobTitle}}</h3>
            <span style="font-size: 14px; font-style: italic; color: #555;">{{this.startDate}} - {{this.endDate}}</span>
        </div>
        <p style="margin: 2px 0 8px 0; font-size: 15px; font-style: italic; color: #7f8c8d;">{{this.company}}</p>
        <p style="font-size: 14px; margin-left: 15px; color: #333; white-space: pre-line;">{{this.jobDescription}}</p>
    </div>
    {{/each}}

    <hr style="border: 0; height: 1px; background-color: #ecf0f1; margin: 25px 0;">

    <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
            <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; color: #3498db; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Education</h2>
            {{#each education}}
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 17px; font-weight: bold; color: #2c3e50;">{{this.degree}}</h3>
                <p style="margin: 2px 0; font-size: 15px; font-style: italic; color: #7f8c8d;">{{this.university}}</p>
                <p style="margin: 0; font-size: 14px; font-style: italic; color: #555;">{{this.startDate}} - {{this.endDate}}</p>
            </div>
            {{/each}}
        </div>
        <div style="width: 48%;">
            <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; color: #3498db; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Skills</h2>
            <p style="font-size: 14px; color: #333; white-space: pre-line;">{{{skills}}}</p>
        </div>
    </div>
</div>
\'\'\'

**IF template is 'professional' USE THIS STRUCTURE:**
\'\'\'html
<div id="resume-container" style="font-family: 'Helvetica Neue', 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 20mm;">
    <header style="border-bottom: 2px solid #005a9c; padding-bottom: 15px; margin-bottom: 25px; text-align: left;">
        <h1 style="font-size: 48px; font-weight: 700; margin: 0; color: #005a9c;">{{{fullName}}}</h1>
        <p style="font-size: 16px; margin: 5px 0 0 0; color: #555;">{{{email}}} &nbsp;|&nbsp; {{{phone}}}</p>
    </header>

    <section style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">PROFESSIONAL SUMMARY</h2>
        <p style="font-size: 15px; color: #444;">{{{summary}}}</p>
    </section>

    <section style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">PROFESSIONAL EXPERIENCE</h2>
        {{#each experiences}}
        <div style="margin-bottom: 20px; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #222;">{{this.jobTitle}}</h3>
                <span style="font-size: 14px; font-weight: 500; color: #666;">{{this.startDate}} &ndash; {{this.endDate}}</span>
            </div>
            <p style="margin: 2px 0 10px 0; font-size: 16px; font-style: italic; color: #555;">{{this.company}}</p>
            <p style="font-size: 14px; margin-left: 20px; color: #444; white-space: pre-line;">{{this.jobDescription}}</p>
        </div>
        {{/each}}
    </section>

    <section>
        <div style="display: flex; gap: 20px;">
            <div style="width: 50%; break-inside: avoid;">
                 <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">EDUCATION</h2>
                {{#each education}}
                <div style="margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 17px; font-weight: 600; color: #222;">{{this.degree}}</h3>
                    <p style="margin: 2px 0; font-size: 15px; color: #555;">{{this.university}}</p>
                    <p style="margin: 0; font-size: 14px; color: #666;">{{this.startDate}} &ndash; {{this.endDate}}</p>
                </div>
                {{/each}}
            </div>
            <div style="width: 50%; break-inside: avoid;">
                <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">SKILLS</h2>
                 <p style="font-size: 14px; color: #444; white-space: pre-line;">{{{skills}}}</p>
            </div>
        </div>
    </section>
</div>
\'\'\'

**IF template is 'modern' USE THIS STRUCTURE:**
\'\'\'html
<div id="resume-container" style="font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif; display: flex; width: 210mm; min-height: 297mm; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <div style="width: 38%; background-color: #2c3e50; color: #ecf0f1; padding: 30px;">
        <h1 style="font-size: 36px; font-weight: 700; margin: 0; line-height: 1.2;">{{{fullName}}}</h1>
        
        <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #7f8c8d; padding-bottom: 8px; margin-bottom: 15px;">Contact</h2>
            <p style="font-size: 14px; margin: 5px 0;">{{{email}}}</p>
            <p style="font-size: 14px; margin: 5px 0;">{{{phone}}}</p>
        </div>

        <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #7f8c8d; padding-bottom: 8px; margin-bottom: 15px;">Education</h2>
            {{#each education}}
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 15px; font-weight: bold; margin: 0;">{{this.degree}}</h3>
                <p style="font-size: 14px; font-style: italic; margin: 2px 0;">{{this.university}}</p>
                <p style="font-size: 13px; color: #bdc3c7; margin: 2px 0;">{{this.startDate}} - {{this.endDate}}</p>
            </div>
            {{/each}}
        </div>

        <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #7f8c8d; padding-bottom: 8px; margin-bottom: 15px;">Skills</h2>
            <div style="font-size: 14px; white-space: pre-line; line-height: 1.6;">{{{skills}}}</div>
        </div>
    </div>

    <div style="width: 62%; padding: 30px; color: #34495e;">
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; text-transform: uppercase; letter-spacing: 2px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">Summary</h2>
            <p style="font-size: 15px; line-height: 1.6;">{{{summary}}}</p>
        </div>

        <div>
            <h2 style="font-size: 20px; text-transform: uppercase; letter-spacing: 2px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">Experience</h2>
            {{#each experiences}}
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: #2c3e50;">{{this.jobTitle}}</h3>
                    <p style="font-size: 13px; font-style: italic; color: #95a5a6; margin:0;">{{this.startDate}} - {{this.endDate}}</p>
                </div>
                <p style="font-size: 16px; font-style: italic; color: #7f8c8d; margin: 2px 0 10px 0;">{{this.company}}</p>
                <div style="font-size: 14px; line-height: 1.6; white-space: pre-line;">{{this.jobDescription}}</div>
            </div>
            {{/each}}
        </div>
    </div>
</div>
\'\'\'

Generate the HTML code based *only* on the selected template's structure.
`,
  config: {
    temperature: 0.1,
  },
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
