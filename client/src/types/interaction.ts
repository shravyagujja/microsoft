export type InteractionType = 'email' | 'meeting' | 'call' | 'note';

export interface Interaction {
  id: string;
  dealId: string;
  timestamp: string;
  week: number;
  day: number;
  type: InteractionType;
  speaker: string;
  source: string;
  content: string;
  nlpTags: string[];
}
