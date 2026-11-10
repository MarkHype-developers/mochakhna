import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ───────────── tiny deterministic noise (value noise, 3D) ───────────── */
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fade = (t: number) => t * t * (3 - 2 * t);
export function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), xf), lerp(c(0, 1, 0), c(1, 1, 0), xf), yf),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), xf), lerp(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf
  );
}

/** push every vertex along its normal by fractal noise → organic, hand-made surfaces */
function displace(geo: THREE.BufferGeometry, amp: number, freq: number, seed = 0) {
  geo.computeVertexNormals();
  const p = geo.attributes.position as THREE.BufferAttribute;
  const n = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const f =
      noise3(x * freq + seed, y * freq, z * freq) * 0.65 +
      noise3(x * freq * 2.7, y * freq * 2.7 + seed, z * freq * 2.7) * 0.35 - 0.5;
    p.setXYZ(i, x + n.getX(i) * f * amp, y + n.getY(i) * f * amp, z + n.getZ(i) * f * amp);
  }
  geo.computeVertexNormals();
  return geo;
}

function paint(geo: THREE.BufferGeometry, color: THREE.ColorRepresentation, jitter = 0.06, seed = 1) {
  const c = new THREE.Color(color);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const arr = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const v = (noise3(p.getX(i) * 4 + seed, p.getY(i) * 4, p.getZ(i) * 4) - 0.5) * jitter * 2;
    arr[i * 3] = THREE.MathUtils.clamp(c.r + v, 0, 1);
    arr[i * 3 + 1] = THREE.MathUtils.clamp(c.g + v * 0.9, 0, 1);
    arr[i * 3 + 2] = THREE.MathUtils.clamp(c.b + v * 0.7, 0, 1);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

/** Tube along a curve, radius driven by a profile function → closed tapered ends */
function taperedTube(curve: THREE.Curve<THREE.Vector3>, radius: (t: number) => number, tSeg = 64, rSeg = 18) {
  const geo = new THREE.TubeGeometry(curve, tSeg, 1, rSeg, false);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const pt = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= tSeg; i++) {
    const t = i / tSeg;
    curve.getPointAt(t, pt);
    const r = radius(t);
    for (let j = 0; j <= rSeg; j++) {
      const k = i * (rSeg + 1) + j;
      v.fromBufferAttribute(p, k).sub(pt).multiplyScalar(r).add(pt);
      p.setXYZ(k, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/* ───────────── the snacks ───────────── */

/** In-shell peanut: lathe with a pinched waist + bumpy noise */
export function peanutShell() {
  const pts: THREE.Vector2[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const y = -1 + (2 * i) / N;
    const env = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y), 3.2)), 0.5);
    const waist = 1 - 0.2 * Math.exp(-Math.pow(y / 0.2, 2));
    pts.push(new THREE.Vector2(0.4 * env * waist + 0.0001, y * 0.95));
  }
  const g = new THREE.LatheGeometry(pts, 36);
  displace(g, 0.05, 5.5, 3);
  return paint(g, "#c9a273", 0.08, 2);
}

/** Masala-coated peanut kernel */
export function peanutKernel() {
  const g = new THREE.SphereGeometry(0.3, 28, 20);
  g.scale(0.85, 1.25, 0.8);
  displace(g, 0.035, 7, 9);
  return paint(g, "#9b3f1c", 0.12, 4);
}

/** Kabuli chana with its little beak */
export function chickpea() {
  const g = new THREE.SphereGeometry(0.32, 32, 24);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3(), beak = new THREE.Vector3(0.3, 0.75, 0.2).normalize();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const d = v.clone().normalize().dot(beak);
    const push = Math.pow(Math.max(0, d), 18) * 0.13;
    v.addScaledVector(beak, push);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  displace(g, 0.05, 6, 5);
  return paint(g, "#d4a456", 0.07, 7);
}

/** Kaju — arc tube tapered at both ends */
export function cashew() {
  const curve = new THREE.EllipseCurve(0, 0, 0.42, 0.36, Math.PI * 0.05, Math.PI * 1.15, false, 0);
  const c3 = new THREE.CatmullRomCurve3(curve.getPoints(24).map((q) => new THREE.Vector3(q.x, q.y, 0)));
  const g = taperedTube(c3, (t) => 0.22 * Math.pow(Math.sin(Math.PI * t), 0.42) * (1 + 0.15 * Math.sin(Math.PI * t)), 60, 20);
  g.center();
  displace(g, 0.02, 6, 11);
  return paint(g, "#ecd2a2", 0.05, 8);
}

/** Chilli body + stem merged with vertex colours */
export function chilli(body: string) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.05, 0),
    new THREE.Vector3(0.18, -0.55, 0.05),
    new THREE.Vector3(0.12, 0.1, -0.05),
    new THREE.Vector3(-0.08, 0.7, 0),
  ]);
  const b = taperedTube(curve, (t) => 0.16 * Math.pow(t, 0.55) * Math.pow(1 - t, 0.08), 64, 18);
  displace(b, 0.015, 3, 2);
  paint(b, body, 0.05, 3);
  const end = curve.getPointAt(1);
  const stem = new THREE.CylinderGeometry(0.035, 0.07, 0.38, 10);
  stem.rotateZ(0.35);
  stem.translate(end.x - 0.06, end.y + 0.14, end.z);
  paint(stem, "#4c6b1f", 0.04, 5);
  const calyx = new THREE.SphereGeometry(0.13, 14, 10);
  calyx.scale(1, 0.55, 1);
  calyx.translate(end.x - 0.02, end.y, end.z);
  paint(calyx, "#557a22", 0.05, 6);
  const merged = mergeGeometries([b.toNonIndexed(), stem.toNonIndexed(), calyx.toNonIndexed()]);
  merged.computeVertexNormals();
  merged.scale(0.75, 0.75, 0.75);
  return merged;
}

/** Lemon wheel — material groups: 0 = rind side, 1 = top, 2 = bottom */
export function lemonSlice() {
  const g = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 48, 1);
  return g;
}

/** Coriander leaf — three lobes, slightly cupped */
export function corianderLeaf() {
  const s = new THREE.Shape();
  const lobes = 3;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 90; i++) {
    const a = Math.PI * 0.08 + (i / 90) * Math.PI * 0.84;
    const r = 0.45 + 0.13 * Math.abs(Math.sin(a * lobes * 2)) + 0.03 * Math.sin(a * 23);
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r * 0.9));
  }
  s.moveTo(0, -0.05);
  pts.forEach((p) => s.lineTo(p.x, p.y));
  s.lineTo(0, -0.05);
  const g = new THREE.ShapeGeometry(s, 4);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setZ(i, 0.35 * x * x + 0.15 * y * y);
  }
  g.computeVertexNormals();
  g.center();
  return paint(g, "#3f8a2c", 0.1, 4);
}

/** Pyaaz ring */
export function onionRing() {
  const g = new THREE.TorusGeometry(0.42, 0.055, 12, 56);
  displace(g, 0.02, 4, 6);
  return paint(g, "#b7568a", 0.12, 9);
}

/** American corn kernel */
export function cornKernel() {
  const g = new THREE.SphereGeometry(0.2, 18, 14);
  g.scale(1, 0.8, 0.75);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    if (p.getY(i) < -0.05) p.setY(i, p.getY(i) * 0.5 - 0.06);
  }
  displace(g, 0.015, 8, 1);
  return paint(g, "#f2c12e", 0.06, 2);
}

/* ───────────── canvas textures ───────────── */

export function lemonTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const x = c.getContext("2d")!;
  const cx = 256, cy = 256;
  x.fillStyle = "#f5d43a"; x.fillRect(0, 0, 512, 512);
  x.beginPath(); x.arc(cx, cy, 250, 0, Math.PI * 2); x.fillStyle = "#fff6c9"; x.fill();
  const seg = 10;
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2 + 0.04, a1 = ((i + 1) / seg) * Math.PI * 2 - 0.04;
    x.beginPath(); x.moveTo(cx + Math.cos((a0 + a1) / 2) * 22, cy + Math.sin((a0 + a1) / 2) * 22);
    x.arc(cx, cy, 222, a0, a1); x.closePath();
    const gr = x.createRadialGradient(cx, cy, 20, cx, cy, 222);
    gr.addColorStop(0, "#fff3a6"); gr.addColorStop(0.6, "#f7dd55"); gr.addColorStop(1, "#efc92a");
    x.fillStyle = gr; x.fill();
    // juicy vesicles
    for (let k = 0; k < 70; k++) {
      const a = a0 + Math.random() * (a1 - a0), r = 40 + Math.random() * 175;
      x.beginPath();
      x.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2 + Math.random() * 4, 8 + Math.random() * 10, a, 0, Math.PI * 2);
      x.fillStyle = `rgba(255,255,220,${0.15 + Math.random() * 0.3})`; x.fill();
    }
  }
  x.beginPath(); x.arc(cx, cy, 16, 0, Math.PI * 2); x.fillStyle = "#fff8d8"; x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Generic grain bump used for roughness on everything */
export function grainTexture(scale = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d")!;
  const img = x.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) {
    const px = i % 256, py = (i / 256) | 0;
    const n = noise3(px * 0.08 * scale, py * 0.08 * scale, 0) * 0.6 + Math.random() * 0.4;
    const v = (n * 255) | 0;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
}

/** Peanut shell net pattern (bump) */
export function shellTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const x = c.getContext("2d")!;
  x.fillStyle = "#808080"; x.fillRect(0, 0, 512, 512);
  x.strokeStyle = "#e8e8e8"; x.lineWidth = 5;
  for (let i = 0; i < 26; i++) {
    x.beginPath();
    const u = (i / 26) * 512;
    x.moveTo(u, 0);
    for (let v = 0; v <= 512; v += 16) x.lineTo(u + Math.sin(v * 0.05 + i) * 6, v);
    x.stroke();
  }
  x.lineWidth = 3; x.strokeStyle = "#cfcfcf";
  for (let i = 0; i < 40; i++) {
    x.beginPath();
    const v = (i / 40) * 512;
    x.moveTo(0, v);
    for (let u = 0; u <= 512; u += 16) x.lineTo(u, v + Math.sin(u * 0.07 + i * 3) * 5);
    x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
