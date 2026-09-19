/**
 * Rewrites Cloudinary delivery URLs to ask for an optimised version.
 *
 * Files come straight from the admin panel exactly as they were uploaded, so a
 * phone recording goes out at its original size — the hero video was being
 * delivered as a 25 MB MP4, which takes over twenty seconds to arrive and
 * leaves the poster on screen the whole time, and the poster itself was a
 * 3.1 MB PNG.
 *
 * Cloudinary can do the work at delivery time from the URL alone:
 *   q_auto   pick a quality that looks the same but weighs far less
 *   f_auto   serve WebP/AVIF or WebM to browsers that accept them
 *   c_limit  only ever scale down, never up, and keep the aspect ratio
 *
 * This means no re-uploading and no re-encoding by hand: whatever an editor
 * uploads is delivered sensibly. Non-Cloudinary URLs (the bundled /images and
 * /videos files) are returned untouched.
 */

const CLOUDINARY_HOST = "res.cloudinary.com";

/** A path segment like `v1789838821` — Cloudinary's version marker. */
const VERSION_SEGMENT = /^v\d+$/;

function withTransform(url: string, transform: string): string {
  if (typeof url !== "string" || !url.includes(CLOUDINARY_HOST)) return url;

  const marker = "/upload/";
  const at = url.indexOf(marker);
  if (at === -1) return url;

  const head = url.slice(0, at + marker.length);
  const tail = url.slice(at + marker.length);

  // Anything already between /upload/ and the version is an existing
  // transformation — leave it alone rather than stacking a second one.
  const firstSegment = tail.split("/")[0];
  if (firstSegment && !VERSION_SEGMENT.test(firstSegment) && firstSegment.includes("_")) {
    return url;
  }

  return `${head}${transform}/${tail}`;
}

/** Background video: capped at 1080p wide and auto-compressed. */
export function optimizedVideo(url: string): string {
  return withTransform(url, "q_auto,f_auto,c_limit,w_1920");
}

/**
 * Still image. `width` should be the widest the image is ever displayed at —
 * asking for less than the layout needs is what makes an image look soft.
 */
export function optimizedImage(url: string, width = 1600): string {
  return withTransform(url, `q_auto,f_auto,c_limit,w_${width}`);
}


/**
 * A still frame taken from a Cloudinary video.
 *
 * Under prefers-reduced-motion the hero shows a still *instead of* the video,
 * so that still should be the video's own content. Using the separately
 * uploaded poster means the two drift apart the moment someone replaces the
 * video and forgets the poster — which is exactly what happened: the video was
 * updated, the poster was not, and the hero kept showing the previous footage
 * to anyone with reduced motion enabled.
 *
 * Frame 0 by default, not a second in: the still is what the visitor looks at
 * until playback begins, so taking it from any later point means the picture
 * visibly jumps the moment the video starts. At frame 0 the handoff is between
 * two identical images and cannot be seen. (Checked against this video first —
 * a clip that fades in from black would want a later frame instead.)
 *
 * Returns null for anything that is not a Cloudinary video, so the caller can
 * fall back to the configured poster.
 */
export function videoPosterFrame(videoUrl: string, atSeconds = 0): string | null {
  if (typeof videoUrl !== "string" || !videoUrl.includes(CLOUDINARY_HOST)) return null;
  if (!videoUrl.includes("/video/upload/")) return null;

  const withFrame = withTransform(videoUrl, `so_${atSeconds},q_auto,f_auto,c_limit,w_1920`);
  // Asking for an image extension is what makes Cloudinary render a frame
  // rather than serve the clip.
  return withFrame.replace(/\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i, ".jpg$2");
}
