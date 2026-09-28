import { HindsightService } from './src/services/hindsight/hindsight.service';

async function verifyMemory() {
  const service = new HindsightService();
  console.log('--- RECALL ---');
  const memories = await service.getAllMemories('pulse-demo');
  console.log(memories);
  
  console.log('\n--- REFLECT ---');
  const reflection = await service.reflectDealContext('pulse-demo');
  console.log(reflection);
}

verifyMemory();
