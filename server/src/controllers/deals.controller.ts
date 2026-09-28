import { Request, Response } from 'express';
import { DealService } from '../services/deal.service';
import { GeminiService } from '../services/llm/llm.service';
import { InteractionService } from '../services/interaction.service';
import { HindsightService } from '../services/hindsight/hindsight.service';
import { LearningService } from '../services/learning.service';

const dealService = new DealService();
const interactionService = new InteractionService();
const hindsightService = new HindsightService();
const llmService = new GeminiService();
const learningService = new LearningService();

export const getDeals = async (req: Request, res: Response) => {
  try {
    const companyId = req.query.companyId as string | undefined;
    const deals = await dealService.getDeals(companyId === 'demo' ? null : companyId);
    const mappedDeals = deals.map((deal: any) => {
      const daysActive = Math.max(1, Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
      let riskLevel = 'low';
      if (deal.risks && deal.risks.some((r: any) => r.severity === 'high' || r.severity === 'High')) riskLevel = 'high';
      else if (deal.risks && deal.risks.some((r: any) => r.severity === 'medium' || r.severity === 'Medium')) riskLevel = 'medium';
      
      const currentConcern = deal.risks && deal.risks.length > 0 ? deal.risks[0].title : undefined;

      return {
        ...deal,
        daysActive,
        riskLevel,
        currentConcern,
        riskTrend: [1, 2, 3, 2, 4]
      };
    });
    res.json({ success: true, data: mappedDeals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const getDealById = async (req: Request, res: Response) => {
  try {
    const deal = await dealService.getDealById(req.params.dealId as string);
    if (!deal) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    const daysActive = Math.max(1, Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
    let riskLevel = 'low';
    if (deal.risks && deal.risks.some((r: any) => r.severity === 'high' || r.severity === 'High')) riskLevel = 'high';
    else if (deal.risks && deal.risks.some((r: any) => r.severity === 'medium' || r.severity === 'Medium')) riskLevel = 'medium';
    
    const currentConcern = deal.risks && deal.risks.length > 0 ? deal.risks[0].title : undefined;

    const mappedDeal = {
      ...deal,
      daysActive,
      riskLevel,
      currentConcern,
      riskTrend: [1, 2, 3, 2, 4]
    };

    res.json({ success: true, data: mappedDeal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const getDealTimeline = async (req: Request, res: Response) => {
  try {
    const interactions = await interactionService.getInteractions(req.params.dealId as string);
    res.json({ success: true, data: interactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const getDealMemory = async (req: Request, res: Response) => {
  try {
    const memories = await hindsightService.getAllMemories(req.params.dealId as string);
    res.json({ success: true, data: memories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const getDealRisks = async (req: Request, res: Response) => {
  try {
    const deal = await dealService.getDealById(req.params.dealId as string);
    if (!deal) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    res.json({ success: true, data: deal.risks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const getDealLearning = async (req: Request, res: Response) => {
  try {
    const deal = await dealService.getDealById(req.params.dealId as string);
    if (!deal) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    
    // Using learning service to find historical pattern based on current deal state
    const query = "Find historical deals with similar objections or requirements to help guide this deal.";
    const insight = await learningService.findHistoricalPattern(deal, query);
    
    res.json({ success: true, data: insight });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const createInteraction = async (req: Request, res: Response) => {
  try {
    const dealId = req.params.dealId as string;
    const { type, content, source } = req.body;
    
    if (!content) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Content is required' } });

    const result = await interactionService.processInteraction(dealId, { type, content, source });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const analyzeDeal = async (req: Request, res: Response) => {
  try {
    const deal = await dealService.getDealById(req.params.dealId as string);
    if (!deal) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    
    const memories = await hindsightService.getAllMemories(req.params.dealId as string);
    
    const analysis = await llmService.analyzeDealRisk(deal, memories);
    res.json({ success: true, data: analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const deal = await dealService.getDealById(req.params.dealId as string);
    if (!deal) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    
    const interactions = await interactionService.getInteractions(req.params.dealId as string);
    const recentInteraction = interactions[0];

    const response = await llmService.generateResponse(deal, recentInteraction, "Hindsight highlights risks.");
    res.json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};
