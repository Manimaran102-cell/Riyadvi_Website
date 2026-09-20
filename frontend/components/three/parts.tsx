'use client';
import { useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';

/** Brand materials. Gold is the hero material; dark metal is its counterpoint. */
export const Gold = (p: ThreeElements['meshStandardMaterial']) => <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.26} envMapIntensity={1.3} {...p} />;
export const DarkMetal = (p: ThreeElements['meshStandardMaterial']) => <meshStandardMaterial color="#161616" metalness={0.85} roughness={0.38} envMapIntensity={0.9} {...p} />;
export const Glow = ({ color = '#F1D97A', ...p }: ThreeElements['meshBasicMaterial']) => <meshBasicMaterial color={color} toneMapped={false} {...p} />;

/** Studio lighting built from procedural light panels: no HDR download, one-off render (frames=1). */
export function GoldEnvironment() {
  return (
    <Environment frames={1} resolution={128}>
      <Lightformer form="rect" intensity={4} color="#fff1c2" position={[0, 5, -4]} scale={[12, 3, 1]} />
      <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="ring" intensity={2} color="#D4AF37" position={[5, 1, 3]} scale={4} />
      <Lightformer form="rect" intensity={1.2} color="#ffd98a" position={[0, -4, 2]} scale={[10, 2, 1]} />
    </Environment>
  );
}

/** Group that leans toward the cursor with smoothing. */
export function Tilt({ children, x = 0.35, y = 0.25, still }: { children: ReactNode; x?: number; y?: number; still?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!g.current || still) return;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.x * x, 3.2, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.y * y, 3.2, dt);
  });
  return <group ref={g}>{children}</group>;
}

/** Scales a group in from 0 when it mounts (used when a service scene is swapped). */
export function PopIn({ children, skip }: { children: ReactNode; skip?: boolean }) {
  const g = useRef<THREE.Group>(null);
  const s = useRef(skip ? 1 : 0.001);
  useFrame((_, dt) => {
    if (!g.current) return;
    s.current = THREE.MathUtils.damp(s.current, 1, 6, dt);
    g.current.scale.setScalar(s.current);
  });
  return <group ref={g} scale={skip ? 1 : 0.001}>{children}</group>;
}
