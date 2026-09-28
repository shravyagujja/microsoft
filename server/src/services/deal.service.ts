import { prisma } from '../db/client';

export class DealService {
  async getDeals(companyId?: string | null) {
    return prisma.deal.findMany({
      where: companyId === undefined ? undefined : { companyId: companyId },
      include: {
        risks: true,
        commitments: true,
        priorityShifts: true,
      }
    });
  }

  async getDealById(id: string) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        interactions: {
          orderBy: { occurredAt: 'asc' }
        },
        stakeholders: true,
        requirements: true,
        objections: true,
        commitments: true,
        priorityShifts: true,
        risks: true,
      }
    });
  }

  async createDeal(data: any) {
    return prisma.deal.create({
      data
    });
  }
}
