'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import type { Tech } from '@/types';
import type { Q3D } from './SceneCanvas';
import { Gold, GoldEnvironment } from './parts';

const ORBITS = [
  { r: 2.1, tilt: 0.35, speed: 0.16 },
  { r: 3.2, tilt: -0.5, speed: -0.11 },
  { r: 4.3, tilt: 0.85, speed: 0.08 },
];

/** Technologies orbit a gold core on three tilted rings. Labels are real DOM buttons (keyboard + screen-reader friendly). */
export default function TechConstellation({ techs, active, onSelect, q }: { techs: Tech[]; active: string | null; onSelect: (t: Tech | null) => void; q: Q3D }) {
  const rings = useRef<(THREE.Group | null)[]>([]);
  const paused = useRef(false);
  const groups = useMemo(() => ORBITS.map((_, oi) => techs.filter((_, i) => i % ORBITS.length === oi)), [techs]);

  useFrame((_, dt) => {
    if (paused.current) return;
    ORBITS.forEach((o, i) => { const g = rings.current[i]; if (g) g.rotation.y += dt * o.speed; });
  });

  return (
    <>
      <GoldEnvironment />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} intensity={30} color="#ffe9a8" />
      <mesh><icosahedronGeometry args={[0.8, 1]} /><Gold flatShading roughness={0.22} /></mesh>
      <mesh><icosahedronGeometry args={[1.2, 1]} /><meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.22} /></mesh>

      {ORBITS.map((o, oi) => (
        <group key={oi} rotation={[o.tilt, 0, oi === 1 ? 0.3 : 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[o.r, 0.006, 6, 160]} /><meshBasicMaterial color="#D4AF37" transparent opacity={0.35} /></mesh>
          <group ref={(g) => { rings.current[oi] = g; }}>
            {groups[oi].map((t, i) => {
              const a = (i / groups[oi].length) * Math.PI * 2 + oi;
              const on = active === t.name;
              return (
                <group key={t.name} position={[Math.cos(a) * o.r, 0, Math.sin(a) * o.r]}>
                  <mesh><sphereGeometry args={[on ? 0.12 : 0.08, 12, 12]} /><meshBasicMaterial color={on ? '#ffffff' : '#D4AF37'} toneMapped={false} /></mesh>
                  <Html center distanceFactor={q.tier === 'high' ? 9 : 11} zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onMouseEnter={() => { paused.current = true; onSelect(t); }}
                      onMouseLeave={() => { paused.current = false; onSelect(null); }}
                      onFocus={() => { paused.current = true; onSelect(t); }}
                      onBlur={() => { paused.current = false; onSelect(null); }}
                      onClick={() => onSelect(t)}
                      className={`-translate-y-6 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors ${on ? 'border-gold bg-gold text-black' : 'border-gold/40 bg-black/70 text-bone backdrop-blur hover:border-gold'}`}
                    >
                      {t.name}
                    </button>
                  </Html>
                </group>
              );
            })}
          </group>
        </group>
      ))}
      {!q.coarse && <OrbitControls enablePan={false} enableZoom={false} autoRotate={!q.reduced} autoRotateSpeed={0.5} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.7} />}
    </>
  );
}
