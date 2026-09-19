// Minimal Cloudinary client for the admin media library — signed uploads
// and deletes over fetch, no SDK (Cloudinary's Node SDK needs Node's `crypto`
// module, which isn't available in the Workers runtime Pages Functions run
// on; Web Crypto's SubtleCrypto covers the SHA-1 signing they require).
import type { Env } from "./env";

export interface CloudinaryUploadResult {
  publicId: string;
  resourceType: string;
  url: string;
  bytes: number;
}

async function sha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Cloudinary's signing scheme: sort every param (except file/api_key/
// signature) alphabetically, join as "key=value&key=value", append the API
// secret, then SHA-1 hex the whole thing.
async function signParams(params: Record<string, string>, apiSecret: string): Promise<string> {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return sha1Hex(sorted + apiSecret);
}

export async function uploadToCloudinary(env: Env, file: File): Promise<CloudinaryUploadResult> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign = { folder: "anand-techno-fab", timestamp };
  const signature = await signParams(paramsToSign, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.set("file", file);
  form.set("api_key", env.CLOUDINARY_API_KEY);
  form.set("timestamp", timestamp);
  form.set("folder", paramsToSign.folder);
  form.set("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}): ${detail}`);
  }
  const data = (await res.json()) as {
    public_id: string;
    resource_type: string;
    secure_url: string;
    bytes: number;
  };
  return {
    publicId: data.public_id,
    resourceType: data.resource_type,
    url: data.secure_url,
    bytes: data.bytes,
  };
}

export async function deleteFromCloudinary(env: Env, publicId: string, resourceType: string): Promise<void> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign = { public_id: publicId, timestamp };
  const signature = await signParams(paramsToSign, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.set("public_id", publicId);
  form.set("api_key", env.CLOUDINARY_API_KEY);
  form.set("timestamp", timestamp);
  form.set("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Cloudinary delete failed (${res.status}): ${detail}`);
  }
}

export interface CloudinaryResource {
  publicId: string;
  resourceType: string;
  url: string;
  bytes: number;
  createdAt: string;
}

/**
 * Lists everything actually stored in the account's folder, via Cloudinary's
 * Admin API (Basic auth with the API key/secret rather than a signed upload
 * form).
 *
 * The `media` table only knows about files uploaded through this admin panel.
 * Anything uploaded before it existed, or through the Cloudinary dashboard,
 * is invisible to the panel and can never be cleaned up from here — which
 * matters because nobody on this project has Cloudinary dashboard access.
 * This is what lets the panel show, and remove, those strays too.
 */
export async function listCloudinaryResources(env: Env): Promise<CloudinaryResource[]> {
  const auth = btoa(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`);
  const out: CloudinaryResource[] = [];

  // Images and videos are separate resource types and must be paged separately.
  for (const type of ["image", "video"] as const) {
    let cursor: string | undefined;
    do {
      const qs = new URLSearchParams({
        type: "upload",
        prefix: "anand-techno-fab",
        max_results: "100",
      });
      if (cursor) qs.set("next_cursor", cursor);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/resources/${type}?${qs}`,
        { headers: { Authorization: `Basic ${auth}` } }
      );
      if (!res.ok) {
        // A missing resource type (e.g. no videos yet) must not fail the listing.
        if (res.status === 404) break;
        const detail = await res.text().catch(() => "");
        throw new Error(`Cloudinary list failed (${res.status}): ${detail}`);
      }
      const data = (await res.json()) as {
        resources?: { public_id: string; resource_type: string; secure_url: string; bytes: number; created_at: string }[];
        next_cursor?: string;
      };
      for (const r of data.resources ?? []) {
        out.push({
          publicId: r.public_id,
          resourceType: r.resource_type,
          url: r.secure_url,
          bytes: r.bytes,
          createdAt: r.created_at,
        });
      }
      cursor = data.next_cursor;
    } while (cursor);
  }

  return out;
}
