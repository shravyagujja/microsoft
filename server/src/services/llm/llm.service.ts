import { generateText, generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '../../config/env';
import { LLMProvider, ExtractionResult } from './llm.provider';
import { 
  extractionSchema, 
  priorityShiftSchema, 
  dealRiskSchema, 
  responseGenerationSchema, 
  historicalInsightSchema 
} from '../../nlp/extraction.schema';

const google = createGoogleGenerativeAI({
  apiKey: env.LLM_API_KEY || 'MOCK_KEY',
});

export class GeminiService implements LLMProvider {
  private model = google(env.LLM_MODEL || 'gemini-2.5-flash');

  async extractInteraction(content: string, type: string, historicalContext: string): Promise<ExtractionResult> {
    if (!env.LLM_API_KEY) {
      console.warn('[LLM Mock] Extracting interaction using mock fallback.');
      return {
        requirements: [{ title: 'Mock Req', description: 'MOCK (No API Key)', evidence: content.substring(0, 50) }],
        objections: [],
        stakeholders: [],
        commitments: [],
        prioritySignals: [],
        dealRisks: [],
        outcomes: []
      };
    }
    const prompt = `
You are a B2B sales intelligence agent. Extract structured information from the following ${type} interaction.

HISTORICAL CONTEXT:
${historicalContext}

CURRENT INTERACTION:
${content}

Identify requirements, objections, stakeholders, commitments, priority signals, outcomes, and risks.
Also compare the HISTORICAL CONTEXT with the CURRENT INTERACTION to detect if there is a major shift in the customer's primary focus (priorityShift).
Only include information explicitly present or highly probable based on the interaction. Do not invent details.
If dates are ambiguous, return null. Ensure evidence exactly matches the text.
    `;

    try {
      const { object } = await generateObject({
        model: this.model,
        schema: extractionSchema,
        prompt,
      });
      return object as ExtractionResult;
    } catch (e: any) {
      if (e?.statusCode === 429 || e?.message?.includes('429') || e?.message?.includes('quota') || e?.message?.includes('demand')) {
        throw new Error('LLM API Rate Limit / Quota Exceeded (429/503). Please wait and try again later.');
      }
      throw e;
    }
  }

  async detectPriorityShift(currentSignals: any[], historicalSignals: any[], customerStatements: string[]): Promise<any | null> {
    if (!env.LLM_API_KEY) {
      console.warn('[LLM Mock] Detecting priority shift using mock fallback.');
      return null;
    }
    const prompt = `
Given these historical priority signals, current priority signals, and explicit customer statements from a B2B deal, detect if there has been a major shift in the customer's primary focus.
Do NOT treat every newly mentioned topic as a priority shift. A shift implies a change in primary focus.
Only create a priority shift if evidence is sufficient.

HISTORICAL SIGNALS:
${JSON.stringify(historicalSignals, null, 2)}

CURRENT SIGNALS:
${JSON.stringify(currentSignals, null, 2)}

EXPLICIT CUSTOMER STATEMENTS:
${JSON.stringify(customerStatements, null, 2)}

Respond with JSON:
{
  "shiftDetected": boolean,
  "fromPriority": "string (optional)",
  "toPriority": "string (optional)",
  "reason": "string (optional)",
  "evidence": "string (optional)",
  "confidence": "high" | "medium" | "low" (optional)
}
    `;

    try {
      const { object } = await generateObject({
        model: this.model,
        schema: priorityShiftSchema,
        prompt,
      });
      if (object.shiftDetected && object.evidence) {
        return { 
          fromPriority: object.fromPriority, 
          toPriority: object.toPriority, 
          reason: object.reason,
          evidence: object.evidence,
          confidence: object.confidence || "medium"
        };
      }
      return null;
    } catch (e) {
      console.error('[LLM] Priority Shift Error', e);
      return null;
    }
  }

  async analyzeDealRisk(dealState: any, hindsightMemories: any[]): Promise<any> {
    if (!env.LLM_API_KEY) {
      console.warn('[LLM Mock] Analyzing deal risk using mock fallback.');
      return {
        currentRisk: { level: 'low', description: 'MOCK RISK (No API Key)' },
        reasoningSummary: 'MOCK (No API Key)',
        evidence: [],
        priorityEvolution: [],
        recommendedNextAction: { action: 'Mock Action', reasoning: 'MOCK' }
      };
    }
    const prompt = `
Analyze the risk of this B2B deal based on the current state and historical hindsight memories.

CURRENT STATE:
${JSON.stringify(dealState, null, 2)}

HISTORICAL MEMORIES:
${JSON.stringify(hindsightMemories, null, 2)}

Return a JSON object with this exact structure:
{
  "currentRisk": {
    "level": "high" | "medium" | "low",
    "description": "string"
  },
  "reasoningSummary": "string",
  "evidence": [{"description": "string", "memoryType": "string", "date": "ISO string"}],
  "priorityEvolution": [{"from": "string", "to": "string"}],
  "recommendedNextAction": {
    "action": "string",
    "reasoning": "string"
  }
}
    `;

    try {
      const { object } = await generateObject({
        model: this.model,
        schema: dealRiskSchema,
        prompt,
      });
      return object;
    } catch (e: any) {
      if (e?.statusCode === 429 || e?.message?.includes('429') || e?.message?.includes('quota') || e?.message?.includes('demand')) {
        throw new Error('LLM API Rate Limit / Quota Exceeded (429/503). Please wait and try again later.');
      }
      console.error('[LLM] Deal Risk Error', e);
      throw e;
    }
  }

  async generateResponse(dealState: any, recentInteraction: any, insights: any): Promise<{ draft: string; keyPoints: string[]; warnings: string[] }> {
    if (!env.LLM_API_KEY) {
      console.warn('[LLM Mock] Generating response using mock fallback.');
      return {
        draft: 'MOCK DRAFT RESPONSE (No API Key)',
        keyPoints: ['MOCK (No API Key)'],
        warnings: ['MOCK (No API Key)']
      };
    }
    const prompt = `
Generate a draft response to the customer for this deal.

RECENT INTERACTION:
${JSON.stringify(recentInteraction)}

DEAL STATE & INSIGHTS:
${JSON.stringify({ ...dealState, insights })}

Return JSON:
{
  "draft": "string",
  "keyPoints": ["string"],
  "warnings": ["string"]
}
    `;

    try {
      const { object } = await generateObject({
        model: this.model,
        schema: responseGenerationSchema,
        prompt,
      });
      return object;
    } catch (e: any) {
      if (e?.statusCode === 429 || e?.message?.includes('429') || e?.message?.includes('quota') || e?.message?.includes('demand')) {
        throw new Error('LLM API Rate Limit / Quota Exceeded (429/503). Please wait and try again later.');
      }
      console.error('[LLM] Generate Response Error', e);
      throw e;
    }
  }

  async generateHistoricalInsight(currentDealState: any, historicalCases: any[]): Promise<any> {
    if (!env.LLM_API_KEY) {
      console.warn('[LLM Mock] Generating historical insight using mock fallback.');
      return {
        pattern: 'MOCK PATTERN (No API Key)',
        supportingDeals: [],
        previousAction: 'MOCK',
        outcome: 'MOCK',
        relevance: 'MOCK',
        confidence: 'low'
      };
    }
    const prompt = `
Based on these historical deal cases and the current deal state, find historical patterns and generate an insight.
ONLY return this if actual historical evidence exists in the provided cases. Never fabricate historical examples.

CURRENT DEAL:
${JSON.stringify(currentDealState, null, 2)}

HISTORICAL CASES:
${JSON.stringify(historicalCases, null, 2)}

Return JSON:
{
  "pattern": "string",
  "supportingDeals": ["string"],
  "previousAction": "string",
  "outcome": "string",
  "relevance": "string",
  "confidence": "high" | "medium" | "low"
}
    `;

    try {
      const { object } = await generateObject({
        model: this.model,
        schema: historicalInsightSchema,
        prompt,
      });
      return object;
    } catch (e) {
      console.error('[LLM] Generate Insight Error', e);
      return null;
    }
  }
}
