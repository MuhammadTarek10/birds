import { z } from 'zod'

export const createMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date'),
  description: z.string().max(5000).optional(),
  location: z.string().max(200).optional(),
})

export type CreateMemoryInput = z.infer<typeof createMemorySchema>
