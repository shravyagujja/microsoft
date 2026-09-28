process.env.HINDSIGHT_BASE_URL = 'http://localhost:8888';
process.env.HINDSIGHT_API_KEY = 'test';

import { getHindsightClient } from './src/services/hindsight/hindsight.client';

async function test() {
  const client = getHindsightClient();
  if (!client) {
    console.log('HINDSIGHT: NOT CONFIGURED');
    return;
  }
  
  try {
    await client.retain('test-bank', 'Test memory');
    console.log('HINDSIGHT: REAL');
  } catch (e: any) {
    if (e.message?.includes('ECONNREFUSED') || e.code === 'ECONNREFUSED' || e.cause?.code === 'ECONNREFUSED') {
      console.log('HINDSIGHT: NOT CONFIGURED (Connection Refused)');
    } else {
      console.log('HINDSIGHT: ERROR -', e.message);
    }
  }
}
test();
