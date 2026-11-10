"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  cashew, chickpea, chilli, cornKernel, corianderLeaf, grainTexture,
  lemonSlice, lemonTexture, onionRing, peanutKernel, peanutShell, shellTexture,
} from "./foodGeometry";

type Kind = {
  key: string;
  count: number;
  scale: [number, number];
  geo: () => THREE.BufferGeometry;
  mat: (tex: Tex) => THREE.Material | THREE.Material[];
  spin: number;
};
type Tex = { grain: THREE.Texture; shell: THREE.Texture; lemon: THREE.Texture };

const BOUNDS = { x: 11, y: 7.5, zMin: -7, zMax: 2.5 };

const physical = (o: THREE.MeshPhysicalMaterialParameters) =>
  new THREE.MeshPhysicalMaterial({ vertexColors: true, ...o });

const KINDS: Kind[] = [
  { key: "shell", count: 22, scale: [0.55, 0.8], geo: peanutShell, spin: 0.6,
    mat: (t) => physical({ roughness: 0.92, bumpMap: t.shell, bumpScale: 2.5, sheen: 0.4, sheenColor: new THREE.Color("#f3d9b0") }) },
  { key: "kernel", count: 30, scale: [0.55, 0.8], geo: peanutKernel, spin: 1.1,
    mat: (t) => physical({ roughness: 0.55, bumpMap: t.grain, bumpScale: 3, clearcoat: 0.35, clearcoatRoughness: 0.5 }) },
  { key: "chana", count: 26, scale: [0.6, 0.85], geo: chickpea, spin: 0.9,
    mat: (t) => physical({ roughness: 0.6, bumpMap: t.grain, bumpScale: 1.5, clearcoat: 0.25, clearcoatRoughness: 0.6 }) },
  { key: "kaju", count: 16, scale: [0.7, 0.95], geo: cashew, spin: 0.7,
    mat: (t) => physical({ roughness: 0.5, bumpMap: t.grain, bumpScale: 1.2, sheen: 0.6, sheenColor: new THREE.Color("#fff1d0") }) },
  { key: "greenChilli", count: 8, scale: [0.8, 1.05], geo: () => chilli("#3d8f1f"), spin: 0.5,
    mat: () => physical({ roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }) },
  { key: "redChilli", count: 7, scale: [0.8, 1.05], geo: () => chilli("#c4140e"), spin: 0.5,
    mat: () => physical({ roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 }) },
  { key: "lemon", count: 7, scale: [0.75, 1], geo: lemonSlice, spin: 0.45,
    mat: (t) => [
      new THREE.MeshPhysicalMaterial({ color: "#f2c51f", roughness: 0.45, bumpMap: t.grain, bumpScale: 2 }),
      new THREE.MeshPhysicalMaterial({ map: t.lemon, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15, sheen: 0.5 }),
      new THREE.MeshPhysicalMaterial({ map: t.lemon, roughness: 0.25, clearcoat: 0.8 }),
    ] },
  { key: "leaf", count: 16, scale: [0.6, 0.9], geo: corianderLeaf, spin: 1.3,
    mat: () => physical({ roughness: 0.45, side: THREE.DoubleSide, sheen: 0.5, sheenColor: new THREE.Color("#b6f08a") }) },
  { key: "onion", count: 7, scale: [0.8, 1.1], geo: onionRing, spin: 0.6,
    mat: () => physical({ roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.92 }) },
  { key: "corn", count: 22, scale: [0.6, 0.9], geo: cornKernel, spin: 1.2,
    mat: () => physical({ roughness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.15 }) },
];

type Body = {
  p: THREE.Vector3; v: THREE.Vector3; q: THREE.Quaternion; axis: THREE.Vector3;
  w: number; s: number; phase: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

const DENSITY = typeof window === "undefined" ? 1
  : window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4 ? 0.5 : 1;
const countOf = (k: Kind) => Math.max(3, Math.round(k.count * DENSITY));

function makeBodies(k: Kind): Body[] {
  return Array.from({ length: countOf(k) }, () => ({
    p: new THREE.Vector3(rand(-BOUNDS.x, BOUNDS.x), rand(-BOUNDS.y, BOUNDS.y), rand(BOUNDS.zMin, BOUNDS.zMax)),
    v: new THREE.Vector3(0, -rand(0.25, 0.55), 0),
    q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(0, 6.28), rand(0, 6.28), rand(0, 6.28))),
    axis: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(),
    w: rand(0.3, 1) * k.spin,
    s: rand(k.scale[0], k.scale[1]),
    phase: rand(0, 6.28),
  }));
}

/** Shared click/pointer state written from DOM, read in the render loop */
const impulse = { x: 0, y: 0, t: -10, active: false };

function Snacks({ kind, tex }: { kind: Kind; tex: Tex }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const geo = useMemo(() => kind.geo(), [kind]);
  const mat = useMemo(() => kind.mat(tex), [kind, tex]);
  const bodies = useMemo(() => makeBodies(kind), [kind]);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const dq = useMemo(() => new THREE.Quaternion(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);
  const { viewport, camera } = useThree();
  const lastImpulse = useRef(-10);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const t = state.clock.elapsedTime;
    const scrollBoost = 1 + Math.min(Math.abs(scrollVel.v) * 0.004, 4);

    // fresh click → radial burst around the pointer (projected on z=0)
    let burst = false;
    if (impulse.t !== lastImpulse.current) { lastImpulse.current = impulse.t; burst = true; }
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0));
    const bx = (impulse.x * vp.width) / 2, by = (impulse.y * vp.height) / 2;

    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      if (burst) {
        const dx = b.p.x - bx, dy = b.p.y - by, dz = b.p.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.3) + 0.4;
        const f = Math.max(0, 7 - d) * 1.6;
        b.v.x += (dx / d) * f; b.v.y += (dy / d) * f + f * 0.25; b.v.z += (dz / d) * f * 0.4;
        b.w += f * 0.8;
      }
      // drift back to a lazy fall
      b.v.x += (Math.sin(t * 0.4 + b.phase) * 0.12 - b.v.x) * dt * 1.2;
      b.v.y += (-0.42 - b.v.y) * dt * 1.0;
      b.v.z += (0 - b.v.z) * dt * 1.0;
      b.w += (kind.spin * 0.6 - b.w) * dt * 0.6;

      b.p.addScaledVector(b.v, dt * scrollBoost);
      if (b.p.y < -BOUNDS.y) { b.p.y = BOUNDS.y; b.p.x = rand(-BOUNDS.x, BOUNDS.x); }
      if (b.p.y > BOUNDS.y + 1) b.p.y = -BOUNDS.y;
      if (b.p.x > BOUNDS.x) b.p.x = -BOUNDS.x; else if (b.p.x < -BOUNDS.x) b.p.x = BOUNDS.x;
      b.p.z = THREE.MathUtils.clamp(b.p.z, BOUNDS.zMin, BOUNDS.zMax);

      dq.setFromAxisAngle(b.axis, b.w * dt * scrollBoost);
      b.q.multiply(dq);
      // depth-of-field cheat: farther = slightly smaller & dimmer via fog
      sc.setScalar(b.s);
      m.compose(b.p, b.q, sc);
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat as THREE.Material, bodies.length]} frustumCulled={false} />;
}

/** scroll velocity tracked outside React so we never re-render */
const scrollVel = { v: 0 };

function Rig() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, dt) => {
    const { x, y } = state.pointer;
    const g = group.current;
    g.rotation.y += (x * 0.18 - g.rotation.y) * Math.min(1, dt * 2);
    g.rotation.x += (-y * 0.12 - g.rotation.x) * Math.min(1, dt * 2);
    state.camera.position.x += (x * 0.6 - state.camera.position.x) * Math.min(1, dt * 1.5);
    state.camera.position.y += (y * 0.4 - state.camera.position.y) * Math.min(1, dt * 1.5);
    state.camera.lookAt(0, 0, 0);
  });
  const tex = useMemo<Tex>(() => ({ grain: grainTexture(1.4), shell: shellTexture(), lemon: lemonTexture() }), []);
  return (
    <group ref={group}>
      {KINDS.map((k) => <Snacks key={k.key} kind={k} tex={tex} />)}
    </group>
  );
}

export default function FoodScene({ fog = "#c80f0b" }: { fog?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current!;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    let last = window.scrollY, lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      scrollVel.v = ((window.scrollY - last) / Math.max(1, now - lastT)) * 1000;
      last = window.scrollY; lastT = now;
    };
    const decay = setInterval(() => { scrollVel.v *= 0.85; }, 50);
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const target = e.target as HTMLElement;
      if (target.closest("a,button,input,label")) return;
      impulse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      impulse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      impulse.t = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      io.disconnect(); clearInterval(decay);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={wrap} className="food-scene" aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <fog attach="fog" args={[fog, 10, 22]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 6]} intensity={2.4} color="#fff1d6" />
        <directionalLight position={[-6, -2, -4]} intensity={1.2} color="#ffb347" />
        <pointLight position={[0, 0, 6]} intensity={8} distance={18} color="#ffe2a8" />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, -5]} scale={[12, 4, 1]} color="#fff4dc" />
          <Lightformer form="rect" intensity={2} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#ffcc66" />
          <Lightformer form="ring" intensity={2.5} position={[5, 2, 3]} scale={3} color="#ffffff" />
          <Lightformer form="rect" intensity={1} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color="#e30a0a" />
        </Environment>
        <Rig />
      </Canvas>
    </div>
  );
}
