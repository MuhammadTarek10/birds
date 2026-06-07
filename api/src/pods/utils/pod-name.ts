const capitalize = (s: string): string =>
  s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);

export const emailLocalPart = (email: string): string =>
  email.split('@')[0] ?? email;

export const derivePodName = (seed: string): string => {
  const cleaned = seed.trim();
  if (cleaned.length === 0) return 'My memories';
  return `${capitalize(cleaned)}'s memories`;
};
