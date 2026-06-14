import 'dotenv/config';
import { generateCareerRoadmap } from './src/ai/flows/career-roadmap-generation.js';

async function test() {
  try {
    const response = await generateCareerRoadmap({
      careerPath: 'Frontend Developer',
      currentSkills: 'HTML, CSS',
      timeline: '6 months',
    });
    console.log('SUCCESS:', JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
