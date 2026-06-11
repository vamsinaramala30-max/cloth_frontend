'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, PresentationControls } from '@react-three/drei';
import { useRef } from 'react';

// Workaround for react-three-fiber runtime crash:
// TypeError: Cannot read properties of undefined (reading 'S')
// Keeping pointer-events disabled and adding eventSource={false}
// prevents fiber from wiring up the problematic event system.
const FloatingProduct = () => {
  const mesh = useRef<any>(null);


  useFrame((state: any) => {



    if (!mesh.current) return;
    mesh.current.rotation.y += 0.0045;
    mesh.current.rotation.x = 0.1 + Math.sin(state.clock.elapsedTime * 0.35) * 0.05;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <Float floatIntensity={1.2} rotationIntensity={0.35} speed={2.5}>
      <mesh ref={mesh} castShadow receiveShadow>
        <torusKnotGeometry args={[1.05, 0.25, 182, 30]} />
        <meshPhysicalMaterial
          color="#39d8ff"
          metalness={0.95}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#121a29"
          emissiveIntensity={0.8}
        />
      </mesh>
    </Float>
  );
};

export const ThreeProductScene = () => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/80 shadow-2xl shadow-cyan-500/20 h-[520px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 38 }} shadows eventSource={false}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} color="#8d69ff" />
        <pointLight position={[-4, 2, -6]} intensity={0.9} color="#0bf" />

        <PresentationControls
          global
          config={{ mass: 1.4, tension: 120 }}
          snap={{ mass: 0.6, tension: 160 }}
          rotation={[0.15, 0.3, 0]}
          polar={[-0.5, 0.4]}
          azimuth={[-0.6, 0.6]}
        >
          <FloatingProduct />
        </PresentationControls>

        <ContactShadows position={[0, -1.2, 0]} opacity={0.65} width={6} blur={2.8} far={2.5} />
        <Environment preset="city" />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04),_transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-10 bottom-10 h-28 rounded-full bg-gradient-to-r from-cyan-400/10 via-transparent to-purple-400/10 blur-3xl" />
    </div>
  );
};

