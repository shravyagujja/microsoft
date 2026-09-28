import { GeminiService } from './src/services/llm/llm.service';

async function verifyLLM() {
  const llm = new GeminiService();
  console.log('--- STARTING LLM VERIFICATION ---');

  try {
    console.log('\n1. Testing extractInteraction...');
    const extraction = await llm.extractInteraction(
      'The customer said SSO is mandatory and wants to see a demo by next week.',
      'call',
      ''
    );
    console.log('extractInteraction: PASS', JSON.stringify(extraction, null, 2).substring(0, 200) + '...');
  } catch (e: any) {
    console.log('extractInteraction: FAIL -', e.message.replace(/AQ\.[a-zA-Z0-9_-]+/g, '<REDACTED_API_KEY>'));
  }

  try {
    console.log('\n2. Testing detectPriorityShift...');
    const shift = await llm.detectPriorityShift(
      [{ priority: 'Deployment', evidence: 'Need it now' }],
      [{ priority: 'SSO', evidence: 'Must have SSO' }],
      ['We really just care about deployment speed now.']
    );
    console.log('detectPriorityShift: PASS', shift);
  } catch (e: any) {
    console.log('detectPriorityShift: FAIL -', e.message.replace(/AQ\.[a-zA-Z0-9_-]+/g, '<REDACTED_API_KEY>'));
  }

  try {
    console.log('\n3. Testing analyzeDealRisk...');
    const risk = await llm.analyzeDealRisk(
      { stage: 'Negotiation', value: 100000 },
      [{ text: 'Customer is unsure about the timeline.' }]
    );
    console.log('analyzeDealRisk: PASS', JSON.stringify(risk, null, 2).substring(0, 200) + '...');
  } catch (e: any) {
    console.log('analyzeDealRisk: FAIL -', e.message.replace(/AQ\.[a-zA-Z0-9_-]+/g, '<REDACTED_API_KEY>'));
  }

  try {
    console.log('\n4. Testing generateResponse...');
    const response = await llm.generateResponse(
      { stage: 'Negotiation' },
      { type: 'email', content: 'Can we get a discount?' },
      { risk: 'High' }
    );
    console.log('generateResponse: PASS', JSON.stringify(response, null, 2).substring(0, 200) + '...');
  } catch (e: any) {
    console.log('generateResponse: FAIL -', e.message.replace(/AQ\.[a-zA-Z0-9_-]+/g, '<REDACTED_API_KEY>'));
  }

  try {
    console.log('\n5. Testing generateHistoricalInsight...');
    const insight = await llm.generateHistoricalInsight(
      { stage: 'Negotiation', objection: 'Pricing' },
      [{ summary: 'Another deal stalled on pricing but closed after offering 10% discount.' }]
    );
    console.log('generateHistoricalInsight: PASS', insight);
  } catch (e: any) {
    console.log('generateHistoricalInsight: FAIL -', e.message.replace(/AQ\.[a-zA-Z0-9_-]+/g, '<REDACTED_API_KEY>'));
  }
}

verifyLLM();
