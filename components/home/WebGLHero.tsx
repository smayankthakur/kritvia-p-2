'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366F1"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function NeuralNetwork() {
  const ref = useRef<THREE.Group>(null);
  
  // Create nodes for neural network visualization
  const nodes = useMemo((): [number, number, number][] => {
    const nodePositions: [number, number, number][] = [];
    const layers = [4, 6, 6, 4];
    const spacing = 1.5;
    const layerSpacing = 3;
    
    layers.forEach((nodeCount, layerIndex) => {
      for (let i = 0; i < nodeCount; i++) {
        const y = (i - (nodeCount - 1) / 2) * spacing;
        const x = (layerIndex - (layers.length - 1) / 2) * layerSpacing;
        nodePositions.push([x, y, 0]);
      }
    });
    return nodePositions;
  }, []);

  // Create connections between nodes
  const connections = useMemo((): [number, number][] => {
    const conns: [number, number][] = [];
    const layers = [4, 6, 6, 4];
    let nodeIndex = 0;
    
    layers.forEach((nodeCount, layerIndex) => {
      if (layerIndex < layers.length - 1) {
        const nextLayerStart = nodeIndex + nodeCount;
        for (let i = 0; i < nodeCount; i++) {
          for (let j = 0; j < layers[layerIndex + 1]; j++) {
            if (Math.random() > 0.3) {
              conns.push([nodeIndex + i, nextLayerStart + j]);
            }
          }
        }
      }
      nodeIndex += nodeCount;
    });
    return conns;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ref} position={[0, 0, -2]}>
      {/* Nodes */}
      {nodes.map((pos, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={pos as [number, number, number]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={i < 4 ? "#22D3EE" : i < 10 ? "#6366F1" : "#A78BFA"}
              emissive={i < 4 ? "#22D3EE" : i < 10 ? "#6366F1" : "#A78BFA"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function AnimatedGradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#6366F1') },
    uColor2: { value: new THREE.Color('#22D3EE') },
    uColor3: { value: new THREE.Color('#A78BFA') },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      float t = uTime * 0.2;
      
      vec3 color = mix(uColor1, uColor2, sin(uv.x * 3.0 + t) * 0.5 + 0.5);
      color = mix(color, uColor3, sin(uv.y * 2.0 + t * 0.5) * 0.5 + 0.5);
      
      float dist = length(uv - 0.5);
      color *= 1.0 - dist * 0.5;
      
      gl_FragColor = vec4(color, 0.03);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[15, 15, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function WebGLHero() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22D3EE" />
        
        <ParticleField />
        <NeuralNetwork />
        <AnimatedGradientMesh />
      </Canvas>
    </div>
  );
}
