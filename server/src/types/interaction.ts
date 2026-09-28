export interface Interaction {
  id: string;
  dealId: string;
  type: string;
  content: string;
  source: string;
  occurredAt: Date;
  createdAt: Date;
  processingStatus: string;
}

export interface Stakeholder {
  id: string;
  dealId: string;
  name: string;
  role: string;
  organization: string;
  influence: string;
  sentiment: string;
}

export interface Requirement {
  id: string;
  dealId: string;
  title: string;
  description: string;
  status: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  evidence: string;
}

export interface Objection {
  id: string;
  dealId: string;
  title: string;
  description: string;
  status: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  evidence: string;
}

export interface Commitment {
  id: string;
  dealId: string;
  action: string;
  owner: string;
  dueDate: Date | null;
  status: 'Promised' | 'Due' | 'Completed' | 'Overdue' | 'Cancelled' | 'Unknown';
  sourceInteractionId: string;
  evidence: string;
}

export interface PriorityShift {
  id: string;
  dealId: string;
  fromPriority: string;
  toPriority: string;
  detectedAt: Date;
  evidence: string;
  confidence: string;
}

export interface Risk {
  id: string;
  dealId: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  evidence: string;
  status: string;
}

export interface Outcome {
  id: string;
  dealId: string;
  type: string;
  description: string;
  interactionId: string;
  occurredAt: Date;
}
