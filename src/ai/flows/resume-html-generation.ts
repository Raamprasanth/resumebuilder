'use server';

import {
  type GenerateResumeInput,
  type GenerateResumeOutput,
} from '@/ai/schemas/resume-generation';
import { generateHtmlResumeString } from '@/lib/resume-templates';

export async function generateHtmlResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  const htmlContent = generateHtmlResumeString(input);
  return { htmlContent };
}
