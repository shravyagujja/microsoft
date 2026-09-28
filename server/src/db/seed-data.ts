import { prisma } from './client';

export const seedExtraDeals = async () => {
  const extraDeals = [
    { id: 'deal-2', customerName: 'Microsoft', value: 1200000, stage: 'Negotiation', concern: 'Integration with legacy systems', risk: 'high', priority: 'Security compliance' },
    { id: 'deal-3', customerName: 'Salesforce', value: 850000, stage: 'Proposal', concern: 'Data migration timeframe', risk: 'medium', priority: 'Time to value' },
    { id: 'deal-4', customerName: 'Atlassian', value: 450000, stage: 'Discovery', concern: 'User adoption', risk: 'low', priority: 'Ease of use' },
    { id: 'deal-5', customerName: 'Adobe', value: 620000, stage: 'Negotiation', concern: 'Custom reporting', risk: 'medium', priority: 'Analytics depth' },
    { id: 'deal-6', customerName: 'Shopify', value: 290000, stage: 'Proposal', concern: 'API rate limits', risk: 'high', priority: 'Scalability' },
    { id: 'deal-7', customerName: 'HubSpot', value: 380000, stage: 'Discovery', concern: 'Training costs', risk: 'low', priority: 'Support SLA' },
    { id: 'deal-8', customerName: 'Oracle', value: 1500000, stage: 'Negotiation', concern: 'Deployment models', risk: 'high', priority: 'On-prem availability' },
    { id: 'deal-9', customerName: 'ServiceNow', value: 950000, stage: 'Closed Won', concern: 'None', risk: 'low', priority: 'Implementation' },
    { id: 'deal-10', customerName: 'Slack', value: 520000, stage: 'Closed Lost', concern: 'Pricing model', risk: 'high', priority: 'Cost per seat' },
    { id: 'deal-11', customerName: 'Zoom', value: 410000, stage: 'Proposal', concern: 'Video quality', risk: 'medium', priority: 'Reliability' },
    { id: 'deal-12', customerName: 'Dropbox', value: 340000, stage: 'Discovery', concern: 'Storage limits', risk: 'low', priority: 'File sizes' },
  ];

  for (const d of extraDeals) {
    await prisma.deal.create({
      data: {
        id: d.id,
        customerName: d.customerName,
        value: d.value,
        currency: 'USD',
        stage: d.stage
      }
    });

    const interactionId = d.id + '-int-1';
    await prisma.interaction.create({
      data: {
        id: interactionId,
        dealId: d.id,
        type: 'meeting',
        content: `Customer asked about ${d.concern}. They stated that ${d.priority} is their main priority now.`,
        source: 'zoom',
        occurredAt: new Date(),
        processingStatus: 'completed'
      }
    });

    if (d.risk === 'high' || d.risk === 'medium') {
      await prisma.risk.create({
        data: {
          dealId: d.id,
          category: 'Implementation',
          title: `Concern over ${d.concern}`,
          description: `Customer explicitly raised ${d.concern} as a blocker.`,
          severity: d.risk,
          evidence: `Customer asked about ${d.concern}`,
          sourceInteractionIds: interactionId
        }
      });
      await prisma.priorityShift.create({
        data: {
          dealId: d.id,
          fromPriority: 'General Features',
          toPriority: d.priority,
          reason: `Customer stated ${d.priority} is their main priority.`,
          detectedAt: new Date(),
          evidence: `They stated that ${d.priority} is their main priority now.`,
          confidence: 'high'
        }
      });
    }

    if (d.risk === 'high') {
      await prisma.commitment.create({
        data: {
          dealId: d.id,
          action: `Provide detailed technical review on ${d.concern}`,
          owner: 'Sales Engineer',
          dueDate: new Date(Date.now() + 86400000 * 2), // 2 days
          status: 'Promised',
          sourceInteractionId: interactionId,
          evidence: `Customer asked about ${d.concern}`
        }
      });
    }
  }
};
