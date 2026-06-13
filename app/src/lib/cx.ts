export type ClassValue = string | false | null | undefined

export const cx = (...args: Array<ClassValue>): string =>
  args.filter(Boolean).join(' ')
