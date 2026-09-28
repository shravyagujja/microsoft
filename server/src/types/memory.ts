export interface Memory {
  id: string;
  dealId: string;
  category: string;
  summary: string;
  evidence: string[];
  timestamp: Date;
  sourceInteractionId: string;
  relevanceScore?: number;
}
