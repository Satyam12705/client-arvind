import { useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { optimizedImage } from "../lib/cloudinaryUrl";

/**
 * An <img> that renders nothing when there is no usable image.
 *
 * Every image path on this site comes from admin-editable content, so a field
 * can be cleared to "" (or point at a file that has since been deleted from
 * Cloudinary). A bare <img> with an empty or dead src paints the browser's
 * broken-image icon and still occupies its layout box, which looks worse than
 * simply omitting the element.
 *
 * Covers both failure modes: the empty/whitespace src is caught before render,
 * and a src that 404s is caught by onError. Pass `fallback` when the slot needs
 * to keep its shape (e.g. a placeholder tile in a grid).
 */
export default function SafeImage({
  src,
  fallback = null,
  ...rest
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallback?: ReactNode;
}) {
  // Tracking the failed URL rather than a boolean means a later src change
  // retries on its own, with no effect and no stale "broken" state.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const usable = typeof src === "string" && src.trim().length > 0;
  if (!usable || failedSrc === src) return <>{fallback}</>;

  // Admin uploads are delivered at whatever size they were uploaded at, which
  // for a phone photo can be several megabytes. Ask Cloudinary for a sensible
  // one; bundled /images paths pass through unchanged.
  return <img src={optimizedImage(src)} onError={() => setFailedSrc(src)} {...rest} />;
}
