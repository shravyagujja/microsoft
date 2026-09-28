import { z } from 'zod';

export const extractionSchema = z.object({
  requirements: z.array(z.object({
    title: z.string(),
    description: z.string(),
    evidence: z.string(),
    conclusionType: z.enum(['FACT', 'INFERENCE', 'UNKNOWN']).describe('Identify if this is explicitly stated (FACT), inferred from context (INFERENCE), or unclear (UNKNOWN)')
  })),
  objections: z.array(z.object({
    title: z.string(),
    description: z.string(),
    evidence: z.string(),
    conclusionType: z.enum(['FACT', 'INFERENCE', 'UNKNOWN'])
  })),
  stakeholders: z.array(z.object({
    name: z.string(),
    role: z.string(),
    organization: z.string(),
    influence: z.string(),
    sentiment: z.string()
  })),
  commitments: z.array(z.object({
    action: z.string(),
    owner: z.string(),
    dueDate: z.string().nullable().describe('ISO Date string or null if unknown'),
    status: z.enum(['Promised', 'Due', 'Completed', 'Overdue', 'Cancelled', 'Unknown']),
    evidence: z.string(),
    conclusionType: z.enum(['FACT', 'INFERENCE', 'UNKNOWN'])
  })),
  prioritySignals: z.array(z.object({
    priority: z.string(),
    evidence: z.string(),
    confidence: z.enum(['high', 'medium', 'low']),
    conclusionType: z.enum(['FACT', 'INFERENCE', 'UNKNOWN'])
  })),
  outcomes: z.array(z.object({
    type: z.string(),
    description: z.string()
  })),
  dealRisks: z.array(z.object({
    category: z.string(),
    title: z.string(),
    description: z.string(),
    severity: z.enum(['high', 'medium', 'low']),
    evidence: z.string(),
    conclusionType: z.enum(['FACT', 'INFERENCE', 'UNKNOWN'])
  })),
  priorityShift: z.object({
    shiftDetected: z.boolean(),
    fromPriority: z.string().optional(),
    toPriority: z.string().optional(),
    reason: z.string().optional(),
    evidence: z.string().optional(),
    confidence: z.enum(['high', 'medium', 'low']).optional()
  }).optional().nullable()
});

export const priorityShiftSchema = z.object({
  shiftDetected: z.boolean(),
  fromPriority: z.string().optional(),
  toPriority: z.string().optional(),
  reason: z.string().optional(),
  evidence: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional()
});

export const dealRiskSchema = z.object({
  currentRisk: z.object({
    level: z.enum(['high', 'medium', 'low']),
    description: z.string()
  }),
  reasoningSummary: z.string(),
  evidence: z.array(z.object({
    description: z.string(),
    memoryType: z.string(),
    date: z.string()
  })),
  priorityEvolution: z.array(z.object({
    from: z.string(),
    to: z.string()
  })),
  recommendedNextAction: z.object({
    action: z.string(),
    reasoning: z.string()
  })
});

export const responseGenerationSchema = z.object({
  draft: z.string(),
  keyPoints: z.array(z.string()),
  warnings: z.array(z.string())
});

export const historicalInsightSchema = z.object({
  pattern: z.string(),
  supportingDeals: z.array(z.string()),
  previousAction: z.string(),
  outcome: z.string(),
  relevance: z.string(),
  confidence: z.enum(['high', 'medium', 'low'])
});
