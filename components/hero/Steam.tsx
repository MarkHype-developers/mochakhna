"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Real-time volumetric-looking steam: a full-screen GLSL shader (domain-warped
 * fractal noise) rising off the food. Rendered at half resolution — steam is soft
 * by nature, so this costs almost nothing — and paused when off-screen.
 */
const frag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
  vec2 u = f*f*(3.-2.*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0., a = .5;
  mat2 r = mat2(.8,.6,-.6,.8);
  for(int i=0;i<4;i++){ v += a*noise(p); p = r*p*2.02 + 3.1; a *= .5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // rising, curling plumes: warp the domain with a slower noise field
  vec2 q = p * vec2(2.2, 1.6) - vec2(0., t * .22);
  vec2 warp = vec2(fbm(q + vec2(0., t*.05)), fbm(q + vec2(5.2, 1.3) - t*.04));
  float d = fbm(q + 1.8 * warp + (uMouse - .5) * .25);

  // plumes come up from the dishes (lower part) and dissipate as they climb
  float rise = smoothstep(0.02, 0.35, uv.y) * (1. - smoothstep(0.45, 1.0, uv.y));
  float sway = sin(uv.y * 4. + t * .6) * .08;
  float column = exp(-pow((uv.x - .62 - sway) * 2.0, 2.)) + .75 * exp(-pow((uv.x - .30 + sway) * 2.6, 2.));
  float a = smoothstep(.48, .92, d) * rise * (.35 + .65 * column);

  vec3 col = mix(vec3(1.0, .93, .86), vec3(1.), a);
  gl_FragColor = vec4(col, a * .55);
}`;

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.); }`;

export default function Steam({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power", premultipliedAlpha: false });
    } catch {
      return; // no WebGL → the page still looks complete without steam
    }
    const SCALE = 0.33;
    renderer.setPixelRatio(1);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(Math.max(1, Math.round(w * SCALE)), Math.max(1, Math.round(h * SCALE)), false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = new THREE.Vector2(0.5, 0.5);
    const onMove = (e: PointerEvent) => { target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight); };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true, raf = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); });
    io.observe(el);

    const clock = new THREE.Clock();
    let last = 0;
    const loop = (now = 0) => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      if (now - last < 33) { raf = requestAnimationFrame(loop); return; } // ~30fps is plenty for steam
      last = now;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.03);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      mesh.geometry.dispose(); mat.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`steam ${className}`} aria-hidden />;
}
