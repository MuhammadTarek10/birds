export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'mv:theme'

export const getStoredTheme = (): ThemePreference => {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'system'
}

export const resolveTheme = (pref: ThemePreference): 'light' | 'dark' => {
  if (pref !== 'system') return pref
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const applyTheme = (pref: ThemePreference): void => {
  if (pref === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', pref)
  }
  try {
    if (pref === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, pref)
    }
  } catch {
    /* ignore */
  }
}
