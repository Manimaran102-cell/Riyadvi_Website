'use client';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import type { Q3D } from './SceneCanvas';
import { Gold, GoldEnvironment } from './parts';

function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Fibonacci-sphere nodes joined to their 3 nearest neighbours: a "connected systems" network. */
function buildNetwork(n: number) {
  const rnd = mulberry32(7);
  const ga = Math.PI * (3 - Math.sqrt(5));
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i, R = 2.55 + (rnd() - 0.5) * 0.5;
    pts.push(new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R));
  }
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  pts.forEach((p, i) => {
    pts.map((q, j) => ({ j, d: p.distanceToSquared(q) })).filter((x) => x.j !== i).sort((a, b) => a.d - b.d).slice(0, 3).forEach(({ j }) => {
      const k = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(k)) { seen.add(k); edges.push([i, j]); }
    });
  });
  const line = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => { pts[a].toArray(line, i * 6); pts[b].toArray(line, i * 6 + 3); });
  return { pts, edges, line, rnd };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function HeroScene({ q }: { q: Q3D }) {
  const high = q.tier === 'high';
  const N = high ? 96 : 46;
  const P = high ? 14 : 7;
  const net = useMemo(() => buildNetwork(N), [N]);
  const packets = useMemo(() => Array.from({ length: P }, (_, i) => ({ edge: Math.floor(net.rnd() * net.edges.length), speed: 0.12 + net.rnd() * 0.22, offset: net.rnd() + i })), [net, P]);

  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const pk = useRef<THREE.InstancedMesh>(null);
  const hover = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const m = nodes.current;
    if (!m) return;
    const c = new THREE.Color();
    net.pts.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.scale.setScalar(0.7 + ((i * 37) % 10) / 14);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, c.set(i % 5 === 0 ? '#ffffff' : '#D4AF37'));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [net, dummy]);

  useFrame((state, dt) => {
    const p = clamp01(window.scrollY / window.innerHeight);
    if (outer.current) {
      const o = outer.current;
      o.rotation.x = THREE.MathUtils.damp(o.rotation.x, -state.pointer.y * 0.35, 3, dt);
      o.rotation.y = THREE.MathUtils.damp(o.rotation.y, state.pointer.x * 0.5, 3, dt);
      o.scale.setScalar(1 - 0.3 * p);
      o.position.z = -p * 2.5;
    }
    if (inner.current) inner.current.rotation.y += dt * (0.1 + p * 0.7);
    if (core.current) {
      core.current.rotation.y += dt * 0.35;
      core.current.rotation.x += dt * 0.12;
      core.current.scale.setScalar(THREE.MathUtils.damp(core.current.scale.x, hover.current ? 1.18 : 1, 5, dt));
    }
    const m = pk.current;
    if (m) {
      const t = state.clock.elapsedTime;
      packets.forEach((k, i) => {
        const [a, b] = net.edges[k.edge];
        const u = (t * k.speed + k.offset) % 1;
        dummy.position.lerpVectors(net.pts[a], net.pts[b], u);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <GoldEnvironment />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#ffe9a8" />
      <group ref={outer}>
        <group ref={inner}>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" array={net.line} count={net.line.length / 3} itemSize={3} /></bufferGeometry>
            <lineBasicMaterial color="#D4AF37" transparent opacity={0.38} />
          </lineSegments>
          <instancedMesh ref={nodes} args={[undefined, undefined, N]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshBasicMaterial toneMapped={false} />
          </instancedMesh>
          <instancedMesh ref={pk} args={[undefined, undefined, P]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshBasicMaterial color="#fff6d6" toneMapped={false} />
          </instancedMesh>
          <mesh>
            <icosahedronGeometry args={[1.75, 2]} />
            <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.16} />
          </mesh>
        </group>
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh ref={core} onPointerOver={(e) => { e.stopPropagation(); hover.current = true; document.body.style.cursor = 'pointer'; }} onPointerOut={() => { hover.current = false; document.body.style.cursor = ''; }}>
            <icosahedronGeometry args={[0.95, 1]} />
            <Gold flatShading roughness={0.22} />
          </mesh>
        </Float>
      </group>
    </>
  );
}
