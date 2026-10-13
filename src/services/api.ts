import { RephraseApiResponse, RephraseOutput } from '../types';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // When hosted on GitHub Pages, use the deployed backend endpoint
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return 'https://ais-dev-dr3msme3tdpkxa357stkz3-864189550895.asia-southeast1.run.app';
  }
  return '';
};

export async function rephraseText(text: string): Promise<RephraseOutput> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Please enter some text to rephrase.');
  }

  if (trimmed.length > 5000) {
    throw new Error('Input text exceeds the 5,000 character limit. Please shorten your text.');
  }

  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/rephrase`, {
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
