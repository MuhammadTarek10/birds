import { z } from 'zod'

export const registerSchema = z.object({
  firstName: z.string().max(120).optional(),
  lastName: z.string().max(120).optional(),
  email: z.email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(128, 'At most 128 characters'),
  inviteToken: z.string().max(64).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const cleanRegisterPayload = (input: RegisterInput): RegisterInput => ({
  firstName: input.firstName?.trim() || undefined,
  lastName: input.lastName?.trim() || undefined,
  email: input.email,
  password: input.password,
  inviteToken: input.inviteToken?.trim() || undefined,
})
