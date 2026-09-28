import { apiClient } from './client';
import type { Deal, DealAnalysis, Interaction, Memory, Risk, ResponseDraft } from '../types';
import { DEMO_DEAL, DEMO_ANALYSIS } from '../data/demoData';

export const fetchDeals = async (): Promise<Deal[]> => {
  const { data, error } = await apiClient.get<Deal[]>('/deals');
  if (error || !data) {
    return [DEMO_DEAL];
  }
  return data;
};

export const fetchDeal = async (dealId: string): Promise<Deal | null> => {
  const { data, error } = await apiClient.get<Deal>(`/deals/${dealId}`);
  if (error || !data) {
    return DEMO_DEAL;
  }
  return data;
};

export const fetchDealAnalysis = async (dealId: string): Promise<DealAnalysis | null> => {
  const { data, error } = await apiClient.get<DealAnalysis>(`/deals/${dealId}/analysis`);
  if (error || !data) {
    return DEMO_ANALYSIS;
  }
  return data;
};

export const fetchTimeline = async (dealId: string) => {
  const { data, error } = await apiClient.get<Interaction[]>(`/deals/${dealId}/timeline`);
  return { data, error };
};

export const fetchMemories = async (dealId: string) => {
  const { data, error } = await apiClient.get<Memory[]>(`/deals/${dealId}/memory`);
  return { data, error };
};

export const fetchRisks = async (dealId: string) => {
  const { data, error } = await apiClient.get<Risk[]>(`/deals/${dealId}/risks`);
  return { data, error };
};

export const fetchLearning = async (dealId: string) => {
  const { data, error } = await apiClient.get<any>(`/deals/${dealId}/learning`);
  return { data, error };
};

export const addInteraction = async (dealId: string, interaction: any) => {
  return apiClient.post<any>(`/deals/${dealId}/interactions`, interaction);
};

export const analyzeDeal = async (dealId: string) => {
  return apiClient.post<DealAnalysis>(`/deals/${dealId}/analyze`, {});
};

export const generateResponse = async (dealId: string, payload: any) => {
  return apiClient.post<ResponseDraft>(`/deals/${dealId}/respond`, payload);
};

export const seedDemo = async () => {
  return apiClient.post(`/demo/seed`, {});
};
