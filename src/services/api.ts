import { RephraseApiResponse, RephraseOutput } from '../types';

export async function rephraseText(text: string): Promise<RephraseOutput> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Please enter some text to rephrase.');
  }

  if (trimmed.length > 5000) {
    throw new Error('Input text exceeds the 5,000 character limit. Please shorten your text.');
  }

  const response = await fetch('/api/rephrase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: trimmed }),
  });

  const data: RephraseApiResponse = await response.json().catch(() => ({
    success: false,
    error: 'Invalid response from server. Please check server logs.',
  }));

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data.data;
}
