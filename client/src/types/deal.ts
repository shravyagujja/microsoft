export type RiskLevel = 'high' | 'medium' | 'low';
export type DealStage = 'discovery' | 'negotiation' | 'proposal' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  customerName: string;
  value: number;
  stage: DealStage;
  daysActive: number;
  riskLevel: RiskLevel;
  currentConcern?: string;
  lastInteractionAt: string;
  riskTrend: number[]; // e.g. [1, 2, 3, 2, 4] for sparklines
  commitments?: any[];
  stakeholders?: any[];
}
