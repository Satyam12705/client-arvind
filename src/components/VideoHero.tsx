import { useEffect, useRef, useState } from "react";
import { optimizedImage, optimizedVideo } from "../lib/cloudinaryUrl";
import {
  DEFAULT_FRAMING,
  canSampleFrames,
  focusFromColumns,
  framingConstants,
  isBlank,
  objectPositionFor,
  readCachedFraming,
  sampleColumns,
  writeCachedFraming,
  type VideoFraming,
} from "../lib/videoFraming";

const {
  COLS,
  ROWS,
  MAX_LEAD_IN_SECONDS,
  LEAD_IN_STEP_SECONDS,
  LOOP_MARGIN_SECONDS,
  FOCUS_SAMPLES,
  MIN_FOCUS_SAMPLES,
  FOCUS_EPSILON,
  MAX_FAILED_SAMPLES,
  TRACK_SAMPLE_SECONDS,
  TRACK_SMOOTHING,
  TRACK_EPSILON,
  MAX_FOCUS_STEP,
} = framingConstants;

/**
 * Autoplaying muted background video, cross-faded in over its poster.
 *
 * The poster is a real layer underneath rather than the native `poster`
 * attribute, and the video fades over it once it can actually play. If playback
 * never starts — Low Power Mode, a blocked autoplay, a slow connection — the
 * poster simply stays, which is the intended fallback anyway.
 *
 * Under prefers-reduced-motion no video element is created at all and the
 * poster is the whole hero. That path is not rare — "reduce motion" in the OS
 * turns it on for every site — so the poster has to stand on its own. It is the
 * admin-uploaded still, not a frame pulled out of the video with Cloudinary's
 * `so_`: a frame-grab is only as good as the frame it lands on, and on an edit
 * that fades up from black, frame 0 grabs a blank rectangle.
 *
 * How the video is started and cropped is measured from the footage rather than
 * configured, because the footage is admin-editable and any number written down
 * here goes stale the moment someone uploads a different film. See
 * ../lib/videoFraming.
 */
export default function VideoHero({
  src,
  mobileSrc,
  poster,
  alt,
  className = "",
}: {
  src: string;
  /** Optional upright cut, used on phones. See heroVideoMobile in the admin guide. */
  mobileSrc?: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  // Delivered sizes, not upload sizes: the hero video arrives as whatever the
  // editor uploaded, and a 25 MB file leaves the poster on screen for the
  // twenty-odd seconds it takes to download. This is the mid-range rung; the
  // <source> list below picks the right one per viewport.
  //
  // Framing is keyed on the admin URL rather than on this, because startAt and
  // focus describe the footage, not the resolution it is served at.
  const videoSrc = optimizedVideo(src);
  const posterSrc = optimizedImage(poster, 1920);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  // Which of the <source> rungs below the browser picks is not known until it
  // has loaded, and the upright cut is framed differently from the landscape
  // one, so the cached reading is applied once currentSrc exists rather than
  // guessed at here.
  const [framing, setFraming] = useState<VideoFraming>(DEFAULT_FRAMING);
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);
  const [videoAspect, setVideoAspect] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Track the rendered size so the crop can be worked out against the box the
  // video actually fills, rather than against breakpoints that only approximate
  // it. This is what makes the same code right on a phone, a tablet in either
  // orientation, and a short landscape window.
  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    const measure = () => setBox({ width: node.clientWidth, height: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const framingRef = { current: framing };
    // Until the lead-in is known the video stays behind the poster, so an
    // autoplay that beat this effect cannot flash the blank opening frame.
    let framingKey = src;
    let leadInResolved = false;
    video.loop = true;

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

    // Only reveal once there are real frames to show, and only once those
    // frames are past the blank lead-in.
    const reveal = () => {
      if (!leadInResolved) return;
      if (video.currentTime + 0.05 < framingRef.current.startAt) return;
      setShowVideo(true);
    };

    // Loop back to the first real frame, not to 0.
    //
    // The element's own `loop` has to be turned off to do this: it wraps to
    // frame 0 the instant playback reaches the end, which beats any handler
    // running off `timeupdate` and paints exactly the blank frame being
    // avoided. So the jump is made early, a beat before the end, and `ended` is
    // kept as a backstop in case that beat is missed.
    //
    // Only for footage that has a lead-in. When startAt is 0 there is nothing
    // to skip and native looping is left alone, which is seamless.
    const loopFromStart = () => {
      const { startAt } = framingRef.current;
      if (startAt <= 0) return;
      const { duration, currentTime } = video;
      if (!Number.isFinite(duration) || duration <= startAt) return;
      if (currentTime >= duration - LOOP_MARGIN_SECONDS) video.currentTime = startAt;
    };

    const onEnded = () => {
      const { startAt } = framingRef.current;
      if (startAt <= 0) return;
      video.currentTime = startAt;
      playVideo();
    };

    const seekTo = (time: number) =>
      new Promise<void>((resolve) => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          video.removeEventListener("seeked", done);
          window.clearTimeout(timer);
          resolve();
        };
        const timer = window.setTimeout(done, 500);
        video.addEventListener("seeked", done);
        try {
          video.currentTime = time;
        } catch {
          done();
        }
      });

    // --- measurement -------------------------------------------------------
    // Frames are read off this element while it plays, so nothing extra is
    // downloaded; the lead-in hunt seeks only within the first seconds, which
    // the browser has already buffered.
    // Frames are readable => the crop can follow the shot, every visit. A
    // cached reading only supplies the opening guess so a repeat visitor starts
    // correctly framed instead of drifting into place again.
    const readable = canSampleFrames(src) && (!mobileSrc || canSampleFrames(mobileSrc));
    const canvas = readable ? document.createElement("canvas") : null;
    if (canvas) {
      canvas.width = COLS;
      canvas.height = ROWS;
    }

    // Moving average of recent column readings, not a running total: the crop
    // follows the shot that is on screen now. See TRACK_* in videoFraming.
    let columnTrend: Float32Array | null = null;
    let focusSamples = 0;
    let failedSamples = 0;
    let lastSampleTime = -1;
    let tracking = readable;

    // Resolves once there is a decoded frame to read, so the hunt below cannot
    // mistake "not decoded yet" for "blank".
    const waitForFrame = () =>
      new Promise<boolean>((resolve) => {
        if (video.readyState >= 2) return resolve(true);
        let settled = false;
        const done = (ok: boolean) => {
          if (settled) return;
          settled = true;
          video.removeEventListener("loadeddata", onData);
          window.clearTimeout(timer);
          resolve(ok);
        };
        const onData = () => done(true);
        const timer = window.setTimeout(() => done(video.readyState >= 2), 3000);
        video.addEventListener("loadeddata", onData);
      });

    const findLeadIn = async () => {
      if (!canvas) return 0;
      if (!(await waitForFrame())) return 0;

      const limit = Math.min(MAX_LEAD_IN_SECONDS, (video.duration || 0) / 4);
      for (let t = 0; t <= limit; t += LEAD_IN_STEP_SECONDS) {
        await seekTo(t);
        if (cancelled) return 0;

        let frame = sampleColumns(video, canvas);
        if (!frame) {
          // Either the seek has not produced a frame yet, or the canvas is
          // unreadable. Give the decoder one chance to catch up before
          // concluding this video cannot be measured.
          await waitForFrame();
          if (cancelled) return 0;
          frame = sampleColumns(video, canvas);
          if (!frame) return 0;
        }
        if (!isBlank(frame.std)) return t;
      }
      return 0;
    };

    const collectFocus = () => {
      if (!tracking || !canvas) return;
      if (video.currentTime - lastSampleTime < TRACK_SAMPLE_SECONDS) return;

      const frame = sampleColumns(video, canvas);
      if (!frame) {
        // A miss is usually just a frame that is not decoded yet; only a
        // genuinely unreadable canvas keeps missing, and that is worth
        // abandoning rather than retrying on every tick forever.
        if (++failedSamples >= MAX_FAILED_SAMPLES) tracking = false;
        return;
      }
      failedSamples = 0;
      lastSampleTime = video.currentTime;
      // Nothing to aim at during a fade, and a blank frame would drag the
      // average toward the middle for no reason.
      if (isBlank(frame.std)) return;

      if (!columnTrend) {
        columnTrend = Float32Array.from(frame.columns);
      } else {
        for (let x = 0; x < COLS; x++) {
          columnTrend[x] += (frame.columns[x] - columnTrend[x]) * TRACK_SMOOTHING;
        }
      }

      focusSamples += 1;
      if (focusSamples < MIN_FOCUS_SAMPLES) return;

      const reading = focusFromColumns(columnTrend);
      const settling = focusSamples <= FOCUS_SAMPLES;
      // While still settling the opening guess may be well off, so go straight
      // there; after that, approach the reading a step at a time.
      const drift = reading - framingRef.current.focus;
      const focus = settling
        ? reading
        : framingRef.current.focus + Math.max(-MAX_FOCUS_STEP, Math.min(MAX_FOCUS_STEP, drift));

      // Once settled, only a real change in where the subject sits moves the
      // crop; while still settling, smaller corrections are worth making
      // because the opening guess may be some way off.
      const threshold = settling ? FOCUS_EPSILON : TRACK_EPSILON;
      if (Math.abs(drift) <= threshold) return;

      const next = { ...framingRef.current, focus };
      framingRef.current = next;
      // Cached as the next visit's opening guess, not as a final answer.
      if (focusSamples === FOCUS_SAMPLES) writeCachedFraming(framingKey, next);
      if (!cancelled) setFraming(next);
    };

    const onLoadedMetadata = async () => {
      setVideoAspect(video.videoHeight ? video.videoWidth / video.videoHeight : 0);

      // Now that the chosen rung is known, framing can be keyed on it.
      framingKey = video.currentSrc || src;
      const cached = readCachedFraming(framingKey);
      if (cached) {
        framingRef.current = cached;
        leadInResolved = true;
        video.loop = cached.startAt <= 0;
        setFraming(cached);
      }

      if (!leadInResolved) {
        const startAt = await findLeadIn();
        if (cancelled) return;
        const next = { ...framingRef.current, startAt };
        framingRef.current = next;
        // Hand looping over to loopFromStart/onEnded before playback can wrap.
        video.loop = startAt <= 0;
        setFraming(next);
        // Only the start is known yet. When frames cannot be read at all there
        // will never be a focus reading to wait for, so cache the start now;
        // otherwise collectFocus stores both once it has something to say.
        if (!tracking) writeCachedFraming(framingKey, next);
      }

      if (video.currentTime < framingRef.current.startAt) {
        await seekTo(framingRef.current.startAt);
        if (cancelled) return;
      }
      leadInResolved = true;
      playVideo();
      reveal();
    };

    const onTimeUpdate = () => {
      loopFromStart();
      collectFocus();
      reveal();
    };

    if (video.readyState >= 1) void onLoadedMetadata();
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", playVideo);
    video.addEventListener("playing", reveal);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", playVideo);

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("playing", reveal);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", playVideo);
    };
    // `framing` is deliberately not a dependency: it is seeded into a ref and
    // then owned by this effect, and re-running on every measurement would
    // restart playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, src, mobileSrc]);

  const objectPosition = box
    ? objectPositionFor(framing.focus, box.width, box.height, videoAspect)
    : "50% 50%";

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
    <div ref={boxRef} className={`relative ${className}`}>
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
        // Eased rather than snapped: the crop follows the shot as the film
        // plays, and a re-crop that slides reads as a slow camera move instead
        // of a glitch.
        style={{ objectPosition, transition: "object-position 900ms ease-in-out, opacity 700ms ease-out" }}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
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
        // Frames are read back off this element, so the response has to be
        // CORS-readable. Only set where that is known to hold, because the
        // attribute stops playback outright on a host that does not send the
        // header. See canSampleFrames.
        crossOrigin={
          canSampleFrames(src) && (!mobileSrc || canSampleFrames(mobileSrc)) ? "anonymous" : undefined
        }
        // "metadata" rather than "auto": the poster above is what the visitor
        // sees first, so there is nothing to gain from eagerly pulling the whole
        // file at parse time and competing with the JS bundle, fonts and the
        // poster itself on the connection that decides LCP.
        preload="metadata"
      >
        {/* First match wins, and unlike <picture> this is not re-evaluated on
            resize — which is fine, since it only decides which file to fetch.
            Phones take the upright cut when one is configured, because a
            widescreen film has to throw away three quarters of its width to
            fill a phone-shaped hero and is upscaled to do it. Large screens
            take the master so they stop upscaling a 1080p copy. */}
        {mobileSrc && (
          <source
            // Phones, and tablets held upright — both are far taller than a
            // widescreen film. A tablet turned sideways is not, so it keeps the
            // landscape cut.
            media="(max-width: 767px), (max-width: 1023px) and (orientation: portrait)"
            src={optimizedVideo(mobileSrc, 1080)}
            type="video/mp4"
          />
        )}
        <source media="(min-width: 1280px)" src={optimizedVideo(src, 2560)} type="video/mp4" />
        <source media="(min-width: 768px)" src={videoSrc} type="video/mp4" />
        <source src={optimizedVideo(src, 1280)} type="video/mp4" />
      </video>
    </div>
  );
}
