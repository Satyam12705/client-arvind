/**
 * Works out how to frame a hero video by looking at the footage itself.
 *
 * Two things about a background video decide whether the hero reads well, and
 * both are properties of whatever file an editor happened to upload:
 *
 *   1. Where it can start. Plenty of edits open on a fade up from black, so
 *      their frame 0 is a flat dark rectangle. The hero then paints a blank
 *      banner, and loops back to that blank every time round.
 *
 *   2. Where its subject sits horizontally. A phone-shaped hero object-covers
 *      only about a quarter of a 16:9 video's width. If the footage puts its
 *      subject off to one side — a slideshow with its photo cards in the
 *      right-hand third, say — a centred crop lands on the empty margin and
 *      the pictures are cropped away entirely.
 *
 * Hard-coding either answer ties the site to one specific film, and the film is
 * admin-editable: it changes without a deploy, and the numbers silently become
 * wrong. So both are measured at runtime from the frames themselves. Footage
 * that opens bright and fills the frame — which is the normal case — measures
 * as "start at 0, stay centred", i.e. exactly the old behaviour.
 *
 * Sampling is done on the hero video element as it plays, never on a second
 * download: frames are drawn from what the browser has already buffered, so
 * this costs no extra bandwidth. The result is cached per URL for the session.
 */

/** Analysis grid. Small on purpose — this is about layout, not detail. */
const COLS = 64;
const ROWS = 36;

/**
 * Luma standard deviation under which a frame counts as blank.
 *
 * Measured on flat frames, not dark ones: a fade-to-black frame sits near 0,
 * while genuinely dark but photographic footage (a night shot, a trench in
 * shadow) still varies far more than this across the frame. Keyed off spread
 * rather than brightness so a fade to white is caught too.
 */
const BLANK_STD = 8;

/**
 * How early to jump back when looping past a lead-in.
 *
 * `timeupdate` only fires about four times a second, so a margin shorter than
 * the gap between two events lets the element's own `loop` reach the end first
 * and wrap to frame 0 — the blank frame this is all trying to avoid. Wide
 * enough here for at least one event to land inside the window.
 */
const LOOP_MARGIN_SECONDS = 0.35;

/** How far into a video to look for the first non-blank frame. */
const MAX_LEAD_IN_SECONDS = 4;
const LEAD_IN_STEP_SECONDS = 0.2;

/**
 * Readings taken before one is cached as this film's opening guess.
 *
 * MIN_FOCUS_SAMPLES is the fewest that will be acted on at all: waiting for the
 * full set would leave the crop wrong for the first few seconds.
 */
const FOCUS_SAMPLES = 8;
const MIN_FOCUS_SAMPLES = 3;

/**
 * Focus is tracked as the film plays rather than averaged once.
 *
 * A single anchor for a whole film only works if the film keeps its subject in
 * one place. The tribute edit does not: its slides put photo cards left, centre
 * and right in turn, and its closing card sits between 60% and 94% of the
 * width. Any one anchor therefore slices the border off some of them — which is
 * exactly the "the frame of the photo is cut off" report.
 *
 * So the reading is a moving average over the last second or so of frames, and
 * the crop eases toward it. On a slideshow that reads as a slow pan following
 * each card; on continuous footage the reading barely moves and neither does
 * the crop. The threshold keeps small wobbles from causing any movement at all.
 */
const TRACK_SAMPLE_SECONDS = 0.4;
const TRACK_SMOOTHING = 0.45;
const TRACK_EPSILON = 0.05;

/**
 * Most the anchor may move in one reading.
 *
 * A hard cut between two slides that are composed at opposite edges swings the
 * reading the full width at once. Left alone that sweeps the whole background
 * across the hero in under a second, which is far more distracting than the
 * clipping it is correcting. Capping the step turns every such cut into a slow
 * drift toward the new subject instead.
 */
const MAX_FOCUS_STEP = 0.06;

/**
 * How much a frame's busiest column must stand out from its own median before
 * the reading is treated as meaningful rather than as noise.
 */
const FLAT_PROFILE = 0.15;

/** Smallest focus change worth repainting for while still settling. */
const FOCUS_EPSILON = 0.02;

/**
 * Consecutive unreadable frames before measuring is abandoned.
 *
 * A single miss is ordinary — the frame at that instant simply is not decoded
 * yet. A canvas that cannot be read at all misses every time, and retrying it
 * on every tick for the life of the page is pointless.
 */
const MAX_FAILED_SAMPLES = 5;

export interface VideoFraming {
  /** Seconds to skip at the head of the video, and to loop back to. */
  startAt: number;
  /** Where the content sits horizontally, 0 = left edge, 1 = right edge. */
  focus: number;
}

export const DEFAULT_FRAMING: VideoFraming = { startAt: 0, focus: 0.5 };

/**
 * Reading pixels out of a <video> taints the canvas unless the response
 * carries CORS headers, and setting `crossOrigin` on a host that does not send
 * them stops the video loading at all. So the attribute only goes on when the
 * response is known to allow it: same-origin files, and Cloudinary, which
 * serves `access-control-allow-origin: *` and is where admin uploads land.
 * Anything else plays normally and simply goes unmeasured.
 */
export function canSampleFrames(url: string): boolean {
  if (!url) return false;
  try {
    const { origin, hostname } = new URL(url, window.location.href);
    return origin === window.location.origin || hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

const cacheKey = (url: string) => `hero-framing:${url}`;

export function readCachedFraming(url: string): VideoFraming | null {
  try {
    const raw = window.sessionStorage.getItem(cacheKey(url));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VideoFraming;
    if (typeof parsed?.startAt !== "number" || typeof parsed?.focus !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedFraming(url: string, framing: VideoFraming): void {
  try {
    window.sessionStorage.setItem(cacheKey(url), JSON.stringify(framing));
  } catch {
    // Private mode / storage disabled. Measuring again next load is harmless.
  }
}

/** Per-column luma readings for one frame, or null if the canvas is unreadable. */
export function sampleColumns(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): { columns: Float32Array; std: number } | null {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || !video.videoWidth) return null;
  // HAVE_CURRENT_DATA or better. Drawing before the frame at the current time
  // has been decoded paints nothing, which reads as a perfectly flat frame —
  // i.e. as a blank lead-in on footage that has none.
  if (video.readyState < 2) return null;

  let pixels: Uint8ClampedArray;
  try {
    // Cleared first so an undrawn frame is transparent rather than a leftover
    // of the previous sample.
    ctx.clearRect(0, 0, COLS, ROWS);
    ctx.drawImage(video, 0, 0, COLS, ROWS);
    pixels = ctx.getImageData(0, 0, COLS, ROWS).data;
  } catch {
    // Tainted canvas despite the origin check — give up on measuring.
    return null;
  }

  // A real video frame is fully opaque. Anything less means drawImage had
  // nothing to paint, so there is no reading here to take.
  let alpha = 0;
  for (let i = 0; i < COLS * ROWS; i++) alpha += pixels[i * 4 + 3];
  if (alpha / (COLS * ROWS) < 250) return null;

  const luma = new Float32Array(COLS * ROWS);
  for (let i = 0; i < COLS * ROWS; i++) {
    const p = i * 4;
    luma[i] = 0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2];
  }

  let total = 0;
  for (let i = 0; i < luma.length; i++) total += luma[i];
  const frameMean = total / luma.length;
  let variance = 0;
  for (let i = 0; i < luma.length; i++) variance += (luma[i] - frameMean) ** 2;
  const std = Math.sqrt(variance / luma.length);

  // Column "energy": vertical detail plus a little brightness. Detail is what
  // separates a photograph from a flat backdrop; the brightness term stops a
  // busy but near-black region from outweighing a lit one.
  const columns = new Float32Array(COLS);
  let peak = 0;
  for (let x = 0; x < COLS; x++) {
    let sum = 0;
    for (let y = 0; y < ROWS; y++) sum += luma[y * COLS + x];
    const mean = sum / ROWS;
    let v = 0;
    for (let y = 0; y < ROWS; y++) v += (luma[y * COLS + x] - mean) ** 2;
    const energy = Math.sqrt(v / ROWS) + 0.5 * mean;
    columns[x] = energy;
    if (energy > peak) peak = energy;
  }
  if (peak > 0) for (let x = 0; x < COLS; x++) columns[x] /= peak;

  return { columns, std };
}

/**
 * Horizontal centre of the content, from averaged column energies.
 *
 * Weighted by how far each column rises *above the median* rather than by its
 * raw energy. A plain centroid of a frame that is busy on one side and merely
 * non-black on the other lands near the middle and corrects nothing; measuring
 * against the median asks "where is this frame more interesting than its own
 * baseline", which is the thing worth keeping in shot.
 */
export function focusFromColumns(mean: Float32Array): number {
  const sorted = Float32Array.from(mean).sort();
  const median = sorted[Math.floor(sorted.length / 2)];
  const peak = sorted[sorted.length - 1];

  // Footage that fills its frame evenly — an aerial run along a pipeline, say —
  // has no side that is more interesting than the other, and the small
  // differences that remain are noise. Chasing them makes the crop wander for
  // no reason, so a frame this flat is simply left centred.
  if (peak <= 0 || (peak - median) / peak < FLAT_PROFILE) return 0.5;

  let weighted = 0;
  let weight = 0;
  for (let x = 0; x < mean.length; x++) {
    const w = Math.max(0, mean[x] - median);
    weighted += w * x;
    weight += w;
  }
  if (weight <= 0) return 0.5;

  const focus = weighted / weight / (mean.length - 1);
  // Never ask for an extreme crop off one edge, however lopsided the reading.
  return Math.min(0.8, Math.max(0.2, focus));
}

/**
 * The `object-position` that keeps `focus` in shot for a given box.
 *
 * The correction is scaled by how much of the frame is actually being thrown
 * away. When a box is nearly the video's own shape almost everything is
 * visible, there is nothing to rescue, and shifting anyway would crop a strip
 * off the other side for no reason — so the shift fades out as the crop eases
 * and desktop is left centred.
 */
export function objectPositionFor(
  focus: number,
  boxWidth: number,
  boxHeight: number,
  videoAspect: number,
): string {
  if (!boxWidth || !boxHeight || !videoAspect) return "50% 50%";

  const boxAspect = boxWidth / boxHeight;
  // Fraction of the video's width that survives an object-cover crop.
  const visible = boxAspect >= videoAspect ? 1 : boxAspect / videoAspect;
  if (visible >= 1) return "50% 50%";

  const ideal = (focus - visible / 2) / (1 - visible);
  const strength = Math.min(1, Math.max(0, (0.85 - visible) / 0.45));
  const position = Math.min(1, Math.max(0, 0.5 + (ideal - 0.5) * strength));

  return `${(position * 100).toFixed(1)}% 50%`;
}

/** Whether a frame at `time` is blank, used while hunting for the lead-in. */
export function isBlank(std: number): boolean {
  return std < BLANK_STD;
}

export const framingConstants = {
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
};
