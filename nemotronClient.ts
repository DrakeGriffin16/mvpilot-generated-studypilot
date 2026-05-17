// apps/web/src/lib/nemotronClient.ts
/**
 * Wrapper for NVIDIA Nemotron API calls.
 * Provides methods for embeddings, reranking, and reasoning.
 * All calls are made from the frontend but in a real deployment
 * these should be proxied through the backend to keep API keys secret.
 * For the MVP we demonstrate the shape of the calls; actual keys
 * must be supplied via environment variables and handled by a backend
 * service in production.
 */

const NEMOTRON_BASE_URL = import.meta.env.VITE_NEMOTRON_BASE_URL ?? 'https://api.nvidia.com/nemotron/v1';
const NEMOTRON_API_KEY = import.meta.env.VITE_NEMOTRON_API_KEY ?? '';

if (!NEMOTRON_API_KEY) {
  console.warn('VITE_NEMOTRON_API_KEY is not set. Nemotron calls will fail.');
}

/**
 * Generic fetch helper with error handling.
 */
async function nemotronFetch<T>(endpoint: string, payload: object): Promise<T> {
  const response = await fetch(`${NEMOTRON_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NEMOTRON_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nemotron API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Get embeddings for a list of texts.
 * @param texts Array of strings to embed.
 * @returns Promise resolving to an array of embedding vectors (numbers[]).
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const payload = { input: texts, model: 'llama-nemotron-embed-1b-v2' };
  const { data } = await nemotronFetch<{ data: { embedding: number[] }[] }>('/embeddings', payload);
  return data.map(item => item.embedding);
}

/**
 * Rerank documents based on a query.
 * @param query The query string.
 * @param documents Array of document texts to rerank.
 * @returns Promise resolving to an array of objects with index and relevance score.
 */
export async function rerank(query: string, documents: string[]): Promise<{ index: number; score: number }[]> {
  if (documents.length === 0) return [];
  const payload = { query, documents, model: 'llama-nemotron-rerank-1b-v2' };
  const { results } = await nemotronFetch<{ results: { index: number; score: number }[] }>('/rerank', payload);
  return results;
}

/**
 * Generate reasoning / completion using the Nemotron reasoning model.
 * @param prompt The prompt to feed the model.
 * @param options Optional parameters (temperature, max_tokens, etc.).
 * @returns Promise resolving to the generated text.
 */
export async function generateReasoning(
  prompt: string,
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  const payload = {
    model: 'nemotron-reasoning',
    prompt,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 512,
  };
  const { text } = await nemotronFetch<{ text: string }>('/reasoning', payload);
  return text;
}