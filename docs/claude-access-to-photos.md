# Claude Code access to mi-super item photos

This doc explains how a Claude Code session running locally on Pedro's Mac can read the photos that mi-super users upload for each pantry item.

## Architecture

1. The PWA uploads photos to Supabase Storage bucket `item-photos` (public).
2. Each item row in `public.items` stores the public URL in `photo_url`.
3. `scripts/sync-photos.mjs` downloads every photo for one group into `photos/` so the Read tool can open them as images.

## URL pattern

```
https://ffkruigqwgzvqhdxvgjv.supabase.co/storage/v1/object/public/item-photos/<group_id>/<item_id>-<timestamp>.<ext>
```

The bucket is public, so any URL pattern above is fetchable without auth headers.

## Listing items + photos via REST

For Pedro's group (read requires either RLS membership or the service role key):

```sh
curl "https://ffkruigqwgzvqhdxvgjv.supabase.co/rest/v1/items?group_id=eq.<UUID>&photo_url=not.is.null&select=id,name,category,photo_url" \
     -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## Local sync (recommended for Claude)

```sh
cd ~/Projects/personal/mi-super
GROUP_ID=<uuid> SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/sync-photos.mjs
```

Produces:

- `photos/<slug>__<id8>.jpg` — one file per item with a photo.
- `photos/_index.json` — array of `{item_id, name, category, photo_url, local_path, sha256}`.

Then in Claude Code:

```
Read("/Users/pedro/Projects/personal/mi-super/photos/_index.json")
Read("/Users/pedro/Projects/personal/mi-super/photos/paprika__a1b2c3d4.jpg")
```

The Read tool returns image bytes directly to Claude, so it can identify brand, count, condition, expiry date stamped on the bottle, etc.

## Where to get credentials

- `SUPABASE_SERVICE_ROLE_KEY` → https://supabase.com/dashboard/project/ffkruigqwgzvqhdxvgjv/settings/api-keys (only Pedro sees this; never commit).
- `GROUP_ID` → SQL Editor: `select id, name, code from groups order by created_at;` or pull from the app settings panel.

## Cron / automation

To keep photos fresh, add to `~/Library/LaunchAgents/com.misuper.photosync.plist` running every 6 h:

```sh
GROUP_ID=<uuid> SUPABASE_SERVICE_ROLE_KEY=<key> /usr/local/bin/node ~/Projects/personal/mi-super/scripts/sync-photos.mjs
```

(Not auto-installed; create only if Pedro wants background sync.)
