'use client'

import { useEffect, useRef } from 'react'

/**
 * SpatialAudio
 * A headless component that generates procedural sub-bass audio using the Web Audio API.
 * The frequency responds to scroll velocity, and the stereo panning tracks the mouse X coordinate.
 */
export function SpatialAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    const initAudio = () => {
      if (isInitialized.current) return
      isInitialized.current = true

      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioCtxRef.current = ctx

        // Create oscillator (Low hum / dark matter frequency)
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = 55 // 55Hz (Low A) - very subtle
        oscRef.current = osc

        // Create Panner
        const panner = ctx.createStereoPanner()
        pannerRef.current = panner

        // Create Gain (Volume) - start at 0
        const gain = ctx.createGain()
        gain.gain.value = 0
        gainRef.current = gain

        // Connect graph
        osc.connect(panner)
        panner.connect(gain)
        gain.connect(ctx.destination)

        osc.start()

        // Fade in slowly to a very low volume
        gain.gain.setTargetAtTime(0.015, ctx.currentTime, 2)
      } catch (e) {
        // Web Audio not supported
      }

      // Remove listeners once initialized
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
      window.removeEventListener('touchstart', initAudio)
    }

    window.addEventListener('click', initAudio)
    window.addEventListener('keydown', initAudio)
    window.addEventListener('touchstart', initAudio)

    return () => {
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
      window.removeEventListener('touchstart', initAudio)
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  // Track mouse for panning and scroll for frequency
  useEffect(() => {
    let lastScrollY = window.scrollY
    let scrollTimeout: NodeJS.Timeout
    
    const handleMove = (e: MouseEvent) => {
      if (!pannerRef.current || !audioCtxRef.current) return
      
      // Map mouse X (0 to innerWidth) to Panner (-1 to 1)
      const pan = (e.clientX / window.innerWidth) * 2 - 1
      
      // Smoothly update pan
      pannerRef.current.pan.setTargetAtTime(pan, audioCtxRef.current.currentTime, 0.1)
    }

    const handleScroll = () => {
      if (!oscRef.current || !audioCtxRef.current) return
      
      const currentScrollY = window.scrollY
      const velocity = Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY

      // Increase frequency slightly based on scroll velocity (55Hz to 85Hz)
      const targetFreq = Math.min(55 + (velocity * 0.8), 85)
      
      oscRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.05)
      
      // Return to base frequency after scroll stops
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (oscRef.current && audioCtxRef.current) {
          oscRef.current.frequency.setTargetAtTime(55, audioCtxRef.current.currentTime, 0.5)
        }
      }, 100)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return null
}
