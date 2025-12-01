'use server';

/**
 * @fileOverview A flow for generating a LaTeX resume from user data and a template.
 *
 * - generateLatexResume - Generates the LaTeX source code for a resume.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateLatexResumeInputSchema,
  GenerateLatexResumeOutputSchema,
  type GenerateLatexResumeInput,
  type GenerateLatexResumeOutput,
} from '@/ai/schemas/resume-generation';

export async function generateLatexResume(input: GenerateLatexResumeInput): Promise<GenerateLatexResumeOutput> {
  return generateLatexResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLatexResumePrompt',
  input: { schema: GenerateLatexResumeInputSchema },
  output: { schema: GenerateLatexResumeOutputSchema },
  prompt: `
You are an expert in LaTeX resume design. Your task is to generate the complete LaTeX source code for a professional resume by populating a given template with the user's information.

**Crucially, the output must be ONLY the raw LaTeX code, starting with \\documentclass{...} and ending with \\end{document}. Do not wrap it in markdown fences, explanations, or any other text.**

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
Use the 'article' document class. Format the experiences and education using 'resumeSubheading' and 'resumeItem'. List skills under a 'Skills' section.

\'\'\'latex
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.375in}
\\addtolength{\\evensidemargin}{-0.375in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    #1 \\vspace{-2pt}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\renewcommand{\\labelitemii}{$\\circ$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Large {{{fullName}}}} & Email : \\href{mailto:{{{email}}}}{{{{email}}}} \\\\
   & Mobile : {{{phone}}} \\\\
\\end{tabular*}

\\section{Summary}
{{{summary}}}

\\section{Education}
  \\resumeSubHeadingListStart
    {{#each education}}
    \\resumeSubheading
      { {{{this.university}}} }{}
      { {{{this.degree}}} }{ {{{this.startDate}}} - {{{this.endDate}}} }
    {{/each}}
  \\resumeSubHeadingListEnd

\\section{Experience}
  \\resumeSubHeadingListStart
    {{#each experiences}}
    \\resumeSubheading
      { {{{this.jobTitle}}} }{ {{{this.startDate}}} - {{{this.endDate}}} }
      { {{{this.company}}} }{}
      \\resumeItemListStart
        {{#each (split this.jobDescription '\\n')}}
        \\resumeItem{ {{{this}}} }
        {{/each}}
      \\resumeItemListEnd
    {{/each}}
  \\resumeSubHeadingListEnd

\\section{Skills}
 \\resumeSubHeadingListStart
    \\item{\\textbf{Skills}{: {{{skills}}} }}
 \\resumeSubHeadingListEnd

\\end{document}
\'\'\'


**IF template is 'modern' USE THIS STRUCTURE:**
This uses the 'maltacv' class. Use \\name, \\personalinfo, \\cvsection, \\cvuniversity, and \\cvexperience commands.

\'\'\'latex
\\documentclass[10pt,a4paper,ragged2e]{maltacv}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage{setspace}
\\usepackage{mathpazo}
\\usepackage{textcomp}
\\usepackage{multicol}

\\setcolorscheme{raisinblack_flame}
\\setlength\\multicolsep{0pt}
\\renewcommand{\\itemmarker}{{\\small\\textbullet}}

\\name{{{{fullName}}}}

\\begin{document}
\\tagline{{{{summary}}}}
\\personalinfo{%
  \\email{{{{email}}}}
  \\phone{{{{phone}}}}
}

\\makecvheader

\\cvsection{Skills}
\\begin{center}
  \\begin{multicols}{3}
    {{#each (split skills ',')}}
    \\cvlistitem{{{{trim this}}}}{}
    {{/each}}
  \\end{multicols}
\\end{center}

\\cvsection{Education}
\\medskip
\\begin{multicols}{2}
  {{#each education}}
  \\cvuniversity{{{{this.degree}}}}{{{{this.university}}}}{{{{this.startDate}}} -- {{{this.endDate}}}}{}
  \\vfill\\null
  \\columnbreak
  {{/each}}
\\end{multicols}

\\medskip
\\cvsection{Experience}
  {{#each experiences}}
  \\cvexperience{{{{this.jobTitle}}}}{{{{this.company}}}}{{{{this.startDate}}} -- {{{this.endDate}}}}{}{
    \\begin{itemize}
        {{#each (split this.jobDescription '\\n')}}
        \\item {{{this}}}
        {{/each}}
    \\end{itemize}
  }
  {{#unless @last}}\\divider{{/unless}}
  {{/each}}

\\end{document}
\'\'\'

**IF template is 'elegant' USE THIS STRUCTURE:**
This uses the 'deedy-resume-openfont' class which creates a two-column layout.

\'\'\'latex
\\documentclass[]{deedy-resume-openfont}

\\begin{document}

\\lastupdated

\\namesection{{{{fullName}}}}{}{
\\href{mailto:{{email}}}{{{{email}}}} | {{{phone}}}
}

\\begin{minipage}[t]{0.33\\textwidth}

\\section{Summary}
{{{summary}}}

\\section{Education}
{{#each education}}
\\subsection{{{{this.university}}}}
\\descript{{{{this.degree}}}}
\\location{{{{this.startDate}}} - {{{this.endDate}}}}
{{#unless @last}}\\sectionsep{{/unless}}
{{/each}}

\\section{Skills}
\\subsection{Technical}
{{{skills}}}
\\sectionsep

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.66\\textwidth}

\\section{Experience}
{{#each experiences}}
\\runsubsection{{{{this.jobTitle}}}}
\\descript{| {{{this.company}}}}
\\location{{{{this.startDate}}} - {{{this.endDate}}}}
\\vspace{\\topsep}
\\begin{tightemize}
{{#each (split this.jobDescription '\\n')}}
\\item {{{this}}}
{{/each}}
\\end{tightemize}
{{#unless @last}}\\sectionsep{{/unless}}
{{/each}}

\\end{minipage}
\\end{document}
\'\'\'

Generate the LaTeX code based *only* on the selected template's structure.
`,
  helpers: {
    split: (str: string, separator: string) => str.split(separator).map(s => s.trim()).filter(s => s),
    trim: (str: string) => str.trim(),
  },
  config: {
    temperature: 0.1,
  }
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
