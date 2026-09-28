import { randomUUID } from 'crypto';

export const generateId = (prefix: string = '') => {
  return `${prefix}${randomUUID().replace(/-/g, '')}`;
};
