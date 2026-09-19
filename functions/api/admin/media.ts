import type { Env } from "../../_lib/env";
import { badRequest, json, unauthorized } from "../../_lib/env";
import { isAuthenticated } from "../../_lib/auth";
import { uploadToCloudinary } from "../../_lib/cloudinary";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const { results } = await env.DB.prepare(
    "SELECT id, filename, content_type, size, url, created_at FROM media ORDER BY created_at DESC"
  ).all<{ id: string; filename: string; content_type: string; size: number; url: string; created_at: string }>();

  const items = (results ?? []).map((row) => ({
    id: row.id,
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    createdAt: row.created_at,
    url: row.url,
  }));

  return json({ items });
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
