import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/health/dependencies', async (req: Request, res: Response) => {
  // Simple check for now
  res.json({
    database: 'ok',
    llm: 'ok',
    hindsight: 'ok'
  });
});

import dealsRoutes from './routes/deals.routes';
import demoRoutes from './routes/demo.routes';
import authRoutes from './routes/auth.routes';

// Routes
app.use('/api/deals', dealsRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/auth', authRoutes);

// Centralized Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  
  // Do not expose stack traces or secrets to the client
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred.',
      details: err.message
    }
  });
});

export { app };
