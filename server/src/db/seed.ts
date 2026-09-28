import { seedDemo } from '../controllers/demo.controller';

const runSeed = async () => {
  console.log('[Seed] Script starting');
  // Mock req/res for the controller function
  const req = {} as any;
  const res = {
    json: (data: any) => console.log('[Seed] Result:', data),
    status: (code: number) => ({ json: (data: any) => console.error('[Seed] Error:', code, data) })
  } as any;
  
  await seedDemo(req, res);
  console.log('[Seed] Script finished');
};

runSeed().catch(console.error);
