import { z } from 'zod';

export const messageCreateSchema = z.object({
  userId: z.string(),
  text: z.string().transform((text) => text.trim()),
});

export type IMessageCreateSchema = z.infer<typeof messageCreateSchema>;
