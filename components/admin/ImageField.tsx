"use client";

import { useRef, useState } from "react";
import Photo from "../Photo";
import { PHOTOS } from "@/lib/photos";
import { CUTOUTS, cutSrc } from "@/lib/cutouts";
import { uploadPhoto } from "./upload";
import { isUpload } from "@/lib/content";

const KEYS = Object.keys(PHOTOS).sort();

type Props = {
  value: string;
  onChange: (photo: string, transparent: boolean) => void;
  folder: string;
  label?: string;
  dish?: boolean;       // menu dish: preview it the way the menu card shows it
  cutout?: boolean;     // uploaded dish photo has no background
  wide?: boolean;
};

/** Photo preview + "Upload new" + "or pick a built-in photo". */
export default function ImageField({ value, onChange, folder, label = "Photo", dish, cutout, wide }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  const handle = async (f?: File | null) => {
    if (!f) return;
    setErr(""); setBusy(true);
    try {
      const { url, transparent } = await uploadPhoto(f, folder);
      onChange(url, transparent);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const showCut = dish && (CUTOUTS.has(value) || (isUpload(value) && !!cutout));

  return (
    <div className={`ad-img${wide ? " ad-img--wide" : ""}`}>
      <span className="ad-lbl">{label}</span>
      <button
        type="button"
        className={`ad-img-box${showCut ? " is-cut" : ""}${drag ? " is-drag" : ""}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
        title="Click or drop a photo to replace"
      >
        {value ? (
          showCut ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={CUTOUTS.has(value) ? cutSrc(value) : value} alt="" />
          ) : (
            <Photo photo={value} alt="" fill sizes="240px" />
          )
        ) : <span className="ad-img-empty">No photo</span>}
        <span className="ad-img-over">{busy ? "Uploading…" : "Upload new"}</span>
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files?.[0])} />
      <select
        className="ad-img-pick"
        value={KEYS.includes(value) ? value : ""}
        onChange={(e) => e.target.value && onChange(e.target.value, false)}
      >
        <option value="">{KEYS.includes(value) ? "Built-in photo…" : "Uploaded photo · or pick built-in…"}</option>
        {KEYS.map((k) => <option key={k} value={k}>{k}{CUTOUTS.has(k) ? " (cut-out)" : ""}</option>)}
      </select>
      {err && <span className="ad-err">{err}</span>}
    </div>
  );
}
