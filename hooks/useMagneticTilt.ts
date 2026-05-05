'use client'

/**
 * hooks/useMagneticTilt.ts
 * Card magnetic tilt — feels like picking up a photograph.
 *
 * On mouse enter: calculates cursor offset from card centre.
 * Tilts card toward cursor: max 8deg X, max 6deg Y.
 * Shadow deepens toward --shadow-magnetic.
 * On mouse leave: springs back to 0,0 with overshoot.
 *
 * Returns refs and motion values to attach to the card element.
 */

import { useRef, useCallback } from 'react'
import {
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion'

interface MagneticTiltReturn {
  cardRef: React.RefObject<HTMLDivElement | null>
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  scale: MotionValue<number>
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function useMagneticTilt(
  maxRotateX = 8,
  maxRotateY = 6
): MagneticTiltReturn {
  const cardRef = useRef<HTMLDivElement | null>(null)

  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rawScale = useMotionValue(1)

  const rotateX = useSpring(rawRotateX, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(rawRotateY, { stiffness: 200, damping: 20 })
  const scale = useSpring(rawScale, { stiffness: 300, damping: 24 })

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const offsetX = e.clientX - centerX
      const offsetY = e.clientY - centerY

      // Normalise to -1 to 1 range
      const normalX = offsetX / (rect.width / 2)
      const normalY = offsetY / (rect.height / 2)

      // Tilt TOWARD cursor
      rawRotateY.set(normalX * maxRotateY)
      rawRotateX.set(-normalY * maxRotateX)
    },
    [rawRotateX, rawRotateY, maxRotateX, maxRotateY]
  )

  const onMouseEnter = useCallback(() => {
    rawScale.set(1.02)
  }, [rawScale])

  const onMouseLeave = useCallback(() => {
    rawRotateX.set(0)
    rawRotateY.set(0)
    rawScale.set(1)
  }, [rawRotateX, rawRotateY, rawScale])

  return {
    cardRef,
    rotateX,
    rotateY,
    scale,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  }
}
