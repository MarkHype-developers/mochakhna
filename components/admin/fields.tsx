"use client";

export function Text({ label, value, onChange, placeholder, wide }: { label: string; value: string | undefined; onChange: (v: string) => void; placeholder?: string; wide?: boolean }) {
  return (
    <label className={`ad-f${wide ? " ad-f--wide" : ""}`}>
      <span className="ad-lbl">{label}</span>
      <input value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Num({ label, value, onChange, placeholder }: { label: string; value: number | null | undefined; onChange: (v: number | null) => void; placeholder?: string }) {
  return (
    <label className="ad-f ad-f--num">
      <span className="ad-lbl">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))}
      />
    </label>
  );
}

export function Area({ label, value, onChange, rows = 2, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <label className="ad-f ad-f--wide">
      <span className="ad-lbl">{label}{hint && <em> · {hint}</em>}</span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Pick<T extends string>({ label, value, options, onChange }: { label: string; value: T | undefined; options: [T | "", string][]; onChange: (v: T | undefined) => void }) {
  return (
    <label className="ad-f">
      <span className="ad-lbl">{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <label className="ad-tg">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden />
      <span>{label}</span>
    </label>
  );
}

/** ↑ ↓ 🗑 controls for a row in a list */
export function RowTools({ onUp, onDown, onDelete, what }: { onUp?: () => void; onDown?: () => void; onDelete: () => void; what: string }) {
  return (
    <div className="ad-tools">
      <button type="button" onClick={onUp} disabled={!onUp} aria-label="Move up" title="Move up">↑</button>
      <button type="button" onClick={onDown} disabled={!onDown} aria-label="Move down" title="Move down">↓</button>
      <button type="button" className="ad-del" onClick={() => { if (confirm(`Delete ${what}? (Nothing changes on the site until you press Publish.)`)) onDelete(); }} aria-label="Delete" title="Delete">Delete</button>
    </div>
  );
}

// ── list helpers ──
export const move = <T,>(arr: T[], i: number, d: number) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = arr.slice();
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};
export const setAt = <T,>(arr: T[], i: number, v: T) => arr.map((x, k) => (k === i ? v : x));
export const without = <T,>(arr: T[], i: number) => arr.filter((_, k) => k !== i);
export const uid = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "item"}-${Math.random().toString(36).slice(2, 6)}`;
