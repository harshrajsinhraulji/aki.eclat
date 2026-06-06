/**
 * lib/motion.ts
 * Centralised motion constants. Import from here — never define inline.
 * These values are science-backed and non-negotiable.
 */

/* ─────────────────────────────────────────────
   SPRING PHYSICS PRESETS
   Framer Motion spring configs
───────────────────────────────────────────── */

export const springs = {
  /** Component-level transitions. Subtle, premium feel. */
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 24,
  },

  /** Bouncy interactions — card lifts, bow. Slight overshoot. */
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 18,
  },

  /** Magnetic tilt — feels like picking up a photograph. */
  magnetic: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
  },

  /** Cursor inner dot — snappy response. */
  cursorSnap: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 30,
  },

  /** Cursor outer ring — lazy follow. */
  cursorLazy: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 20,
  },

  /** Bow drop on load. Bounces and settles. */
  bowDrop: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 12,
  },

  /** Letter magnetic tilt — independent per letter. */
  letterMagnetic: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 15,
  },

  /** Navbar slide-in. */
  navSlide: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 28,
  },
} as const

/* ─────────────────────────────────────────────
   DURATION PRESETS (milliseconds)
   Science-backed. Do not deviate.
───────────────────────────────────────────── */

export const durations = {
  micro: 0.1,       // 100ms — hover feedback
  fast: 0.15,       // 150ms — micro interactions
  component: 0.35,  // 350ms — component transitions
  section: 0.75,    // 750ms — section entrances
  page: 1.5,        // 1500ms — page-level choreography
  ambient: 3.0,     // 3000ms — ambient/idle
} as const

/* ─────────────────────────────────────────────
   EASING PRESETS
───────────────────────────────────────────── */

export const easings = {
  /** Things arriving — used for entering elements, expansions */
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Things arriving (alt, slightly softer — section entrances) */
  outExpoAlt: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Things moving through — scroll-linked, continuous */
  inOut: [0.87, 0, 0.13, 1] as [number, number, number, number],
  inOutQuart: [0.76, 0, 0.24, 1] as [number, number, number, number],
  /** Things moving through (smooth) — background transitions */
  inOutSmooth: [0.45, 0, 0.55, 1] as [number, number, number, number],
  /** Things building to something — slight overshoot (1.04×) */
  anticipation: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const

/* ─────────────────────────────────────────────
   STAGGER CONFIG
   80ms between siblings — the difference between
   designed and template.
───────────────────────────────────────────── */

export const stagger = {
  siblings: 0.08,    // 80ms
  fast: 0.05,        // 50ms — tight groups
  letter: 0.12,      // 120ms — loading screen letters
  nav: 0.04,         // 40ms — mobile nav links
} as const

/* ─────────────────────────────────────────────
   GSAP DEFAULT EASE STRINGS
───────────────────────────────────────────── */

export const gsapEase = {
  outExpo: 'power4.out',
  inOut: 'power3.inOut',
  elastic: 'elastic.out(1, 0.5)',
} as const

/* ─────────────────────────────────────────────
   LENIS CONFIG
───────────────────────────────────────────── */

export const lenisConfig = {
  duration: 1.4,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  touchMultiplier: 2,
  infinite: false,
} as const

/* ─────────────────────────────────────────────
   VARIANT PRESETS — Framer Motion variants
───────────────────────────────────────────── */

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.component, ease: easings.outExpo },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.component, ease: easings.outExpo },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.component, ease: easings.outExpo },
  },
}

export const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.siblings,
    },
  },
}

/* ─────────────────────────────────────────────
   REDUCED MOTION
   Components can call this once (not in render) to
   check if the user prefers reduced motion.
   When true, skip all choreography — use instant fades.
───────────────────────────────────────────── */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
