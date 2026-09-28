import { HindsightClient } from '@vectorize-io/hindsight-client';
import { env } from '../../config/env';

export const getHindsightClient = () => {
  if (!env.HINDSIGHT_BASE_URL) {
    if (process.env.USE_MOCK_HINDSIGHT === 'true') {
      return new HindsightClient({
        baseUrl: 'http://localhost:4000',
        apiKey: 'local-development-key',
      });
    }
    return null;
  }
  return new HindsightClient({
    baseUrl: env.HINDSIGHT_BASE_URL,
    apiKey: env.HINDSIGHT_API_KEY || '',
  });
};

export const getBankId = (dealId: string) => `${env.HINDSIGHT_BANK_PREFIX}${dealId}`;
