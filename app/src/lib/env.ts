type Env = {
  VITE_API_URL: string
}

const required = (key: keyof Env): string => {
  const value = import.meta.env[key]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

export const env: Env = {
  VITE_API_URL: required('VITE_API_URL'),
}
