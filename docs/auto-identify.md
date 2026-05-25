# Auto-identify items from photo

mi-super has two parallel ways to fill in `name`, `category`, and `unit_*` from just a photo. Pick whichever fits the moment.

## Path A · Browser Vision (default, instant)

In the header of tab **Casa** there's a green camera button next to **+**. Tap it:

1. Native camera opens (`capture=environment` so the back camera fires on iPhone).
2. PWA uploads the shot to bucket `item-photos`.
3. A placeholder item appears with `name="Identificando…"`.
4. PWA calls Vision via the existing `callAI()` dispatcher (Gemini 2.5 Flash first, falls back to Claude haiku-4-5 and gpt-4o-mini).
5. Result patches the placeholder with `{name, category, unitCount, unitSize, unitType}`.

Failure modes:
- No API key configured → placeholder stays as "Sin identificar — toca para editar". Edit by hand.
- Vision returned invalid JSON → same fallback, with the parse error in the result toast.
- No internet → upload fails, placeholder is removed and an alert fires.

API keys live in localStorage (set via Settings ⚙️ inside the PWA). Never committed.

## Path B · Claude Code polling (always-on, runs locally)

If you want me (Claude in terminal) to identify photos uploaded from any device, run:

```sh
cd ~/Projects/personal/mi-super
ANTHROPIC_API_KEY="sk-ant-..." \
SUPABASE_SERVICE_ROLE_KEY="$(grep -A1 'Service role key' /Volumes/Vault/mi-super.md | tail -1 | tr -d '`')" \
GROUP_ID=6e5ee105-05f2-4f48-8fbe-6e9cbf4dd7f0 \
node scripts/watch-incoming-photos.mjs
```

The script:
- Polls every 5 s (override with `POLL_MS=10000`).
- Looks for items where `photo_url IS NOT NULL` and `name` is one of the placeholders.
- Calls Anthropic with the photo as base64.
- Patches the row via REST.
- Loops forever; Ctrl+C to stop.

Where to get the Anthropic key:
- Console: https://console.anthropic.com/settings/keys
- Or reuse the one you put in PWA Settings (same key works).

### As a launchd background job (optional)

Create `~/Library/LaunchAgents/com.misuper.photo-watcher.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.misuper.photo-watcher</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/Users/pedro/Projects/personal/mi-super/scripts/watch-incoming-photos.mjs</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>ANTHROPIC_API_KEY</key><string>sk-ant-...</string>
    <key>SUPABASE_SERVICE_ROLE_KEY</key><string>eyJ...</string>
    <key>GROUP_ID</key><string>6e5ee105-05f2-4f48-8fbe-6e9cbf4dd7f0</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/Users/pedro/.local/share/misuper-watcher.log</string>
  <key>StandardErrorPath</key><string>/Users/pedro/.local/share/misuper-watcher.err.log</string>
</dict>
</plist>
```

Load: `launchctl load -w ~/Library/LaunchAgents/com.misuper.photo-watcher.plist`.

## Which path to use

- Daily quick capture from iPhone → **Path A**. Instant feedback, runs entirely in the PWA.
- Bulk uploading from many devices, or want Claude (haiku) specifically for higher quality identification → **Path B**.
- Both can run side by side. The script ignores items already named.
