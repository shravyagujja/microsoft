import { useState, useEffect } from 'react';
import { fetchDeal } from '../api/deals';
import type { Deal } from '../types';

export const useDeal = (dealId: string) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchDeal(dealId);
      setDeal(data);
      setLoading(false);
    };
    if (dealId) {
      loadData();
    }
  }, [dealId]);

  return { deal, loading };
};
