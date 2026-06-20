export const memoryKeys = {
  all: (podId: string) => ['memories', podId] as const,
  detail: (id: string) => ['memories', 'detail', id] as const,
  comments: (memoryId: string) => ['memories', memoryId, 'comments'] as const,
}
