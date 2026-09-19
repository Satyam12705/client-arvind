import { useEffect, useRef, useState } from "react";
import { optimizedImage, optimizedVideo, videoPosterFrame } from "../lib/cloudinaryUrl";

/**
 * Autoplaying muted background video, cross-faded in over its poster.
 *
 * The poster and the video are separate admin-chosen files and are usually not
 * the same footage, so handing the swap to the browser's native `poster`
 * attribute produces a hard cut: the still paints, then a completely different
 * frame replaces it the moment playback starts. That jump is what reads as a
 * bug on reload.
 *
 * Instead the poster is a real layer underneath, and the video fades over it
 * once it can actually play. If playback never starts — Low Power Mode, a
 * blocked autoplay, a slow connection — the poster simply stays, which is the
 * intended fallback anyway.
 *
 * Under prefers-reduced-motion no video element is created at all and the
 * poster is the whole hero.
 */
export default function VideoHero({
  src,
  poster,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  // Delivered sizes, not upload sizes: the hero video arrives as whatever the
  // editor uploaded, and a 25 MB file leaves the poster on screen for the
  // twenty-odd seconds it takes to download.
  const videoSrc = optimizedVideo(src);
  // Prefer a frame of the video itself over the separately uploaded poster.
  // The two drift apart as soon as someone replaces the video without also
  // replacing the poster, and the still is standing in for the video, so it
  // should show the video's content. Falls back to the configured poster for
  // a non-Cloudinary video.
  const posterSrc = videoPosterFrame(src) ?? optimizedImage(poster, 1920);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const video = videoRef.current;
    if (!video) return;

    // Safari requires these as DOM properties as well as HTML attributes for
    // autoplaying background video, especially after route navigation.
    const playVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      void video.play().catch(() => {
        // Low Power Mode and user autoplay settings can still block playback.
        // The poster underneath remains as the intended visual fallback.
      });
    };

    // Only reveal once there are real frames to show. `playing` is the honest
    // signal; canplay can fire while the first frame is still not painted.
    const reveal = () => setShowVideo(true);

    playVideo();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    video.addEventListener("playing", reveal);
    video.addEventListener("timeupdate", reveal);
    document.addEventListener("visibilitychange", playVideo);

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("playing", reveal);
      video.removeEventListener("timeupdate", reveal);
      document.removeEventListener("visibilitychange", playVideo);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <img
        src={posterSrc}
        alt={alt}
        width={1283}
        height={762}
        className={className}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={posterSrc}
        alt={alt}
        width={1283}
        height={762}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${
          showVideo ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
        // "metadata" rather than "auto": the poster above is what the visitor
        // sees first, so there is nothing to gain from eagerly pulling the whole
        // file at parse time and competing with the JS bundle, fonts and the
        // poster itself on the connection that decides LCP.
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
