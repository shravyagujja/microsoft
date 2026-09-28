import { Request, Response } from 'express';
import { prisma } from '../db/client';
import { InteractionService } from '../services/interaction.service';
import { LearningService } from '../services/learning.service';
import { seedExtraDeals } from '../db/seed-data';

const interactionService = new InteractionService();
const learningService = new LearningService();

export const seedDemo = async (req: Request, res: Response) => {
  try {
    console.log('[Seed] Starting demo seed...');
    
    // Clear existing data for demo
    await prisma.deal.deleteMany();

    const deal = await prisma.deal.create({
      data: {
        id: 'pulse-demo',
        customerName: 'Acme Corporation',
        value: 120000,
        currency: 'USD',
        stage: 'Negotiation',
      }
    });

    await seedExtraDeals();

    const interactions = [
      { type: 'meeting', content: 'SSO is mandatory.', source: 'zoom' },
      { type: 'email', content: 'We need deployment within 30 days.', source: 'email' },
      { type: 'call', content: 'SSO isn\'t our biggest concern anymore. Deployment is.', source: 'phone' },
      { type: 'email', content: 'I\'ll send you the deployment plan tomorrow.', source: 'sales-rep' },
      { type: 'email', content: 'Can you actually guarantee the 30-day deployment?', source: 'customer' }
    ];

    for (const [index, data] of interactions.entries()) {
      await interactionService.processInteraction(deal.id, data);
    }
    
    await learningService.recordDealLearning('historical-deal-1', 'Deal stalled when customer doubted deployment timeline without technical proof.', 'Stalled');
    await learningService.recordDealLearning('historical-deal-2', 'Providing a detailed deployment plan with SLA guarantees restored confidence and closed the deal quickly.', 'Closed Won');

    res.json({ success: true, data: deal });
  } catch (error: any) {
    console.error('[Seed] Error', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};
