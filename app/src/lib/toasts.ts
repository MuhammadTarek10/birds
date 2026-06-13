import { toast as sonner } from 'sonner'

export const toast = {
  success: (eyebrow: string, message?: string) =>
    sonner(eyebrow, { description: message, className: 'toast toast--success' }),
  error: (eyebrow: string, message?: string) =>
    sonner(eyebrow, { description: message, className: 'toast toast--error' }),
  info: (eyebrow: string, message?: string) =>
    sonner(eyebrow, { description: message, className: 'toast toast--info' }),
}
