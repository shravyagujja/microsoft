import { app } from './app';
import { env } from './config/env';

const startServer = async () => {
  try {
    const port = env.PORT;
    
    app.listen(port, () => {
      console.log(`[Server] Deal Pulse AI backend running on port ${port}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

startServer();
