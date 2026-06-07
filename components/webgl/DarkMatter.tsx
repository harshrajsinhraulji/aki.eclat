'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Extremely optimized 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    // Smooth, slow breathing
    float noise = snoise(uv * 1.5 + uTime * 0.1);
    
    // Very subtle response to mouse
    float mouseDist = length(uv - uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);
    
    noise += mouseInfluence * 0.2;
    
    // Core color: #0A0306 but slightly varied based on noise
    vec3 baseColor = vec3(0.039, 0.012, 0.024); // approx #0A0306
    vec3 highlight = vec3(0.15, 0.04, 0.08);    // dark pink/red subtle glow
    
    vec3 finalColor = mix(baseColor, highlight, noise * 0.5);
    
    // Render the fog/blob
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function DarkMatter() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    }),
    [size] // Re-create if size changes significantly
  )

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = state.clock.elapsedTime
      
      // Update mouse - map from React Three Fiber coordinates (-1 to 1) to (0 to 1)
      mat.uniforms.uMouse.value.x = (state.pointer.x * 0.5) + 0.5
      mat.uniforms.uMouse.value.y = (state.pointer.y * 0.5) + 0.5
      
      // Update resolution continuously if changed (e.g. window resize)
      if (mat.uniforms.uResolution.value.x !== state.size.width || mat.uniforms.uResolution.value.y !== state.size.height) {
        mat.uniforms.uResolution.value.set(state.size.width, state.size.height)
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      {/* Massive screen quad to cover background at any distance */}
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}
