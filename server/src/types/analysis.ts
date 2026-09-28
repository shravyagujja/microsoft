import { Risk, PriorityShift } from './interaction';

export interface DealAnalysis {
  dealId: string;
  currentRisk: {
    level: 'high' | 'medium' | 'low';
    description: string;
  };
  reasoningSummary: string;
  evidence: Array<{
    description: string;
    memoryType: string;
    date: Date;
  }>;
  priorityEvolution: Array<{
    from: string;
    to: string;
  }>;
  historicalLearning?: {
    id: string;
    pattern: string;
    similarCasesCount: number;
    outcomes: Array<{
      description: string;
      count: number;
    }>;
    suggestedApproach: string;
  };
  recommendedNextAction: {
    action: string;
    reasoning: string;
  };
}
