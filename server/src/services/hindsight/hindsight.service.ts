import { getHindsightClient, getBankId } from './hindsight.client';
import { Memory } from '../../types/memory';
import { generateId } from '../../utils/ids';

export class HindsightService {
  private hindsight = getHindsightClient();
  
  async retainInteraction(dealId: string, interactionId: string, summary: string, evidence: string[], category: string) {
    if (!this.hindsight) {
      console.log('HINDSIGHT: NOT CONFIGURED');
      return null;
    }
    try {
      const result = await this.hindsight.retain(getBankId(dealId), summary, {
        metadata: {
          interactionId,
          category,
          evidence: JSON.stringify(evidence),
          timestamp: new Date().toISOString()
        }
      });
      return result;
    } catch (e: any) {
      if (e.message?.includes('fetch failed')) {
        console.log('HINDSIGHT: NOT CONFIGURED');
      } else {
        console.error('[Hindsight] Failed to retain interaction', e);
      }
      return null;
    }
  }

  async recallDealContext(dealId: string, query: string, limit = 10): Promise<Memory[]> {
    if (!this.hindsight) {
      console.log('HINDSIGHT: NOT CONFIGURED');
      return [];
    }
    try {
      const response = await this.hindsight.recall(getBankId(dealId), query, { maxTokens: 1000 });
      const results = Array.isArray(response) ? response : (response as any).memories || (response as any).results || [];
      
      return results.map((r: any) => ({
        id: generateId('mem-'),
        dealId,
        category: r.metadata?.category as string || 'unknown',
        summary: r.text || r.content || '',
        evidence: r.metadata?.evidence ? JSON.parse(r.metadata.evidence as string) : [],
        timestamp: new Date(r.metadata?.timestamp as string || Date.now()),
        sourceInteractionId: r.metadata?.interactionId as string || '',
        relevanceScore: r.score
      }));
    } catch (e: any) {
      if (e.message?.includes('fetch failed')) {
        console.log('HINDSIGHT: NOT CONFIGURED');
      } else {
        console.error('[Hindsight] Failed to recall context', e);
      }
      return [];
    }
  }

  async getAllMemories(dealId: string): Promise<Memory[]> {
    if (!this.hindsight) {
      console.log('HINDSIGHT: NOT CONFIGURED');
      return [];
    }
    try {
      // Recall with empty query to get everything if possible, or use a broad query
      const response = await this.hindsight.recall(getBankId(dealId), "Deal requirements, objections, commitments, stakeholders, and priorities.", { maxTokens: 5000 });
      const results = Array.isArray(response) ? response : (response as any).memories || (response as any).results || [];
      
      return results.map((r: any) => ({
        id: generateId('mem-'),
        dealId,
        category: r.metadata?.category as string || 'unknown',
        summary: r.text || r.content || '',
        evidence: r.metadata?.evidence ? JSON.parse(r.metadata.evidence as string) : [],
        timestamp: new Date(r.metadata?.timestamp as string || Date.now()),
        sourceInteractionId: r.metadata?.interactionId as string || '',
        relevanceScore: r.score
      })).sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (e: any) {
      if (e.message?.includes('fetch failed')) {
        console.log('HINDSIGHT: NOT CONFIGURED');
      } else {
        console.error('[Hindsight] Failed to get all memories', e);
      }
      return [];
    }
  }

  async reflectDealContext(dealId: string): Promise<string | null> {
    if (!this.hindsight) {
      console.log('HINDSIGHT: NOT CONFIGURED');
      return null;
    }
    try {
      const query = "Synthesize this deal's evolution. What changed over time? What became more important? What remains unresolved? Provide a brief summary based on historical context. Return concise evidence-backed conclusions. Do not expose chain-of-thought.";
      const response = await this.hindsight.reflect(getBankId(dealId), query);
      return (response as any).text || (response as any).content || null;
    } catch (e: any) {
      if (e.message?.includes('fetch failed')) {
        console.log('HINDSIGHT: NOT CONFIGURED');
      } else {
        console.error('[Hindsight] Failed to reflect deal context', e);
      }
      return null;
    }
  }
}
