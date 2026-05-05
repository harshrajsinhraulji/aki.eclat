import { Bodoni_Moda, Figtree, Instrument_Serif } from 'next/font/google'

/**
 * Bodoni Moda — Variable optical-size serif.
 * Display font. Extreme thick-thin contrast at large sizes.
 * Variable axes: wght (weight), opsz (optical size 6–96).
 * At hero: weight thin end, opsz 96 — ultra refined.
 * At section titles: opsz 48.
 *
 * Using weight: 'variable' to enable axis configuration.
 */
export const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni-moda',
  weight: '400',
})

/**
 * Figtree — Geometric sans with genuine warmth.
 * Unusually friendly for a geometric. High legibility.
 * Body: wght 300. Labels: wght 500 uppercase.
 */
export const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
  weight: ['300', '400', '500', '600', '700'],
})

/**
 * Instrument Serif — Ink quality, weight variation in strokes.
 * Feels handwritten without being informal.
 * Used EXCLUSIVELY for Aki's voice: "I can't, aneh",
 * poem excerpts, personal asides.
 * Italic style.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
})
