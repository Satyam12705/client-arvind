import type { Env } from "../../../_lib/env";
import { json, notFound, unauthorized } from "../../../_lib/env";
import { isAuthenticated } from "../../../_lib/auth";
import { deleteFromCloudinary } from "../../../_lib/cloudinary";

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const id = String(params.id || "");
  const row = await env.DB.prepare("SELECT public_id, resource_type FROM media WHERE id = ?1").bind(id).first<{
    public_id: string;
    resource_type: string;
  }>();
  if (!row) return notFound("Media not found");

  await deleteFromCloudinary(env, row.public_id, row.resource_type);
  await env.DB.prepare("DELETE FROM media WHERE id = ?1").bind(id).run();

  return json({ ok: true });
};
