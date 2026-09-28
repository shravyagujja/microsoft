import { getHindsightClient, getBankId } from './src/services/hindsight/hindsight.client';

async function runAcmeMemory() {
  const client = getHindsightClient();
  if (!client) {
    console.log('HINDSIGHT: NOT CONFIGURED');
    return;
  }
  
  const bankId = getBankId('pulse-demo');
  console.log(`Using bank: ${bankId}`);

  const interactions = [
    { type: 'meeting', content: 'SSO is mandatory.', source: 'zoom' },
    { type: 'email', content: 'We need deployment within 30 days.', source: 'email' },
    { type: 'call', content: 'SSO isn\'t our biggest concern anymore. Deployment is.', source: 'phone' },
    { type: 'email', content: 'I\'ll send you the deployment plan tomorrow.', source: 'sales-rep' },
    { type: 'email', content: 'Can you actually guarantee the 30-day deployment?', source: 'customer' }
  ];

  try {
    for (const [index, data] of interactions.entries()) {
      await client.retain(bankId, data.content, {
        metadata: {
          interactionId: `demo-int-${index}`,
          category: data.type,
          timestamp: new Date().toISOString()
        }
      });
      console.log(`Retained: ${data.content}`);
    }
    console.log('RETAIN: PASS');
  } catch (e: any) {
    console.log('RETAIN: FAIL -', e.message);
  }

  try {
    const memories = await client.recall(bankId, 'What are the customer requirements and priorities?', { maxTokens: 1000 });
    console.log('RECALL: PASS', memories);
  } catch (e: any) {
    console.log('RECALL: FAIL -', e.message);
  }

  try {
    const query = "Synthesize this deal's evolution. What changed over time? What became more important? What remains unresolved? Provide a brief summary based on historical context. Return concise evidence-backed conclusions. Do not expose chain-of-thought.";
    const reflection = await client.reflect(bankId, query);
    console.log('REFLECT: PASS');
    console.log('Reflection Result:', (reflection as any).text || (reflection as any).content);
    console.log('ACME MEMORY: PASS');
  } catch (e: any) {
    console.log('REFLECT: FAIL -', e.message);
    console.log('ACME MEMORY: FAIL');
  }
}

runAcmeMemory();
