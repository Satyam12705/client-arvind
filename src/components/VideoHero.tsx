import { useEffect, useRef, useState } from "react";

/**
 * Autoplaying muted background video with a poster-image fallback for
 * prefers-reduced-motion users (and for the brief moment before the video
 * can play). The MP4 itself is a placeholder — swap /public/videos/*.mp4
 * for real site-footage later without touching this component.
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
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const video = videoRef.current;
    if (!video) return;

    // Safari requires these to be DOM properties as well as HTML attributes
    // for autoplaying background video, especially after route navigation.
    const playVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      void video.play().catch(() => {
        // Low Power Mode and user autoplay settings can still block playback.
        // The poster remains as the intentional visual fallback in that case.
      });
    };

    playVideo();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    document.addEventListener("visibilitychange", playVideo);

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", playVideo);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <img
        src={poster}
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
    <video
      ref={videoRef}
      className={`${className} pointer-events-none`}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      // "metadata" instead of "auto": the poster paints immediately and the
      // component's own play() calls (on loadeddata/canplay) still start
      // playback as soon as the browser has enough buffered — "auto" was
      // telling the browser to eagerly pull the entire video file at parse
      // time, competing for bandwidth with the JS bundle, fonts and the
      // poster image itself on the very connection that determines LCP.
      preload="metadata"
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
