"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

type Props = Omit<ImageProps, "src" | "loader"> & {
  photo: PhotoKey | string;
  /** shown instead if the main photo fails to load (photo key, Unsplash id or /local path) */
  fallback?: PhotoKey | string;
};

const resolve = (p: string) => (p in PHOTOS ? PHOTOS[p as PhotoKey] : p) as string;

/**
 * next/image for local photos (public/) and Unsplash photos. Unsplash goes through a custom
 * loader so their CDN resizes it — no next.config change needed. Falls back on error.
 */
export default function Photo({ photo, fallback, quality = 72, onError, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const id = resolve(failed && fallback ? fallback : photo);
  const handleError: ImageProps["onError"] = (e) => { if (fallback && !failed) setFailed(true); onError?.(e); };

  // Our own photos in /public: served directly (the Next resizer hung on one of them in some
  // browsers). Each has a 600px "-sm" twin, so cards and thumbnails don't decode full-size files.
  if (id.startsWith("/")) {
    if (id.startsWith("/img/real/")) {
      const sm = id.replace(/\.jpg$/, "-sm.jpg");
      const { fill, sizes, alt, loading, priority, className, style, draggable } = rest as ImageProps;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={sm}
          srcSet={`${sm} 600w, ${id} 1380w`}
          sizes={sizes ?? "600px"}
          alt={alt}
          loading={priority ? "eager" : loading ?? "lazy"}
          decoding="async"
          draggable={draggable}
          className={className}
          onError={handleError as unknown as React.ReactEventHandler<HTMLImageElement>}
          style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...(style ?? {}) } : style}
        />
      );
    }
    return <Image {...rest} key={id} src={id} unoptimized onError={handleError} />;
  }
  return (
    <Image
      {...rest}
      key={id}
      quality={quality}
      onError={handleError}
      src={`https://images.unsplash.com/photo-${id}`}
      loader={({ src, width, quality: q }) => `${src}?w=${width}&q=${q ?? 72}&auto=format&fit=max`}
    />
  );
}
