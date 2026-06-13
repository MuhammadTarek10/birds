import { z } from 'zod'

export const podNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Give your vault a name')
    .max(120, 'Keep it under 120 characters'),
})

export type PodNameInput = z.infer<typeof podNameSchema>
