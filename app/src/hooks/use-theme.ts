import { useCallback, useEffect, useState } from 'react'
import type { ThemePreference } from '#/lib/theme'
import { applyTheme, getStoredTheme, resolveTheme } from '#/lib/theme'

export const useTheme = () => {
  const [pref, setPref] = useState<ThemePreference>(getStoredTheme)

  const setTheme = useCallback((next: ThemePreference) => {
    applyTheme(next)
    setPref(next)
  }, [])

  const toggle = useCallback(() => {
    const resolved = resolveTheme(pref)
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [pref, setTheme])

  // Keep in sync if OS preference changes while pref === 'system'
  useEffect(() => {
    if (pref !== 'system') return
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setPref('system') // re-render with same pref, CSS handles it
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [pref])

  return { pref, resolved: resolveTheme(pref), setTheme, toggle }
}
