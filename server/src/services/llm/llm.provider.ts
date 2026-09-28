import { z } from 'zod';

export interface ExtractionResult {
  requirements: Array<{ title: string; description: string; evidence: string }>;
  objections: Array<{ title: string; description: string; evidence: string }>;
  stakeholders: Array<{ name: string; role: string; organization: string; influence: string; sentiment: string }>;
  commitments: Array<{ action: string; owner: string; dueDate: Date | null; status: string; evidence: string }>;
  prioritySignals: Array<{ priority: string; evidence: string; confidence: 'high' | 'medium' | 'low' }>;
  outcomes: Array<{ type: string; description: string }>;
  dealRisks: Array<{ category: string; title: string; description: string; severity: 'high' | 'medium' | 'low'; evidence: string }>;
  priorityShift?: {
    shiftDetected: boolean;
    fromPriority?: string;
    toPriority?: string;
    reason?: string;
    evidence?: string;
    confidence?: 'high' | 'medium' | 'low';
  } | null;
}

export interface LLMProvider {
  extractInteraction(content: string, type: string, historicalContext: string): Promise<ExtractionResult>;
  detectPriorityShift(currentSignals: any[], historicalSignals: any[], customerStatements: string[]): Promise<any>;
  analyzeDealRisk(dealState: any, hindsightMemories: any[]): Promise<any>;
  generateResponse(dealState: any, recentInteraction: any, insights: any): Promise<{ draft: string; keyPoints: string[]; warnings: string[] }>;
  generateHistoricalInsight?(currentDealState: any, historicalCases: any[]): Promise<any>;
}
