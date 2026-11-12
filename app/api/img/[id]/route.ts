import { FB } from "@/lib/content";

// Serves a photo uploaded in /admin (stored in Firestore → images/<id>).
// Each id is unique per upload, so the response never changes → cached for a year.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!/^[a-z0-9-]{1,80}$/i.test(id)) return new Response("Not found", { status: 404 });
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FB.projectId}/databases/(default)/documents/images/${id}?key=${FB.apiKey}`,
      { cache: "force-cache" },
    );
    if (!res.ok) return new Response("Not found", { status: 404 });
    const d = await res.json();
    const b64: string | undefined = d?.fields?.data?.stringValue;
    if (!b64) return new Response("Not found", { status: 404 });
    return new Response(Buffer.from(b64, "base64"), {
      headers: {
        "Content-Type": d?.fields?.type?.stringValue || "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Error", { status: 502 });
  }
}
