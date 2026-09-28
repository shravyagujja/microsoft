import { z } from 'zod';

export const createInteractionSchema = z.object({
  body: z.object({
    type: z.string().min(1, 'Type is required'),
    content: z.string().min(1, 'Content is required'),
    source: z.string().min(1, 'Source is required')
  }),
  params: z.object({
    dealId: z.string().min(1)
  })
});

export const dealIdParamSchema = z.object({
  params: z.object({
    dealId: z.string().min(1)
  })
});
