import { useState, useEffect } from 'react';
import { fetchDeals } from '../api/deals';
import type { Deal } from '../types';

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchDeals();
      setDeals(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return { deals, loading };
};
