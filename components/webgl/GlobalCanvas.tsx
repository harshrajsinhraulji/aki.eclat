'use client'

import { Canvas } from '@react-three/fiber'
import { DarkMatter } from './DarkMatter'
import { ParticleSystem } from './ParticleSystem'

/**
 * GlobalCanvas
 * The GPU layer of the application. Sits perfectly behind the DOM.
 * pointer-events: none ensures it never blocks clicks.
 */
export function GlobalCanvas() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1, // Behind everything
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }} // Moved back to see particles
        gl={{ 
          alpha: true, 
          antialias: false, // Post-processing or low-res is better for shaders
          powerPreference: 'high-performance',
          stencil: false,
          depth: false
        }}
        dpr={[1, 1.5]} // Restrict maximum pixel ratio for mobile performance
      >
        {/* The Raymarching SDF background */}
        <group position={[0, 0, -14]}>
          <DarkMatter />
        </group>
        
        {/* The GPU Particle simulation */}
        <ParticleSystem />
      </Canvas>
    </div>
  )
}
