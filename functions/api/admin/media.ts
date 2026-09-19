import type { Env } from "../../_lib/env";
import { badRequest, json, unauthorized } from "../../_lib/env";
import { isAuthenticated } from "../../_lib/auth";
import { uploadToCloudinary, listCloudinaryResources } from "../../_lib/cloudinary";

/**
 * Which content keys reference a given URL.
 *
 * Content is stored as one JSON document per key, so a substring match over
 * the raw JSON is both sufficient and exact here: these URLs are long,
 * unique Cloudinary secure_urls, and they only ever appear as whole string
 * values. This is what makes it safe to offer deletion at all — without it
 * an admin could remove the image a live page is still pointing at.
 */
function findUsage(contentRows: { key: string; value: string }[], url: string): string[] {
  if (!url) return [];
  return contentRows.filter((r) => r.value.includes(url)).map((r) => r.key);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const { results } = await env.DB.prepare(
    "SELECT id, filename, content_type, size, public_id, resource_type, url, created_at FROM media ORDER BY created_at DESC"
  ).all<{
    id: string; filename: string; content_type: string; size: number;
    public_id: string; resource_type: string; url: string; created_at: string;
  }>();

  const content = await env.DB.prepare("SELECT key, value FROM content").all<{ key: string; value: string }>();
  const contentRows = content.results ?? [];

  const items = (results ?? []).map((row) => {
    const usedBy = findUsage(contentRows, row.url);
    return {
      id: row.id,
      filename: row.filename,
      contentType: row.content_type,
      size: row.size,
      createdAt: row.created_at,
      url: row.url,
      publicId: row.public_id,
      usedBy,
      inUse: usedBy.length > 0,
    };
  });

  // Reconcile against what Cloudinary actually holds. Files uploaded before
  // this panel existed have no media row, so they can only be found — and
  // therefore only be cleaned up — from Cloudinary's own listing.
  let strays: unknown[] = [];
  let cloudinaryError: string | null = null;
  if (new URL(request.url).searchParams.get("reconcile") === "1") {
    try {
      const known = new Set(items.map((i) => i.publicId));
      strays = (await listCloudinaryResources(env))
        .filter((r) => !known.has(r.publicId))
        .map((r) => ({
          publicId: r.publicId,
          resourceType: r.resourceType,
          url: r.url,
          size: r.bytes,
          createdAt: r.createdAt,
          usedBy: findUsage(contentRows, r.url),
          inUse: findUsage(contentRows, r.url).length > 0,
        }));
    } catch (e) {
      cloudinaryError = e instanceof Error ? e.message : "Cloudinary listing failed";
    }
  }

  return json({
    items,
    strays,
    cloudinaryError,
    totalBytes: items.reduce((n, i) => n + (i.size || 0), 0),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return badRequest("Missing file");

  const id = crypto.randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  const contentType = file.type || "application/octet-stream";

  const uploaded = await uploadToCloudinary(env, file);

  await env.DB.prepare(
    "INSERT INTO media (id, filename, content_type, size, public_id, resource_type, url, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, datetime('now'))"
  )
    .bind(id, safeName, contentType, uploaded.bytes, uploaded.publicId, uploaded.resourceType, uploaded.url)
    .run();

  return json({ id, filename: safeName, contentType, size: uploaded.bytes, url: uploaded.url });
};
