import type { Env } from "../../../_lib/env";
import { badRequest, json, notFound, unauthorized } from "../../../_lib/env";
import { isAuthenticated } from "../../../_lib/auth";
import { deleteFromCloudinary } from "../../../_lib/cloudinary";

/**
 * Deletes an uploaded file from Cloudinary and forgets it locally.
 *
 * Two shapes of id are accepted:
 *  - a media row id (uuid), for anything uploaded through this panel;
 *  - the literal `stray`, with `?publicId=&resourceType=`, for files that
 *    exist in Cloudinary but have no media row — uploads that predate this
 *    panel. Without this second form those files could never be removed by
 *    anyone without Cloudinary dashboard access.
 *
 * A file still referenced by page content is refused unless `?force=1`, so a
 * routine cleanup cannot blank an image that a live page is pointing at.
 */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const id = String(params.id || "");
  const force = new URL(request.url).searchParams.get("force") === "1";

  let publicId: string;
  let resourceType: string;
  let url: string | null = null;
  let mediaRowId: string | null = null;

  if (id === "stray") {
    // Cloudinary public ids contain slashes ("anand-techno-fab/abc123"), which
    // cannot travel in a single path segment — even percent-encoded, routers
    // are inconsistent about whether %2F stays within the segment. They come
    // through the query string instead.
    const qs = new URL(request.url).searchParams;
    publicId = qs.get("publicId") || "";
    resourceType = qs.get("resourceType") === "video" ? "video" : "image";
    if (!publicId) return badRequest("Missing publicId");
  } else {
    const row = await env.DB.prepare(
      "SELECT id, public_id, resource_type, url FROM media WHERE id = ?1"
    )
      .bind(id)
      .first<{ id: string; public_id: string; resource_type: string; url: string }>();
    if (!row) return notFound("Media not found");
    publicId = row.public_id;
    resourceType = row.resource_type;
    url = row.url;
    mediaRowId = row.id;
  }

  // Refuse to remove something a page still points at.
  if (!force && url) {
    const content = await env.DB.prepare("SELECT key, value FROM content").all<{ key: string; value: string }>();
    const usedBy = (content.results ?? []).filter((r) => r.value.includes(url as string)).map((r) => r.key);
    if (usedBy.length > 0) {
      return json(
        { error: `Still used by: ${usedBy.join(", ")}. Replace it there first, or confirm to delete anyway.`, usedBy },
        { status: 409 }
      );
    }
  }

  await deleteFromCloudinary(env, publicId, resourceType);
  if (mediaRowId) {
    await env.DB.prepare("DELETE FROM media WHERE id = ?1").bind(mediaRowId).run();
  }

  return json({ ok: true });
};
