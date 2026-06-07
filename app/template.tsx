'use client'

/**
 * app/template.tsx
 *
 * Next.js App Router Template — re-mounts on every navigation.
 * This is the correct mechanism for page transitions in the App Router.
 * Unlike layout.tsx which persists, template.tsx creates a new instance
 * on every route change, triggering AnimatePresence exit animations.
 *
 * Transition: current page fades + slides up (exit), new page fades + slides in from bottom.
 * Duration: 380ms exponential out — feels instant but not jarring.
 */

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
