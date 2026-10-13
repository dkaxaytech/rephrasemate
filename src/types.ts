export type ToneType = 'formal' | 'casual' | 'email' | 'simple';

export interface RephraseOutput {
  formal: string;
  casual: string;
  email: string;
  simple: string;
}

export interface RephraseRequest {
  text: string;
}

export interface RephraseApiResponse {
  success: boolean;
  data?: RephraseOutput;
  error?: string;
}
