import { ai } from './src/ai/genkit.js';

async function test() {
  try {
    const response = await ai.generate('hello');
    console.log('SUCCESS:', response.text);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
