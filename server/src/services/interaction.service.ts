import { prisma } from '../db/client';
import { GeminiService } from './llm/llm.service';
import { HindsightService } from './hindsight/hindsight.service';

export class InteractionService {
  private llm = new GeminiService();
  private hindsight = new HindsightService();

  async processInteraction(dealId: string, data: { type: string, content: string, source: string }) {
    // 1. Store raw interaction
    const interaction = await prisma.interaction.create({
      data: {
        dealId,
        type: data.type,
        content: data.content,
        source: data.source,
        occurredAt: new Date(),
        processingStatus: 'processing'
      }
    });

    try {
      // 2. Recall historical context
      const historicalContextStr = "Previous requirements and objections..."; // simplified for now
      const historicalMemories = await this.hindsight.getAllMemories(dealId);
      
      // 3. LLM Extraction
      console.log('[NLP] Extracting interaction intelligence...');
      const extraction = await this.llm.extractInteraction(data.content, data.type, JSON.stringify(historicalMemories));
      
      // 4. Update DB State
      for (const req of extraction.requirements) {
        await prisma.requirement.create({
          data: { dealId, title: req.title, description: req.description, evidence: req.evidence, firstSeenAt: new Date(), lastSeenAt: new Date() }
        });
      }

      for (const obj of extraction.objections) {
        await prisma.objection.create({
          data: { dealId, title: obj.title, description: obj.description, evidence: obj.evidence, firstSeenAt: new Date(), lastSeenAt: new Date() }
        });
      }

      for (const com of extraction.commitments) {
        await prisma.commitment.create({
          data: { dealId, action: com.action, owner: com.owner, dueDate: com.dueDate, status: com.status, evidence: com.evidence, sourceInteractionId: interaction.id }
        });
      }

      // 5. Retain in Hindsight
      console.log('[Hindsight] Retaining interaction...');
      for (const req of extraction.requirements) {
        await this.hindsight.retainInteraction(dealId, interaction.id, `Requirement: ${req.title} - ${req.description}`, [req.evidence], 'Requirement');
      }
      for (const obj of extraction.objections) {
        await this.hindsight.retainInteraction(dealId, interaction.id, `Objection: ${obj.title} - ${obj.description}`, [obj.evidence], 'Objection');
      }
      for (const com of extraction.commitments) {
        await this.hindsight.retainInteraction(dealId, interaction.id, `Commitment: ${com.action} by ${com.owner}`, [com.evidence], 'Commitment');
      }
      for (const sig of extraction.prioritySignals) {
        await this.hindsight.retainInteraction(dealId, interaction.id, `Priority: ${sig.priority}`, [sig.evidence], 'Priority');
      }

      // 6. Detect Priority Shifts
      console.log('[RISK] Checking priority shifts (using combined extraction)...');
      const shift = extraction.priorityShift;
      
      if (shift && shift.shiftDetected) {
        await prisma.priorityShift.create({
          data: {
            dealId,
            fromPriority: shift.fromPriority || 'Unknown',
            toPriority: shift.toPriority || 'Unknown',
            reason: shift.reason || '',
            evidence: shift.evidence || '',
            confidence: shift.confidence || 'medium',
            detectedAt: new Date()
          }
        });
      }

      // 7. Analyze Risks
      console.log('[RISK] Re-evaluating deal...');
      // Save immediate risks extracted from this interaction
      for (const risk of extraction.dealRisks) {
         await prisma.risk.create({
           data: { dealId, category: risk.category, title: risk.title, description: risk.description, severity: risk.severity, evidence: risk.evidence, sourceInteractionIds: interaction.id }
         });
      }
      
      // Deterministic Rules
      const unresolvedCommitments = await prisma.commitment.findMany({ where: { dealId, status: { notIn: ['Completed', 'Cancelled'] } } });
      const unresolvedObjections = await prisma.objection.findMany({ where: { dealId, status: 'unresolved' } });
      
      if (unresolvedCommitments.length > 0) {
        for (const c of unresolvedCommitments) {
          // If due date passed or it's been a while (simplified check)
          await prisma.risk.create({
            data: { dealId, category: 'Commitment', title: `Unresolved: ${c.action}`, description: `Commitment by ${c.owner} remains unresolved.`, severity: 'medium', evidence: c.evidence, sourceInteractionIds: c.sourceInteractionId || interaction.id }
          });
        }
      }
      if (unresolvedObjections.length > 0) {
        for (const o of unresolvedObjections) {
          await prisma.risk.create({
            data: { dealId, category: 'Objection', title: `Unresolved Objection: ${o.title}`, description: o.description, severity: 'high', evidence: o.evidence, sourceInteractionIds: interaction.id }
          });
        }
      }

      // 8. Update interaction status
      await prisma.interaction.update({
        where: { id: interaction.id },
        data: { processingStatus: 'completed' }
      });

      return { success: true, extraction };

    } catch (error) {
      console.error('[InteractionService] Failed to process interaction', error);
      await prisma.interaction.update({
        where: { id: interaction.id },
        data: { processingStatus: 'failed' }
      });
      throw error;
    }
  }

  async getInteractions(dealId: string) {
    return prisma.interaction.findMany({
      where: { dealId },
      orderBy: { occurredAt: 'desc' }
    });
  }
}
