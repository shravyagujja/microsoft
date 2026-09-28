import type { RiskLevel } from './deal';

export interface Evidence {
  interactionId: string;
  date: string;
  memoryType: string;
  description: string;
}

export interface HistoricalInsight {
  id: string;
  pattern: string;
  similarCasesCount: number;
  outcomes: {
    description: string;
    count: number;
  }[];
  suggestedApproach: string;
}

export interface Risk {
  level: RiskLevel;
  description: string;
}

export interface DealAnalysis {
  dealId: string;
  currentRisk: Risk;
  reasoningSummary: string;
  evidence: Evidence[];
  priorityEvolution: {
    from: string;
    to: string;
    description: string;
  }[];
  recommendedNextAction: {
    action: string;
    reasoning: string;
  };
  historicalLearning?: HistoricalInsight;
}

export interface ResponseDraft {
  draft: string;
  keyPoints: string[];
  warnings: string[];
}
