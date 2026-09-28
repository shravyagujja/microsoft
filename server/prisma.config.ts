import { env } from './src/config/env';
import { definePrismaConfig } from '@prisma/cli-engine';

export default definePrismaConfig({
  datasource: {
    url: env.DATABASE_URL
  }
});
