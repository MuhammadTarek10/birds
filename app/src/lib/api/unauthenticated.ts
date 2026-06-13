type Listener = () => void

const listeners = new Set<Listener>()

export const sessionEnded = {
  on(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  emit(): void {
    for (const l of listeners) l()
  },
}
