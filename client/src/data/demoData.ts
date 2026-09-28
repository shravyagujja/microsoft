import type { Deal, Interaction, Memory, Commitment, Stakeholder, DealAnalysis } from '../types';

export const DEMO_DEAL: Deal = {
  id: 'd_1',
  customerName: 'Acme Corporation',
  value: 120000,
  stage: 'negotiation',
  daysActive: 42,
  riskLevel: 'high',
  currentConcern: 'Deployment commitment unresolved',
  lastInteractionAt: new Date().toISOString(),
  riskTrend: [1, 2, 2, 4, 5],
};

export const DEMO_INTERACTIONS: Interaction[] = [
  {
    id: 'i_1',
    dealId: 'd_1',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    week: 1,
    day: 1,
    type: 'meeting',
    speaker: 'Customer',
    source: 'Zoom',
    content: 'SSO is mandatory for us.',
    nlpTags: ['Requirement', 'Priority'],
  },
  {
    id: 'i_2',
    dealId: 'd_1',
    timestamp: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    week: 2,
    day: 1,
    type: 'email',
    speaker: 'Customer',
    source: 'Gmail',
    content: 'We also need deployment within 30 days.',
    nlpTags: ['Requirement', 'Concern'],
  },
  {
    id: 'i_3',
    dealId: 'd_1',
    timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    week: 3,
    day: 2,
    type: 'call',
    speaker: 'Customer',
    source: 'Phone',
    content: 'SSO isn\'t our biggest concern anymore. Deployment is.',
    nlpTags: ['Priority Shift'],
  },
  {
    id: 'i_4',
    dealId: 'd_1',
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    week: 4,
    day: 3,
    type: 'email',
    speaker: 'Salesperson',
    source: 'Gmail',
    content: 'I\'ll send you the deployment plan tomorrow.',
    nlpTags: ['Commitment'],
  },
  {
    id: 'i_5',
    dealId: 'd_1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    week: 5,
    day: 4,
    type: 'meeting',
    speaker: 'Customer',
    source: 'Zoom',
    content: 'Can you actually guarantee the 30-day deployment?',
    nlpTags: ['Repeated concern', 'Current priority', 'Potential risk'],
  },
];

export const DEMO_MEMORIES: Memory[] = [
  {
    id: 'm_1',
    dealId: 'd_1',
    category: 'requirement',
    summary: 'SSO is mandatory',
    timestamp: DEMO_INTERACTIONS[0].timestamp,
    sourceInteractionId: 'i_1',
    evidence: ['Customer stated SSO is mandatory in Week 1'],
  },
  {
    id: 'm_2',
    dealId: 'd_1',
    category: 'requirement',
    summary: '30-day deployment required',
    timestamp: DEMO_INTERACTIONS[1].timestamp,
    sourceInteractionId: 'i_2',
    evidence: ['Customer requested deployment within 30 days in Week 2'],
  },
  {
    id: 'm_3',
    dealId: 'd_1',
    category: 'priority_change',
    summary: 'Deployment is now the primary concern, displacing SSO',
    timestamp: DEMO_INTERACTIONS[2].timestamp,
    sourceInteractionId: 'i_3',
    evidence: ['Customer explicitly stated SSO is no longer biggest concern, Deployment is (Week 3)'],
  }
];

export const DEMO_COMMITMENTS: Commitment[] = [
  {
    id: 'c_1',
    dealId: 'd_1',
    description: 'Deployment plan',
    owner: 'Salesperson',
    createdAt: DEMO_INTERACTIONS[3].timestamp,
    dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'promised',
  }
];

export const DEMO_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 's_1',
    name: 'CTO',
    role: 'Technical Evaluator',
    concerns: ['Security', 'SSO'],
    sourceInteractionIds: ['i_1'],
  },
  {
    id: 's_2',
    name: 'Engineering Lead',
    role: 'Implementation',
    concerns: ['Deployment', 'Reliability'],
    sourceInteractionIds: ['i_2', 'i_3', 'i_5'],
  }
];

export const DEMO_ANALYSIS: DealAnalysis = {
  dealId: 'd_1',
  currentRisk: {
    level: 'high',
    description: 'Deployment commitment unresolved'
  },
  reasoningSummary: 'Deployment has become the dominant customer concern and a previously promised deployment plan has not been confirmed as completed.',
  evidence: [
    {
      interactionId: 'i_2',
      date: DEMO_INTERACTIONS[1].timestamp,
      memoryType: 'requirement',
      description: 'Deployment mentioned in Week 2'
    },
    {
      interactionId: 'i_3',
      date: DEMO_INTERACTIONS[2].timestamp,
      memoryType: 'priority_change',
      description: 'Customer increased deployment priority in Week 3'
    },
    {
      interactionId: 'i_4',
      date: DEMO_INTERACTIONS[3].timestamp,
      memoryType: 'commitment',
      description: 'Deployment plan promised in Week 4'
    },
    {
      interactionId: 'i_5',
      date: DEMO_INTERACTIONS[4].timestamp,
      memoryType: 'objection',
      description: 'Customer asked about deployment again in Week 5'
    }
  ],
  priorityEvolution: [
    {
      from: 'SSO',
      to: 'Deployment',
      description: 'Customer shifted focus away from SSO toward deployment speed and reliability.'
    }
  ],
  recommendedNextAction: {
    action: 'Address deployment feasibility before discussing pricing.',
    reasoning: 'Based on current priorities, unresolved commitments, and relevant historical patterns.'
  },
  historicalLearning: {
    id: 'h_1',
    pattern: 'Security objection',
    similarCasesCount: 3,
    outcomes: [
      { description: 'progressed after technical documentation', count: 2 },
      { description: 'stalled after a generic response', count: 1 }
    ],
    suggestedApproach: 'Consider providing technical documentation and involving the technical stakeholder.'
  }
};
