import { getHindsightClient, getBankId } from './hindsight/hindsight.client';
import { GeminiService } from './llm/llm.service';

export class LearningService {
  private hindsight = getHindsightClient();
  private llm = new GeminiService();
  private globalBankId = 'global-deals-learning';

  async recordDealLearning(dealId: string, summary: string, outcome: string) {
    if (!this.hindsight) return;
    try {
      await this.hindsight.retain(this.globalBankId, summary, {
        metadata: { dealId, outcome, timestamp: new Date().toISOString() }
      });
    } catch (e) {
      console.error('[Learning] Failed to record', e);
    }
  }

  async findHistoricalPattern(currentDealState: any, query: string) {
    if (!this.hindsight) return null;
    try {
      const response = await this.hindsight.recall(this.globalBankId, query, { maxTokens: 1000 });
      const memories = Array.isArray(response) ? response : (response as any).memories || (response as any).results || [];
      
      if (!memories || memories.length === 0) return null;
      
      const historicalCases = memories.map((m: any) => ({
        dealId: m.metadata?.dealId,
        summary: m.text || m.content,
        outcome: m.metadata?.outcome
      }));

      const insight = await this.llm.generateHistoricalInsight(currentDealState, historicalCases);
      return insight;
    } catch (e) {
      console.error('[Learning] Failed to find historical pattern', e);
      return null;
    }
  }
}
