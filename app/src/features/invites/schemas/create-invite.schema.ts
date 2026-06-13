import { z } from 'zod'

export const EXPIRY_OPTIONS = [
  { label: '24 hours', value: 24 },
  { label: '7 days', value: 168 },
  { label: '30 days', value: 720 },
] as const

export const createInviteSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  expiresInHours: z.union([z.literal(24), z.literal(168), z.literal(720)]),
})

export type CreateInviteInput = z.infer<typeof createInviteSchema>
