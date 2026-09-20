'use client';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls, RoundedBox } from '@react-three/drei';
import type { SceneKind } from '@/types';
import type { Q3D } from './SceneCanvas';
import { DarkMetal, Glow, Gold, GoldEnvironment, PopIn, Tilt } from './parts';

/* ---------- Web development: layered browser windows ---------- */
function Browser({ position, rotation = [0, 0, 0], accent = '#D4AF37', s = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; accent?: string; s?: number }) {
  return (
    <group position={position} rotation={rotation} scale={s}>
      <RoundedBox args={[3.2, 2.1, 0.08]} radius={0.06} smoothness={3}><DarkMetal /></RoundedBox>
      <mesh position={[0, 0.9, 0.045]}><boxGeometry args={[3.04, 0.2, 0.01]} /><meshStandardMaterial color="#262626" /></mesh>
      {[-1.4, -1.25, -1.1].map((x, i) => <mesh key={x} position={[x, 0.9, 0.06]}><circleGeometry args={[0.04, 16]} /><Glow color={i === 0 ? accent : '#666'} /></mesh>)}
      <mesh position={[-0.7, 0.25, 0.05]}><boxGeometry args={[1.5, 0.8, 0.01]} /><Gold color={accent} roughness={0.35} /></mesh>
      <mesh position={[0.85, 0.35, 0.05]}><boxGeometry args={[0.9, 0.6, 0.01]} /><meshStandardMaterial color="#2c2c2c" /></mesh>
      {[-0.32, -0.55, -0.78].map((y, i) => <mesh key={y} position={[-0.9 + (i === 2 ? 0.25 : 0), y, 0.05]}><boxGeometry args={[i === 2 ? 1.2 : 1.7, 0.08, 0.01]} /><meshStandardMaterial color="#3a3a3a" /></mesh>)}
      <mesh position={[0.9, -0.62, 0.05]}><boxGeometry args={[0.8, 0.34, 0.01]} /><Glow color={accent} /></mesh>
    </group>
  );
}
function WebScene() {
  return (
    <Tilt>
      <Float speed={1.3} floatIntensity={0.4} rotationIntensity={0.1}>
        <Browser position={[-0.9, 0.45, -1.1]} rotation={[0, 0.35, 0]} s={0.92} accent="#8a6f1c" />
        <Browser position={[0.2, -0.1, 0]} rotation={[0, -0.15, 0]} />
        <Browser position={[1.3, -0.7, 1.1]} rotation={[0, -0.5, 0]} s={0.72} accent="#F1D97A" />
      </Float>
    </Tilt>
  );
}

/* ---------- App development: 3D phone with orbiting UI cards ---------- */
function AppScene({ q }: { q: Q3D }) {
  const cards = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (cards.current) cards.current.rotation.y = clock.elapsedTime * 0.5; });
  return (
    <Tilt>
      <Float speed={1.5} floatIntensity={0.35} rotationIntensity={0.15}>
        <group rotation={[0.05, -0.35, 0]}>
          <RoundedBox args={[1.62, 3.22, 0.16]} radius={0.22} smoothness={4} position={[0, 0, -0.03]}><Gold roughness={0.3} /></RoundedBox>
          <RoundedBox args={[1.5, 3.1, 0.2]} radius={0.19} smoothness={4}><DarkMetal color="#0a0a0a" /></RoundedBox>
          <RoundedBox args={[1.36, 2.94, 0.02]} radius={0.14} smoothness={4} position={[0, 0, 0.105]}><meshStandardMaterial color="#111" emissive="#1a1406" emissiveIntensity={0.8} /></RoundedBox>
          <mesh position={[0, 1.3, 0.125]}><capsuleGeometry args={[0.07, 0.3, 4, 8]} /><meshStandardMaterial color="#000" /></mesh>
          <mesh position={[-0.4, 0.85, 0.125]}><circleGeometry args={[0.2, 24]} /><Glow color="#D4AF37" /></mesh>
          <mesh position={[0.12, 0.9, 0.125]}><planeGeometry args={[0.75, 0.1]} /><meshBasicMaterial color="#e8e8e8" /></mesh>
          <mesh position={[0.02, 0.72, 0.125]}><planeGeometry args={[0.55, 0.08]} /><meshBasicMaterial color="#666" /></mesh>
          {[0.2, -0.35, -0.9].map((y) => <mesh key={y} position={[0, y, 0.125]}><planeGeometry args={[1.12, 0.42]} /><meshBasicMaterial color="#232323" /></mesh>)}
          <mesh position={[0, -1.3, 0.125]}><planeGeometry args={[0.9, 0.12]} /><Glow color="#D4AF37" /></mesh>
        </group>
        {q.tier === 'high' && (
          <group ref={cards}>
            {[0, 2.1, 4.2].map((a, i) => (
              <group key={a} position={[Math.cos(a) * 2.3, [0.9, -0.3, 0.4][i], Math.sin(a) * 1.4]} rotation={[0, -a, 0]}>
                <RoundedBox args={[0.9, 0.5, 0.05]} radius={0.06}><DarkMetal /></RoundedBox>
                <mesh position={[-0.25, 0, 0.035]}><circleGeometry args={[0.11, 16]} /><Glow color="#D4AF37" /></mesh>
                <mesh position={[0.15, 0.06, 0.035]}><planeGeometry args={[0.4, 0.06]} /><meshBasicMaterial color="#ddd" /></mesh>
                <mesh position={[0.1, -0.08, 0.035]}><planeGeometry args={[0.3, 0.05]} /><meshBasicMaterial color="#666" /></mesh>
              </group>
            ))}
          </group>
        )}
      </Float>
    </Tilt>
  );
}

/* ---------- Digital marketing: growth chart ---------- */
const BARS = [0.6, 0.95, 0.85, 1.35, 1.7, 2.1, 2.7];
function MarketingScene({ reduced }: { reduced: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const dot = useRef<THREE.Mesh>(null);
  const t0 = useRef<number | null>(null);
  const pts = useMemo(() => BARS.map((h, i) => new THREE.Vector3(-1.8 + i * 0.6, h + 0.25 - 1.3, 0.3)), []);
  useFrame(({ clock }) => {
    t0.current ??= clock.elapsedTime;
    const t = reduced ? 99 : clock.elapsedTime - t0.current;
    BARS.forEach((h, i) => {
      const m = refs.current[i];
      if (!m) return;
      const u = THREE.MathUtils.clamp((t - i * 0.14) / 0.9, 0, 1);
      const e = 1 - Math.pow(1 - u, 3);
      const breathe = 1 + Math.sin(t * 1.4 + i) * 0.015 * u;
      m.scale.y = Math.max(0.001, e * breathe);
      m.position.y = -1.3 + (h * m.scale.y) / 2;
    });
    if (dot.current) dot.current.scale.setScalar(1 + Math.sin(t * 4) * 0.15);
  });
  return (
    <Tilt>
      <group rotation={[0.15, -0.4, 0]}>
        <mesh position={[0, -1.36, 0]}><cylinderGeometry args={[2.7, 2.7, 0.06, 64]} /><DarkMetal /></mesh>
        {BARS.map((h, i) => (
          <mesh key={i} ref={(m) => { refs.current[i] = m; }} position={[-1.8 + i * 0.6, -1.3, 0]} scale={[1, 0.001, 1]}>
            <boxGeometry args={[0.42, h, 0.42]} />
            <Gold color={new THREE.Color('#8a6f1c').lerp(new THREE.Color('#F1D97A'), i / 6)} roughness={0.3} />
          </mesh>
        ))}
        <Line points={pts} color="#ffffff" lineWidth={2} />
        <mesh ref={dot} position={pts[pts.length - 1]}><sphereGeometry args={[0.11, 16, 16]} /><Glow color="#ffffff" /></mesh>
      </group>
    </Tilt>
  );
}

/* ---------- AR / VR: immersive tunnel ---------- */
function ArVrScene() {
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    rings.current?.children.forEach((c, i) => { c.rotation.z += dt * (0.15 + i * 0.05) * (i % 2 ? 1 : -1); });
    if (core.current) { core.current.rotation.y = t * 0.5; core.current.rotation.x = t * 0.3; }
  });
  return (
    <Tilt x={0.5} y={0.3}>
      <group ref={rings} position={[0, 0, 1.2]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, 0, -i * 0.95]} scale={1 - i * 0.055} rotation={[0, 0, i * 0.4]}>
            <torusGeometry args={[1.8, 0.022, 8, i % 2 ? 6 : 64]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#ffffff' : '#D4AF37'} transparent opacity={1 - i * 0.09} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <gridHelper args={[16, 32, '#D4AF37', '#3a3a3a']} position={[0, -1.9, -3]} />
      <Float speed={2} floatIntensity={0.6}>
        <mesh ref={core} position={[0, 0, -2.4]}><icosahedronGeometry args={[0.75, 1]} /><Gold flatShading /></mesh>
        <mesh position={[0, 0, -2.4]}><icosahedronGeometry args={[1.15, 1]} /><meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.4} /></mesh>
      </Float>
    </Tilt>
  );
}

/* ---------- 3D modeling: rotatable object, click for wireframe ---------- */
function ModelScene({ q }: { q: Q3D }) {
  const [wire, setWire] = useState(false);
  return (
    <>
      <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.1}>
        <mesh onClick={() => setWire((w) => !w)} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
          <torusKnotGeometry args={[1, 0.34, q.tier === 'high' ? 220 : 110, q.tier === 'high' ? 32 : 16]} />
          {wire ? <meshBasicMaterial color="#D4AF37" wireframe /> : <Gold roughness={0.2} />}
        </mesh>
      </Float>
      {!q.coarse && <OrbitControls enablePan={false} enableZoom={false} autoRotate={!q.reduced} autoRotateSpeed={1.2} minPolarAngle={Math.PI / 3} maxPolarAngle={(2 * Math.PI) / 3} />}
    </>
  );
}

/* ---------- UI/UX: floating interface panels ---------- */
function Panel({ position, size, rotation = [0, 0, 0], kind }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number]; kind: 'chart' | 'list' | 'card' | 'toggle' }) {
  const [w, h] = size;
  return (
    <Float speed={1.4 + position[0] * 0.1} floatIntensity={0.6} rotationIntensity={0.15}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[w, h, 0.06]} radius={0.08} smoothness={3}><DarkMetal /></RoundedBox>
        <mesh position={[-w / 2 + 0.3, h / 2 - 0.25, 0.04]}><planeGeometry args={[0.5, 0.07]} /><Glow color="#D4AF37" /></mesh>
        {kind === 'chart' && [0.25, 0.5, 0.35, 0.7].map((bh, i) => <mesh key={i} position={[-0.4 + i * 0.28, -0.15 + bh / 2 - 0.25, 0.04]}><planeGeometry args={[0.16, bh * 0.9]} /><Glow color={i === 3 ? '#F1D97A' : '#8a6f1c'} /></mesh>)}
        {kind === 'list' && [0.15, -0.1, -0.35].map((y) => <group key={y}><mesh position={[-w / 2 + 0.3, y, 0.04]}><circleGeometry args={[0.07, 16]} /><Glow color="#888" /></mesh><mesh position={[0.1, y, 0.04]}><planeGeometry args={[w - 0.9, 0.06]} /><meshBasicMaterial color="#555" /></mesh></group>)}
        {kind === 'card' && <><mesh position={[0, 0, 0.04]}><planeGeometry args={[w - 0.4, h * 0.42]} /><Gold roughness={0.4} /></mesh><mesh position={[0, -h * 0.3, 0.04]}><planeGeometry args={[w - 0.7, 0.06]} /><meshBasicMaterial color="#666" /></mesh></>}
        {kind === 'toggle' && <><mesh position={[0, -0.05, 0.04]}><capsuleGeometry args={[0.13, 0.5, 4, 12]} /><meshBasicMaterial color="#333" /></mesh><mesh position={[0.2, -0.05, 0.07]}><sphereGeometry args={[0.11, 16, 16]} /><Glow color="#D4AF37" /></mesh></>}
      </group>
    </Float>
  );
}
function UiUxScene() {
  const cursor = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (cursor.current) { cursor.current.position.set(Math.sin(t * 0.8) * 1.6, Math.sin(t * 1.3) * 0.9, 1.2); }
    if (ring.current) { const s = 0.3 + ((t * 0.9) % 1) * 0.9; ring.current.scale.setScalar(s); (ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - ((t * 0.9) % 1); }
  });
  return (
    <Tilt>
      <Panel position={[-1.5, 0.6, -0.4]} size={[2, 1.4]} rotation={[0, 0.3, 0]} kind="chart" />
      <Panel position={[1.4, 0.9, -0.8]} size={[1.9, 1.3]} rotation={[0, -0.3, 0]} kind="card" />
      <Panel position={[-0.2, -0.6, 0.4]} size={[2.4, 1.3]} kind="list" />
      <Panel position={[1.7, -0.8, 0.5]} size={[1.2, 0.8]} rotation={[0, -0.4, 0]} kind="toggle" />
      <group ref={cursor}>
        <mesh rotation={[0, 0, Math.PI * 0.9]}><coneGeometry args={[0.12, 0.3, 3]} /><Glow color="#ffffff" /></mesh>
        <mesh ref={ring}><ringGeometry args={[0.9, 1, 32]} /><meshBasicMaterial color="#D4AF37" transparent toneMapped={false} /></mesh>
      </group>
    </Tilt>
  );
}

export default function ServiceScene({ kind, q }: { kind: SceneKind; q: Q3D }) {
  return (
    <>
      <GoldEnvironment />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff0c4" />
      <PopIn skip={q.reduced}>
        {kind === 'web' && <WebScene />}
        {kind === 'app' && <AppScene q={q} />}
        {kind === 'marketing' && <MarketingScene reduced={q.reduced} />}
        {kind === 'arvr' && <ArVrScene />}
        {kind === 'model' && <ModelScene q={q} />}
        {kind === 'uiux' && <UiUxScene />}
      </PopIn>
    </>
  );
}
