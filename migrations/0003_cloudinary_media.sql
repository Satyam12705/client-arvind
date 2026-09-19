-- Swap the media store from Cloudflare R2 to Cloudinary. The `media` table
-- previously tracked an r2_key pointing at a (never actually provisioned —
-- the r2_buckets binding in wrangler.toml was commented out) R2 object, so
-- there is no live data to preserve here. Cloudinary hosts the file itself
-- and returns a stable secure_url directly, plus a public_id + resource_type
-- needed to delete it later via the Admin API.
DROP TABLE IF EXISTS media;

CREATE TABLE media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  public_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
