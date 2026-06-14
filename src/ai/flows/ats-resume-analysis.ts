'use server';

/**
 * @fileOverview A flow for analyzing a resume using standard heuristics (No AI).
 */

import { z } from 'zod';
// @ts-ignore
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported types include PDF and DOCX."
    ),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const DetailedFeedbackItemSchema = z.object({
  type: z.enum(['positive', 'negative']),
  title: z.string().describe('A short title for the feedback point (e.g., "Professional and concise language").'),
  description: z.string().describe('A detailed explanation for the feedback point, 1-2 sentences long.'),
});

const ScoreItemSchema = z.object({
  category: z.string().describe("The category being scored (e.g., 'Tone & Style', 'Content')."),
  score: z.number().min(0).max(100).describe('The score for this category, from 0 to 100.'),
  badge: z.string().describe("A qualitative badge for the score (e.g., 'Strong', 'Good Start', 'Needs Improvement')."),
  detailedFeedback: z.array(DetailedFeedbackItemSchema).describe('An array of 3-5 specific, detailed feedback points for this category.'),
});

const FeedbackItemSchema = z.object({
  type: z.enum(['positive', 'negative']),
  message: z.string(),
});

const AnalyzeResumeOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('The overall resume score from 0 to 100.'),
  scoreBreakdown: z.array(ScoreItemSchema).describe('A breakdown of the score into different categories like Tone, Content, Structure, and Skills.'),
  headline: z.string().describe('A short, encouraging headline for the feedback card (e.g., "Great Job!").'),
  feedback: z.array(FeedbackItemSchema).describe('A list of 3-5 specific, actionable feedback points for the overall resume.'),
  summary: z.string().describe('A concluding sentence to encourage the user to keep refining their resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  const { resumeDataUri } = input;
  
  // 1. Extract base64 and mime type
  const matches = resumeDataUri.match(/^data:([A-Za-z-+\/.]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid input string');
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  let text = '';
  
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    console.error("Error parsing document:", error);
    throw new Error("Failed to extract text from the document.");
  }
  
  // 2. Text Processing & Heuristics
  const lowerText = text.toLowerCase();
  
  // Heuristic 1: Structure (Looking for key sections)
  let structureScore = 0;
  const missingSections: string[] = [];
  const foundSections: string[] = [];
  
  const sections = {
    'Experience': /(experience|employment|work history)/i,
    'Education': /(education|academic)/i,
    'Skills': /(skills|technologies|proficiencies)/i,
    'Summary': /(summary|profile|objective)/i
  };
  
  for (const [sectionName, regex] of Object.entries(sections)) {
    if (regex.test(text)) {
      structureScore += 25;
      foundSections.push(sectionName);
    } else {
      missingSections.push(sectionName);
    }
  }
  
  // Heuristic 2: Content (Quantifiable metrics, word count)
  let contentScore = 50;
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 300 && wordCount < 1000) contentScore += 25; // Good length
  else if (wordCount <= 300) contentScore -= 10;
  
  const numbersRegex = /\b\d+\b/g;
  const numbersMatch = text.match(numbersRegex);
  if (numbersMatch && numbersMatch.length > 5) {
    contentScore += 25; // Quantifiable metrics found
  } else {
    contentScore += 10;
  }
  contentScore = Math.min(100, Math.max(0, contentScore));
  
  // Heuristic 3: Tone & Style (Absence of personal pronouns)
  let toneScore = 100;
  const personalPronouns = /\b(i|me|my|we)\b/gi;
  const pronounsFound = (text.match(personalPronouns) || []).length;
  if (pronounsFound > 2) {
    toneScore -= (pronounsFound * 5); // Deduct points for personal pronouns
  }
  toneScore = Math.max(0, toneScore);
  
  // Heuristic 4: Skills (Keyword density - simulated by tech keywords)
  let skillsScore = 40;
  const techKeywords = ['javascript', 'python', 'java', 'c++', 'react', 'node', 'aws', 'docker', 'sql', 'agile', 'management', 'leadership', 'design', 'sales', 'marketing'];
  let keywordsFound = 0;
  techKeywords.forEach(kw => {
    if (lowerText.includes(kw)) keywordsFound++;
  });
  skillsScore += (keywordsFound * 10);
  skillsScore = Math.min(100, skillsScore);
  
  const overallScore = Math.round((structureScore + contentScore + toneScore + skillsScore) / 4);
  
  // Generate Feedback dynamically
  const generateBadge = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Good Start";
    return "Needs Improvement";
  };
  
  const structureFeedback = [];
  if (missingSections.length > 0) {
    structureFeedback.push({ type: 'negative' as const, title: 'Missing Sections', description: `Consider adding the following sections: ${missingSections.join(', ')}.` });
  } else {
    structureFeedback.push({ type: 'positive' as const, title: 'Great Structure', description: 'Your resume contains all the standard sections expected by ATS.' });
  }
  
  const contentFeedback = [];
  if (contentScore >= 80) {
    contentFeedback.push({ type: 'positive' as const, title: 'Quantifiable Metrics', description: 'You have a good amount of numbers and metrics to back up your achievements.' });
  } else {
    contentFeedback.push({ type: 'negative' as const, title: 'Lack of Metrics', description: 'Try to quantify your achievements with numbers (e.g., percentages, team sizes, revenue).' });
  }
  if (wordCount < 300) {
    contentFeedback.push({ type: 'negative' as const, title: 'Too Short', description: 'Your resume seems a bit short. Add more detail to your experience.' });
  } else {
    contentFeedback.push({ type: 'positive' as const, title: 'Good Length', description: 'Your resume has an appropriate amount of detail.' });
  }
  
  const toneFeedback = [];
  if (pronounsFound > 0) {
    toneFeedback.push({ type: 'negative' as const, title: 'Personal Pronouns', description: 'Avoid using personal pronouns like "I" or "my" in a professional resume.' });
  } else {
    toneFeedback.push({ type: 'positive' as const, title: 'Professional Tone', description: 'Your resume uses a strong, objective tone.' });
  }
  
  const skillsFeedback = [];
  if (keywordsFound > 3) {
    skillsFeedback.push({ type: 'positive' as const, title: 'Keyword Rich', description: 'We found several strong industry keywords in your resume.' });
  } else {
    skillsFeedback.push({ type: 'negative' as const, title: 'Missing Keywords', description: 'Consider adding more specific tools, technologies, or hard skills.' });
  }

  const generalFeedback = [
     overallScore > 75 
        ? { type: 'positive' as const, message: 'Your resume is highly readable by ATS systems.' }
        : { type: 'negative' as const, message: 'Your resume may struggle to pass some ATS filters.' }
  ];
  if (missingSections.length > 0) {
     generalFeedback.push({ type: 'negative' as const, message: `Add missing standard sections: ${missingSections.join(', ')}.` });
  } else {
     generalFeedback.push({ type: 'positive' as const, message: 'Excellent use of standard headers.' });
  }
  
  return {
    overallScore,
    scoreBreakdown: [
      { category: 'Structure', score: structureScore, badge: generateBadge(structureScore), detailedFeedback: structureFeedback },
      { category: 'Content', score: contentScore, badge: generateBadge(contentScore), detailedFeedback: contentFeedback },
      { category: 'Tone & Style', score: toneScore, badge: generateBadge(toneScore), detailedFeedback: toneFeedback },
      { category: 'Skills', score: skillsScore, badge: generateBadge(skillsScore), detailedFeedback: skillsFeedback }
    ],
    headline: overallScore >= 80 ? "Great Job!" : overallScore >= 60 ? "A Solid Foundation" : "Needs some work",
    feedback: generalFeedback,
    summary: "Keep refining your resume to ensure it hits the right keywords for the jobs you want."
  };
}
