import type { Env } from "../../../_lib/env";
import { badRequest, json, unauthorized } from "../../../_lib/env";
import { isAuthenticated } from "../../../_lib/auth";
import { setContent } from "../../../_lib/content";
import { collectOrphanedMedia } from "../../../_lib/mediaGc";

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const key = String(params.key || "");
  if (!/^[a-zA-Z0-9_]+$/.test(key)) return badRequest("Invalid content key");

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Read the outgoing version before overwriting it — this is the only moment
  // the images being replaced are still known.
  const existing = await env.DB.prepare("SELECT value FROM content WHERE key = ?1")
    .bind(key)
    .first<{ value: string }>();
  let previousValue: unknown = null;
  if (existing?.value) {
    try {
      previousValue = JSON.parse(existing.value);
    } catch {
      previousValue = null;
    }
  }

  await setContent(env, key, value);

  // Best-effort: an editor's save must never fail because a cleanup did.
  let cleaned: { url: string; filename: string }[] = [];
  try {
    cleaned = await collectOrphanedMedia(env, previousValue, value);
  } catch {
    cleaned = [];
  }

  return json({ ok: true, cleaned });
};
