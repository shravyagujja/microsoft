export type MemoryCategory = 'requirement' | 'objection' | 'stakeholder' | 'commitment' | 'priority_change' | 'outcome';

export interface Memory {
  id: string;
  dealId: string;
  category: MemoryCategory;
  summary: string;
  timestamp: string;
  sourceInteractionId: string;
  evidence: string[];
}

export interface Commitment {
  id: string;
  dealId: string;
  description: string;
  owner: string;
  createdAt: string;
  dueDate: string;
  status: 'promised' | 'due' | 'completed' | 'overdue' | 'cancelled' | 'unknown';
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  concerns: string[];
  sourceInteractionIds: string[];
}
