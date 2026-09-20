'use client';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Float, OrbitControls, RoundedBox } from '@react-three/drei';
import type { Project } from '@/types';
import type { Q3D } from './SceneCanvas';
import { DarkMetal, GoldEnvironment, Tilt } from './parts';

/** Paints a stylised UI for the project onto a canvas so each case study gets its own device screen. */
function paintScreen(name: string, accent: string, w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d') as CanvasRenderingContext2D;
  g.fillStyle = '#0b0b0b'; g.fillRect(0, 0, w, h);
  const pad = w * 0.06;
  g.fillStyle = '#1b1b1b'; g.fillRect(0, 0, w, h * 0.09);
  g.fillStyle = accent; g.beginPath(); g.arc(pad + 8, h * 0.045, 6, 0, Math.PI * 2); g.fill();
  const grad = g.createLinearGradient(0, h * 0.14, w, h * 0.5);
  grad.addColorStop(0, accent); grad.addColorStop(1, '#141414');
  g.fillStyle = grad; g.fillRect(pad, h * 0.14, w - pad * 2, h * 0.36);
  g.fillStyle = '#000'; g.font = `700 ${Math.round(w * 0.075)}px system-ui, sans-serif`; g.textBaseline = 'top';
  g.fillText(name.length > 18 ? name.slice(0, 17) + '\u2026' : name, pad * 1.6, h * 0.2);
  g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(pad * 1.6, h * 0.34, w * 0.35, 6);
  g.fillRect(pad * 1.6, h * 0.385, w * 0.25, 6);
  for (let i = 0; i < 3; i++) {
    g.fillStyle = '#1e1e1e'; g.fillRect(pad + i * ((w - pad * 2) / 3), h * 0.56, (w - pad * 2) / 3 - 8, h * 0.22);
    g.fillStyle = accent; g.fillRect(pad + 10 + i * ((w - pad * 2) / 3), h * 0.58, 26, 5);
  }
  g.fillStyle = '#2a2a2a'; g.fillRect(pad, h * 0.84, w * 0.6, 8); g.fillRect(pad, h * 0.89, w * 0.4, 8);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export default function CaseStudyScene({ project, q }: { project: Project; q: Q3D }) {
  const wide = useMemo(() => paintScreen(project.name, project.accent, 640, 400), [project.name, project.accent]);
  const tall = useMemo(() => paintScreen(project.name, project.accent, 300, 620), [project.name, project.accent]);
  useEffect(() => () => { wide.dispose(); tall.dispose(); }, [wide, tall]);
  const showLaptop = project.device !== 'phone';
  const showPhone = project.device !== 'laptop';

  return (
    <>
      <GoldEnvironment />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <Tilt x={0.25} y={0.12}>
        <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.05}>
          <group rotation={[0.1, -0.35, 0]} position={[showPhone && showLaptop ? -0.7 : 0, -0.2, 0]}>
            {showLaptop && (
              <group>
                <RoundedBox args={[3.4, 0.09, 2.2]} radius={0.04} position={[0, -0.05, 0.9]}><DarkMetal color="#242424" /></RoundedBox>
                <group position={[0, 0, -0.2]} rotation={[-0.2, 0, 0]}>
                  <RoundedBox args={[3.4, 2.15, 0.07]} radius={0.05} position={[0, 1.08, 0]}><DarkMetal /></RoundedBox>
                  <mesh position={[0, 1.08, 0.04]}><planeGeometry args={[3.2, 2]} /><meshBasicMaterial map={wide} toneMapped={false} /></mesh>
                </group>
              </group>
            )}
            {showPhone && (
              <group position={[showLaptop ? 2.5 : 0, 0.65, showLaptop ? 1.3 : 0]} rotation={[0, -0.2, 0]}>
                <RoundedBox args={[1.05, 2.15, 0.1]} radius={0.14} smoothness={4}><DarkMetal color="#0c0c0c" /></RoundedBox>
                <mesh position={[0, 0, 0.056]}><planeGeometry args={[0.93, 2.03]} /><meshBasicMaterial map={tall} toneMapped={false} /></mesh>
              </group>
            )}
          </group>
        </Float>
      </Tilt>
      {!q.coarse && <OrbitControls enablePan={false} enableZoom={false} autoRotate={!q.reduced} autoRotateSpeed={0.9} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.9} />}
    </>
  );
}
