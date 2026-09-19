export interface MediaItem {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
  url: string;
  publicId?: string;
  /** Content keys that still reference this file. */
  usedBy?: string[];
  inUse?: boolean;
}

/** A file present in Cloudinary with no matching media row. */
export interface StrayMedia {
  publicId: string;
  resourceType: string;
  url: string;
  size: number;
  createdAt: string;
  usedBy: string[];
  inUse: boolean;
}

export interface MediaListing {
  items: MediaItem[];
  strays: StrayMedia[];
  cloudinaryError: string | null;
  totalBytes: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, credentials: "include" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function checkAuth(): Promise<{ authenticated: boolean }> {
  return request("/api/admin/me");
}

export function login(password: string): Promise<{ ok: true }> {
  return request("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export function logout(): Promise<{ ok: true }> {
  return request("/api/admin/logout", { method: "POST" });
}

export interface SaveResult {
  ok: true;
  /** Files removed from Cloudinary because this save left them unreferenced. */
  cleaned?: { url: string; filename: string }[];
}

export function saveContent(key: string, value: unknown): Promise<SaveResult> {
  return request(`/api/admin/content/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
}

export function listMedia(reconcile = false): Promise<MediaListing> {
  // `reconcile` additionally asks Cloudinary what it actually holds, which is
  // a slower call, so the picker only does it from the cleanup view.
  return request(`/api/admin/media${reconcile ? "?reconcile=1" : ""}`);
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", credentials: "include", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed (${res.status})`);
  }
  return res.json();
}

export function deleteMedia(id: string, force = false): Promise<{ ok: true }> {
  const qs = force ? "?force=1" : "";
  return request(`/api/admin/media/${encodeURIComponent(id)}${qs}`, { method: "DELETE" });
}

/** Removes a Cloudinary file that has no media row (an upload predating this panel). */
export function deleteStrayMedia(
  publicId: string,
  resourceType: string,
  force = false
): Promise<{ ok: true }> {
  const qs = new URLSearchParams({ publicId, resourceType });
  if (force) qs.set("force", "1");
  return request(`/api/admin/media/stray?${qs}`, { method: "DELETE" });
}
