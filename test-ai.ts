import 'dotenv/config';
import { generateHtmlResume } from './src/ai/flows/resume-html-generation.js';

async function test() {
  try {
    const response = await generateHtmlResume({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      summary: 'A test summary',
      experiences: [],
      education: [],
      skills: 'JavaScript',
      template: 'elegant'
    });
    console.log('SUCCESS:', response.htmlContent ? 'HTML Generated' : response);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
