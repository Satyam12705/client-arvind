import type { Env } from "./env";
import { deleteFromCloudinary } from "./cloudinary";

/** Only ever matches files we host on Cloudinary. */
const CLOUDINARY_URL_RE = /https:\/\/res\.cloudinary\.com\/[^"'\\\s)]+/g;

/**
 * Cloudinary URLs appearing anywhere in a JSON document.
 *
 * Scanning the serialised JSON rather than walking the object means this keeps
 * working whatever shape the content takes — admins can add fields the code
 * has never seen, and any image they put there is still accounted for.
 */
export function extractCloudinaryUrls(value: unknown): Set<string> {
  const json = JSON.stringify(value ?? null);
  return new Set(json.match(CLOUDINARY_URL_RE) ?? []);
}

export interface CleanedFile {
  url: string;
  filename: string;
}

/**
 * Deletes files that a save has just orphaned.
 *
 * Run *after* the new content is written, so "is it still referenced?" is
 * asked of the final state of the site rather than a half-applied one.
 *
 * Three deliberate limits, because this destroys files permanently and the
 * person triggering it is an editor who may simply have mis-clicked:
 *
 *  - only URLs that were in the previous version of this key and are not in
 *    the new one are even considered;
 *  - a candidate still referenced by ANY content key — including this one, and
 *    including a different section reusing the same photo — is kept. This is
 *    what stops swapping an image on one page from blanking it on another;
 *  - only files tracked in the `media` table are removed, since an untracked
 *    file has no stored public_id. Those remain visible under "check
 *    Cloudinary for untracked files" in the media library.
 *
 * Failures are swallowed: losing a cleanup is an inconvenience, but failing
 * the editor's save because of one would lose their actual work.
 */
export async function collectOrphanedMedia(
  env: Env,
  previousValue: unknown,
  nextValue: unknown
): Promise<CleanedFile[]> {
  const before = extractCloudinaryUrls(previousValue);
  if (before.size === 0) return [];

  const after = extractCloudinaryUrls(nextValue);
  const dropped = [...before].filter((url) => !after.has(url));
  if (dropped.length === 0) return [];

  // Re-read all content *after* the write, so a URL still used anywhere is safe.
  const { results } = await env.DB.prepare("SELECT value FROM content").all<{ value: string }>();
  const allContent = (results ?? []).map((r) => r.value).join("\n");

  const cleaned: CleanedFile[] = [];
  for (const url of dropped) {
    if (allContent.includes(url)) continue; // still in use somewhere

    const row = await env.DB.prepare(
      "SELECT id, filename, public_id, resource_type FROM media WHERE url = ?1"
    )
      .bind(url)
      .first<{ id: string; filename: string; public_id: string; resource_type: string }>();
    if (!row) continue; // untracked upload — leave it for manual cleanup

    try {
      await deleteFromCloudinary(env, row.public_id, row.resource_type);
      await env.DB.prepare("DELETE FROM media WHERE id = ?1").bind(row.id).run();
      cleaned.push({ url, filename: row.filename });
    } catch {
      // Leave the file in place; the media library can still remove it by hand.
    }
  }

  return cleaned;
}
