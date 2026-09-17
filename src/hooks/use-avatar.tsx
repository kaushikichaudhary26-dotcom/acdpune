import { useMemo } from 'react';

/**
 * Hook to generate a DiceBear avatar URL
 * @param seed - Unique string (e.g., volunteer name)
 * @param style - DiceBear style (default: 'avataaars')
 * @param format - 'svg' or 'png' (default: 'svg')
 */
export function useAvatar(
  seed: string,
  style: string = 'avataaars',
  format: 'svg' | 'png' = 'svg'
): string {
  const avatarUrl = useMemo(() => {
    if (!seed) return '';

    return `https://api.dicebear.com/9.x/${style}/${format}?seed=${encodeURIComponent(
      seed
    )}&backgroundColor=transparent`;
  }, [seed, style, format]);

  return avatarUrl;
}
