'use client'

import { useEffect, useRef, useState } from 'react'

export function AmbientDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Get context with alpha optimization
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{ x: number, y: number, radius: number, vx: number, vy: number, alpha: number, maxAlpha: number }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      // Drastically reduce particle count for performance
      const count = window.innerWidth < 768 ? 12 : 25
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15 - 0.05, // Ultra slow upward drift
          alpha: Math.random(),
          maxAlpha: Math.random() * 0.3 + 0.05
        })
      }
    }

    const render = () => {
      // Clear canvas cleanly instead of trailing effect (trailing effect causes GPU overdraw lag)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const isLightMode = document.documentElement.getAttribute('data-theme') === 'light'
      const baseColor = isLightMode ? '0,0,0' : '255,255,255'

      ctx.fillStyle = `rgba(${baseColor}, 1)` // Set base color once

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Twinkle effect
        p.alpha += (Math.random() - 0.5) * 0.02
        if (p.alpha < 0) p.alpha = 0
        if (p.alpha > p.maxAlpha) p.alpha = p.maxAlpha

        // Fast circle drawing (no blur, no radial gradient)
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    // Passive event listener for performance
    window.addEventListener('resize', resize, { passive: true })
    resize()
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        // Removed filter: blur() which causes massive GPU lag on large canvas
        opacity: mounted ? 1 : 0,
        transition: 'opacity 2s ease-in-out'
      }}
    />
  )
}
