import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Photos are stored in Firestore (no Firebase Storage / billing plan needed):
 * each photo is one document in the "images" collection, holding the picture as WebP
 * (shrunk in the browser so it fits Firestore's 1 MB document limit), and the website
 * shows it through /api/img/<id>, which is cached for a year by the browser and CDN.
 */
const MAX_BYTES = 700_000; // leaves room under Firestore's 1 MB per document

async function prepare(file: File) {
  const bmp = await createImageBitmap(file);
  const draw = (max: number) => {
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
    const ctx = cv.getContext("2d")!;
    ctx.drawImage(bmp, 0, 0, cv.width, cv.height);
    return { cv, ctx };
  };

  // transparent background? (a PNG cut-out → shown on plain white like the other menu cards)
  let transparent = false;
  if (/png|webp|gif/.test(file.type)) {
    const { cv, ctx } = draw(300);
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 200) clear++;
    transparent = clear / (d.length / 4) > 0.04;
  }

  const toBlob = (cv: HTMLCanvasElement, q: number) =>
    new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error("Could not read this image"))), "image/webp", q));

  // try 1200px → smaller until the file is small enough
  for (const [max, q] of [[1200, 0.84], [1200, 0.72], [1000, 0.7], [800, 0.68], [640, 0.62]] as const) {
    const { cv } = draw(max);
    const blob = await toBlob(cv, q);
    if (blob.size <= MAX_BYTES) { bmp.close?.(); return { blob, transparent, w: cv.width, h: cv.height }; }
  }
  bmp.close?.();
  throw new Error("This photo is too detailed to store. Try a smaller or cropped photo.");
}

const toBase64 = (b: Blob) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = () => rej(new Error("Could not read this image"));
    r.readAsDataURL(b);
  });

export async function uploadPhoto(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPG, PNG or WebP).");
  const { blob, transparent, w, h } = await prepare(file);
  const slug = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "photo";
  const id = `${folder}-${Date.now().toString(36)}-${slug}`;
  await setDoc(doc(db, "images", id), { data: await toBase64(blob), type: "image/webp", w, h, folder, createdAt: serverTimestamp() });
  return { url: `/api/img/${id}`, transparent };
}
