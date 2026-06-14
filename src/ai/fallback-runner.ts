import OpenAI from 'openai';

interface FallbackProvider {
  name: string;
  client: OpenAI | null;
  model: string;
}

const groq = process.env.GROQ_API_KEY
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })
  : null;

const cerebras = process.env.CEREBRAS_API_KEY
  ? new OpenAI({ apiKey: process.env.CEREBRAS_API_KEY, baseURL: 'https://api.cerebras.ai/v1' })
  : null;

const mistral = process.env.MISTRAL_API_KEY
  ? new OpenAI({ apiKey: process.env.MISTRAL_API_KEY, baseURL: 'https://api.mistral.ai/v1' })
  : null;

const providers: FallbackProvider[] = [
  { name: 'Groq', client: groq, model: 'llama-3.3-70b-versatile' },
  { name: 'Cerebras', client: cerebras, model: 'llama3.1-8b' },
  { name: 'Mistral', client: mistral, model: 'mistral-large-latest' },
];

export async function runWithFallback<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  let lastError: Error | null = null;
  
  for (const provider of providers) {
    if (!provider.client) {
      console.warn(`Provider ${provider.name} is not configured.`);
      continue;
    }
    
    try {
      console.log(`Attempting generation with fallback provider: ${provider.name} using model: ${provider.model}`);
      const response = await provider.client.chat.completions.create({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error(`Empty response from ${provider.name}`);
      
      const parsed = JSON.parse(content) as T;
      console.log(`Successfully generated response using ${provider.name}`);
      return parsed;
    } catch (error: any) {
      console.error(`Provider ${provider.name} failed:`, error.message);
      lastError = error;
    }
  }
  
  throw new Error(`All fallback providers failed. Last error: ${lastError?.message}`);
}
