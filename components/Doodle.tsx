import type { Doodle as D } from "@/lib/menu";

// Hand-inked menu illustrations. Deliberately a little wobbly.
const ink = { stroke: "#1a0f0a", strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function Doodle({ name, className }: { name: D; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {art[name]}
    </svg>
  );
}

const art: Record<D, JSX.Element> = {
  egg: (
    <g>
      <path d="M22 70c-2-18 16-30 38-30s42 10 40 30c-2 22-22 32-40 30-20-1-36-12-38-30z" fill="#fffaf0" {...ink} />
      <path d="M60 52c12 0 20 8 19 18-1 11-10 17-20 16-11-1-18-8-17-18 1-9 8-16 18-16z" fill="#ffb81f" {...ink} />
      <path d="M52 62c3-4 8-5 11-3" {...ink} stroke="#fff" strokeWidth={3} />
      <path d="M30 40l-6-8M96 44l7-7M60 28V18" {...ink} />
    </g>
  ),
  corn: (
    <g>
      <path d="M30 80c-6-10 10-30 20-36 12-8 30-14 38-6 8 8-2 26-12 34-10 10-30 22-40 16z" fill="#ffd23a" {...ink} />
      <path d="M44 56l8 8m2-16l8 8m2-14l8 8M40 68l8 8m6-18l8 8m4-14l6 6" {...ink} strokeWidth={2.4} />
      <path d="M30 80c-8 4-14 14-10 22 10-2 18-8 22-18" fill="#7cbf3a" {...ink} />
    </g>
  ),
  paneer: (
    <g>
      <path d="M26 50l30-14 38 12-30 16z" fill="#fff8e4" {...ink} />
      <path d="M26 50v28l38 16V64z" fill="#f6e8c3" {...ink} />
      <path d="M64 64l30-16v28L64 94" fill="#ecd8a6" {...ink} />
      <path d="M40 70l6 2m-4 8l6 2M76 66l6-3m-4 13l6-3" {...ink} stroke="#e30a0a" />
    </g>
  ),
  papad: (
    <g>
      <path d="M18 64c4-20 24-38 46-36 22 2 40 18 38 40-2 20-24 34-46 32-22-2-42-16-38-36z" fill="#f4d58a" {...ink} />
      <circle cx="44" cy="56" r="3" fill="#1a0f0a" /><circle cx="70" cy="48" r="2.5" fill="#1a0f0a" />
      <circle cx="80" cy="74" r="3" fill="#1a0f0a" /><circle cx="54" cy="82" r="2.5" fill="#1a0f0a" />
      <path d="M40 66c8 2 14 8 22 6m8-12c4 6 10 6 14 4" {...ink} stroke="#e30a0a" strokeWidth={3.6} />
      <path d="M56 60l4 4m10 8l3 3" {...ink} stroke="#3d8f1f" />
    </g>
  ),
  chips: (
    <g>
      <path d="M24 44c10-12 28-14 38-6-6 14-24 22-38 18z" fill="#ffd23a" {...ink} />
      <path d="M56 64c12-10 30-10 40 0-8 12-28 16-40 8z" fill="#ffc21a" {...ink} />
      <path d="M30 84c8-10 24-10 32-2-8 10-22 12-32 6z" fill="#ffd94f" {...ink} />
      <path d="M38 46l2 1m30 18l2 1M42 84l2 1" {...ink} stroke="#e30a0a" />
    </g>
  ),
  leaf: (
    <g>
      <path d="M20 90c0-36 28-64 76-68-2 46-30 72-76 68z" fill="#5fae3a" {...ink} />
      <path d="M22 88c20-18 40-38 70-62M44 66l-4-14m18 0l-2-14m-6 32l14 2m4-18l14 2" {...ink} />
      <circle cx="84" cy="80" r="10" fill="#e30a0a" {...ink} />
    </g>
  ),
  prawn: (
    <g>
      <path d="M34 34c30-8 58 10 58 38 0 18-14 30-30 30-12 0-20-8-20-18 0-8 6-14 14-14" fill="#ff8a4c" {...ink} />
      <path d="M50 38c-2 10 0 18 6 24m10-24c0 10 4 18 12 22m2-14c-4 8-2 18 4 22" {...ink} strokeWidth={2.4} />
      <path d="M56 70c-8 2-14 8-14 14m-10-48c-6-6-10-14-8-20m6 18c-8-2-14-6-16-12" {...ink} />
    </g>
  ),
  bottle: (
    <g>
      <path d="M50 14h20v14c10 6 14 16 14 28v44c0 6-4 8-10 8H46c-6 0-10-2-10-8V56c0-12 4-22 14-28z" fill="#e30a0a" {...ink} />
      <path d="M38 62h44v22H38z" fill="#ffe81a" {...ink} />
      <path d="M48 20h24" {...ink} />
      <path d="M46 40c-2 6-2 12 0 16" {...ink} stroke="#fff" />
    </g>
  ),
  ice: (
    <g>
      <path d="M24 46l24-10 24 10-24 10z" fill="#e8f7ff" {...ink} />
      <path d="M24 46v24l24 10V56zm48 0v24L48 80" fill="#c9ecff" {...ink} />
      <path d="M58 72l20-8 20 8-20 8z" fill="#e8f7ff" {...ink} />
      <path d="M58 72v20l20 8V80zm40 0v20l-20 8" fill="#c9ecff" {...ink} />
      <path d="M34 50l6-2" {...ink} stroke="#fff" />
    </g>
  ),
  glass: (
    <g>
      <path d="M32 24h56l-8 76c0 4-4 6-8 6H48c-4 0-8-2-8-6z" fill="#fff8" {...ink} />
      <path d="M36 54h48l-5 44c0 3-3 4-6 4H47c-3 0-6-1-6-4z" fill="#ffd23a" {...ink} />
      <circle cx="54" cy="70" r="3" fill="#fff" /><circle cx="66" cy="82" r="2" fill="#fff" />
      <path d="M78 24l12-14" {...ink} stroke="#e30a0a" strokeWidth={5} />
    </g>
  ),
  bowl: (
    <g>
      <path d="M16 56h88c0 26-20 42-44 42S16 82 16 56z" fill="#fffaf0" {...ink} />
      <path d="M16 56c10-6 78-6 88 0" {...ink} />
      <path d="M30 70c8 4 16 4 24 0s16-4 24 0 12 4 14 2" {...ink} stroke="#e30a0a" />
    </g>
  ),
  achar: (
    <g>
      <path d="M36 30h48v10c6 4 8 10 8 18v38c0 6-4 10-10 10H38c-6 0-10-4-10-10V58c0-8 2-14 8-18z" fill="#f6a21a" {...ink} />
      <path d="M34 20h52v10H34z" fill="#e30a0a" {...ink} />
      <path d="M44 66c4-4 10-4 12 2m8 12c4-4 10-2 12 2M46 88c4-2 8 0 8 4" {...ink} stroke="#7a2a05" />
    </g>
  ),
  peanut: (
    <g>
      <path d="M40 30c14-8 30 2 28 16-1 6 2 10 8 12 14 4 18 22 8 32-10 10-28 6-32-6-2-6-6-8-12-8-14-2-20-18-12-30 3-6 7-12 12-16z" fill="#d7a96b" {...ink} />
      <path d="M44 42l6 4m-14 6l6 2m30 18l6 2m-12 8l4 4m-26-34c4 6 4 12 0 16" {...ink} strokeWidth={2.4} />
      <ellipse cx="88" cy="36" rx="8" ry="11" fill="#9b3f1c" {...ink} transform="rotate(30 88 36)" />
    </g>
  ),
  sprout: (
    <g>
      <ellipse cx="40" cy="74" rx="12" ry="9" fill="#7cbf3a" {...ink} />
      <ellipse cx="70" cy="80" rx="12" ry="9" fill="#8cd04a" {...ink} />
      <ellipse cx="58" cy="58" rx="11" ry="8" fill="#7cbf3a" {...ink} />
      <path d="M40 66c2-14 10-22 20-26m10 32c4-16 14-24 26-26M58 50c-2-10 2-20 10-28" {...ink} stroke="#f1e7c6" strokeWidth={4} />
      <path d="M40 66c2-14 10-22 20-26m10 32c4-16 14-24 26-26M58 50c-2-10 2-20 10-28" {...ink} strokeWidth={1.4} />
    </g>
  ),
};
