export interface Deal {
  id: string;
  customerName: string;
  value: number;
  currency: string;
  stage: string;
  createdAt: Date;
  updatedAt: Date;
}
