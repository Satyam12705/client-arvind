import { useEffect, useRef, useState } from "react";
import {
  listMedia,
  uploadMedia,
  deleteMedia,
  deleteStrayMedia,
  type StrayMedia,
  type MediaListing,
} from "../../lib/adminApi";

function formatBytes(n: number): string {
  if (!n) return "0 KB";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPicker({
  value,
  onChange,
  kind = "image",
}: {
  value: string;
  onChange: (url: string) => void;
  kind?: "image" | "video";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const item = await uploadMedia(file);
      onChange(item.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-neutral-700 bg-neutral-900 p-3 rounded">
      <div className="flex items-start gap-3">
        <div className="w-24 h-16 shrink-0 bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
          {value ? (
            kind === "video" ? (
              <video src={value} className="w-full h-full object-cover" muted />
            ) : (
              <img src={value} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <span className="text-[10px] text-neutral-500">No file</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/example.jpg"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="text-xs px-2.5 py-1 bg-rust text-white rounded hover:bg-rust-dark disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="text-xs px-2.5 py-1 border border-neutral-600 text-neutral-200 rounded hover:border-neutral-400"
            >
              Choose from library
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept={kind === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {showLibrary && (
        <LibraryModal
          onPick={(url) => {
            onChange(url);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

function LibraryModal({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [data, setData] = useState<MediaListing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Reconciling asks Cloudinary for its real contents, which is slower, so it
  // is opt-in rather than done on every open.
  const [reconcile, setReconcile] = useState(false);

  const load = (withReconcile: boolean) => {
    setData(null);
    setError(null);
    listMedia(withReconcile)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load media"));
  };

  useEffect(() => {
    load(reconcile);
  }, [reconcile]);

  // `key` is only used to drive the per-tile busy state; `run` performs the
  // actual delete, which differs for tracked files and Cloudinary strays.
  const remove = async (
    key: string,
    label: string,
    inUse: boolean,
    usedBy: string[],
    run: (force: boolean) => Promise<unknown>
  ) => {
    const warning = inUse
      ? `"${label}" is still used by: ${usedBy.join(", ")}.\n\nDeleting it will leave those places without an image. Delete anyway?`
      : `Delete "${label}" permanently from Cloudinary? This cannot be undone.`;
    if (!window.confirm(warning)) return;
    setBusy(key);
    setNotice(null);
    setError(null);
    try {
      await run(inUse);
      setNotice(`Deleted ${label}`);
      load(reconcile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  const unused = (data?.items ?? []).filter((i) => !i.inUse);

  const removeAllUnused = async () => {
    if (!window.confirm(`Delete all ${unused.length} unused file(s) from Cloudinary? This cannot be undone.`)) return;
    setBusy("bulk");
    setNotice(null);
    let ok = 0;
    for (const item of unused) {
      try {
        await deleteMedia(item.id);
        ok++;
      } catch {
        // keep going — one failure should not abort the sweep
      }
    }
    setBusy(null);
    setNotice(`Deleted ${ok} of ${unused.length} unused file(s)`);
    load(reconcile);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-neutral-100">Media Library</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100 text-sm">
            Close
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-neutral-400">
          {data && (
            <span>
              {data.items.length} file(s) · {formatBytes(data.totalBytes)} · {unused.length} unused
            </span>
          )}
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={reconcile} onChange={(e) => setReconcile(e.target.checked)} />
            Also check Cloudinary for untracked files
          </label>
          {unused.length > 0 && (
            <button
              type="button"
              onClick={removeAllUnused}
              disabled={busy !== null}
              className="px-2.5 py-1 border border-red-700 text-red-300 rounded hover:bg-red-950 disabled:opacity-50"
            >
              {busy === "bulk" ? "Deleting…" : `Delete ${unused.length} unused`}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        {notice && <p className="text-sm text-green-400 mb-3">{notice}</p>}
        {!data && !error && <p className="text-sm text-neutral-400">Loading…</p>}
        {data?.cloudinaryError && (
          <p className="text-xs text-amber-400 mb-3">Cloudinary check failed: {data.cloudinaryError}</p>
        )}
        {data && data.items.length === 0 && <p className="text-sm text-neutral-400">No uploads yet.</p>}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.items.map((item) => (
              <Tile
                key={item.id}
                url={item.url}
                label={item.filename}
                size={item.size}
                isVideo={item.contentType.startsWith("video/")}
                inUse={!!item.inUse}
                usedBy={item.usedBy ?? []}
                busy={busy === item.id}
                onPick={() => onPick(item.url)}
                onDelete={() =>
                  remove(item.id, item.filename, !!item.inUse, item.usedBy ?? [], (force) =>
                    deleteMedia(item.id, force)
                  )
                }
              />
            ))}
          </div>
        )}

        {data && data.strays.length > 0 && (
          <>
            <p className="mt-6 mb-2 text-xs font-medium text-amber-300">
              In Cloudinary but not tracked here ({data.strays.length}) — uploads that predate this panel
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.strays.map((s: StrayMedia) => (
                <Tile
                  key={s.publicId}
                  url={s.url}
                  label={s.publicId.split("/").pop() || s.publicId}
                  size={s.size}
                  isVideo={s.resourceType === "video"}
                  inUse={s.inUse}
                  usedBy={s.usedBy}
                  busy={busy === s.publicId}
                  onPick={() => onPick(s.url)}
                  onDelete={() =>
                    remove(s.publicId, s.publicId, s.inUse, s.usedBy, (force) =>
                      deleteStrayMedia(s.publicId, s.resourceType, force)
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Tile({
  url, label, size, isVideo, inUse, usedBy, busy, onPick, onDelete,
}: {
  url: string; label: string; size: number; isVideo: boolean;
  inUse: boolean; usedBy: string[]; busy: boolean;
  onPick: () => void; onDelete: () => void;
}) {
  return (
    <div className="relative border border-neutral-700 rounded overflow-hidden bg-neutral-800 group">
      <button type="button" onClick={onPick} className="block w-full aspect-square hover:opacity-80" title={label}>
        {isVideo ? (
          <video src={url} className="w-full h-full object-cover" muted />
        ) : (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        )}
      </button>

      <span
        className={`absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded ${
          inUse ? "bg-green-900/90 text-green-200" : "bg-neutral-950/90 text-neutral-400"
        }`}
        title={inUse ? `Used by: ${usedBy.join(", ")}` : "Not referenced by any page"}
      >
        {inUse ? "in use" : "unused"}
      </span>

      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label={`Delete ${label}`}
        className="absolute top-1 right-1 text-[10px] w-5 h-5 rounded bg-neutral-950/90 text-neutral-400 hover:bg-red-800 hover:text-white disabled:opacity-50"
      >
        {busy ? "…" : "\u00d7"}
      </button>

      <div className="px-1.5 py-1 bg-neutral-950/80">
        <p className="text-[9px] text-neutral-300 truncate" title={label}>{label}</p>
        <p className="text-[9px] text-neutral-500">{formatBytes(size)}</p>
      </div>
    </div>
  );
}
