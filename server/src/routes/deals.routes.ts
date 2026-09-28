import { Router } from 'express';
import * as dealsController from '../controllers/deals.controller';
import { validateRequest } from '../utils/validation';
import { createInteractionSchema, dealIdParamSchema } from '../utils/schemas';

const router = Router();

router.get('/', dealsController.getDeals);
router.get('/:dealId', validateRequest(dealIdParamSchema), dealsController.getDealById);
router.get('/:dealId/timeline', validateRequest(dealIdParamSchema), dealsController.getDealTimeline);
router.get('/:dealId/memory', validateRequest(dealIdParamSchema), dealsController.getDealMemory);
router.get('/:dealId/risks', validateRequest(dealIdParamSchema), dealsController.getDealRisks);
router.get('/:dealId/learning', validateRequest(dealIdParamSchema), dealsController.getDealLearning);

router.post('/:dealId/interactions', validateRequest(createInteractionSchema), dealsController.createInteraction);
router.post('/:dealId/analyze', validateRequest(dealIdParamSchema), dealsController.analyzeDeal);
router.post('/:dealId/respond', validateRequest(dealIdParamSchema), dealsController.generateResponse);

export default router;
