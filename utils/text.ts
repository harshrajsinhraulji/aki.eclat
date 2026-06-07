/**
 * Eradicates orphans and widows from a string of text.
 * It replaces the very last space in the string with a non-breaking space (&nbsp;).
 * This mathematically prevents the last word from wrapping onto a new line alone.
 */
export function eradicateOrphans(text: string): string {
  if (!text || text.length === 0) return text
  
  const lastSpaceIndex = text.lastIndexOf(' ')
  if (lastSpaceIndex === -1) return text // No spaces
  
  return text.substring(0, lastSpaceIndex) + '\u00A0' + text.substring(lastSpaceIndex + 1)
}
