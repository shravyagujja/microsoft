import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  LLM_PROVIDER: z.string().default('google'),
  LLM_MODEL: z.string().default('gemini-2.5-flash'),
  LLM_API_KEY: z.string().optional(),
  HINDSIGHT_BASE_URL: z.string().optional(),
  HINDSIGHT_API_KEY: z.string().optional(),
  HINDSIGHT_BANK_PREFIX: z.string().default('deal-'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
