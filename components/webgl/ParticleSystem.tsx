'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 25000

/**
 * ParticleSystem
 * A vast array of 25,000 particles orbiting the screen.
 * They use AdditiveBlending for a massive glowing effect.
 */
export function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null)
  
  // Custom Shader to handle fluid-like organic movement on the GPU
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Precompute initial positions (a massive loose torus/sphere)
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 4 + Math.random() * 12
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(Math.random() * 2 - 1)
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  }, [])

  // Colors (mix of hot pink and gold)
  const colors = useMemo(() => {
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const color1 = new THREE.Color('#FF1493') // Hot pink
    const color2 = new THREE.Color('#C9A465') // Gold
    const color3 = new THREE.Color('#FFFFFF') // White

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const rand = Math.random()
      let mixedColor = color1
      if (rand > 0.7) mixedColor = color2
      if (rand > 0.95) mixedColor = color3
      
      col[i * 3] = mixedColor.r
      col[i * 3 + 1] = mixedColor.g
      col[i * 3 + 2] = mixedColor.b
    }
    return col
  }, [])

  // Random phase offsets for each particle
  const randoms = useMemo(() => {
    const r = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      r[i] = Math.random()
    }
    return r
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) }
  }), [])

  const vertexShader = `
    uniform float uTime;
    uniform vec3 uMouse;
    attribute vec3 color;
    attribute float aRandom;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec3 pos = position;
      
      // Organic floating motion
      pos.x += sin(uTime * 0.5 + aRandom * 10.0) * 0.2;
      pos.y += cos(uTime * 0.3 + aRandom * 10.0) * 0.2;
      pos.z += sin(uTime * 0.4 + aRandom * 10.0) * 0.2;
      
      // Mouse repulsion
      float dist = distance(pos.xy, uMouse.xy * 10.0);
      if(dist < 2.0) {
        vec2 dir = normalize(pos.xy - (uMouse.xy * 10.0));
        pos.xy += dir * (2.0 - dist) * 0.5;
      }
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Size attenuation
      gl_PointSize = (15.0 * aRandom + 5.0) * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec3 vColor;
    
    void main() {
      // Circular soft particle
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      // Soft glow edge
      float alpha = smoothstep(0.5, 0.1, dist) * 0.6;
      
      gl_FragColor = vec4(vColor, alpha);
    }
  `

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return
    
    // Slow, majestic rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.02
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5

    // Update uniforms
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    
    // Mouse coords from -1 to 1
    materialRef.current.uniforms.uMouse.value.x = state.pointer.x
    materialRef.current.uniforms.uMouse.value.y = state.pointer.y
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
