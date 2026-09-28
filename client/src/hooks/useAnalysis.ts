import { useState, useEffect } from 'react';
import { fetchDealAnalysis } from '../api/deals';
import type { DealAnalysis } from '../types';

export const useAnalysis = (dealId: string) => {
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchDealAnalysis(dealId);
      setAnalysis(data);
      setLoading(false);
    };
    if (dealId) {
      loadData();
    }
  }, [dealId]);

  return { analysis, loading };
};
