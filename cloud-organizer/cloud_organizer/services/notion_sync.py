"""Notion database sync service."""

from __future__ import annotations

import time
from typing import Any

from rich.console import Console

from ..db import Database

console = Console()

NOTION_RATE_LIMIT_DELAY = 0.35  # ~3 requests per second


def sync_to_notion(
    db: Database,
    config: dict[str, Any],
    cloud_filter: str | None = None,
    force: bool = False,
) -> dict[str, int]:
    """Sync indexed files to a Notion database.

    Args:
        db: Database instance.
        config: Full application config.
        cloud_filter: Only sync files from this cloud source.
        force: Re-sync all files even if already synced.

    Returns:
        Dict with 'created', 'updated', and 'errors' counts.
    """
    from notion_client import Client as NotionClient

    notion_config = config.get("notion", {})
    api_key = notion_config.get("api_key", "")
    database_id = notion_config.get("database_id", "")

    if not api_key or not database_id:
        console.print("[red]Notion API key or database ID not configured[/red]")
        return {"created": 0, "updated": 0, "errors": 0}

    notion = NotionClient(auth=api_key)
    stats = {"created": 0, "updated": 0, "errors": 0}

    files, total = db.get_files(cloud=cloud_filter, per_page=10000)
    console.print(f"[blue]Syncing {total} files to Notion...[/blue]")

    for i, file_data in enumerate(files):
        try:
            # Skip already synced unless forced
            if file_data.get("notion_page_id") and not force:
                continue

            tags = file_data.get("tags", "") or ""
            tag_list = [t.strip() for t in tags.split(",") if t.strip()]

            properties = _build_notion_properties(file_data, tag_list)

            if file_data.get("notion_page_id"):
                # Update existing page
                notion.pages.update(
                    page_id=file_data["notion_page_id"],
                    properties=properties,
                )
                stats["updated"] += 1
            else:
                # Check if page already exists by filename + cloud
                existing = _find_existing_page(notion, database_id, file_data)
                if existing:
                    notion.pages.update(page_id=existing, properties=properties)
                    db.mark_notion_synced(file_data["id"], existing)
                    stats["updated"] += 1
                else:
                    page = notion.pages.create(
                        parent={"database_id": database_id},
                        properties=properties,
                    )
                    db.mark_notion_synced(file_data["id"], page["id"])
                    stats["created"] += 1

            if (i + 1) % 50 == 0:
                console.print(f"  [dim]...{i + 1}/{total} processed[/dim]")

        except Exception as e:
            stats["errors"] += 1
            console.print(f"  [red]Error syncing {file_data['filename']}: {e}[/red]")

        time.sleep(NOTION_RATE_LIMIT_DELAY)

    console.print(
        f"[green]Done: {stats['created']} created, {stats['updated']} updated, "
        f"{stats['errors']} errors[/green]"
    )
    return stats


def _build_notion_properties(file_data: dict, tags: list[str]) -> dict[str, Any]:
    """Build Notion page properties from file data."""
    cloud_label = {
        "gdrive": "Google Drive",
        "onedrive": "OneDrive",
        "dropbox": "Dropbox",
        "icloud": "iCloud",
    }.get(file_data["cloud_source"], file_data["cloud_source"])

    ext = (file_data.get("extension") or "").lstrip(".")

    properties: dict[str, Any] = {
        "Name": {"title": [{"text": {"content": file_data["filename"]}}]},
        "File Type": {"select": {"name": ext.upper() if ext else "Unknown"}},
        "Size": {"number": file_data.get("size_bytes", 0)},
        "Cloud Locations": {"multi_select": [{"name": cloud_label}]},
        "Cloud Path": {"rich_text": [{"text": {"content": file_data.get("cloud_path", "")}}]},
    }

    if tags:
        properties["Tags"] = {
            "multi_select": [{"name": t} for t in tags[:25]]  # Notion limit
        }

    link = file_data.get("direct_link", "")
    if link:
        properties["Link"] = {"url": link}

    if file_data.get("last_scanned"):
        properties["Last Scanned"] = {
            "date": {"start": file_data["last_scanned"][:10]}
        }

    content_hash = file_data.get("content_hash", "")
    if content_hash:
        properties["Content Hash"] = {
            "rich_text": [{"text": {"content": content_hash[:50]}}]
        }

    return properties


def _find_existing_page(
    notion: Any,
    database_id: str,
    file_data: dict,
) -> str | None:
    """Search Notion DB for an existing page matching this file."""
    try:
        response = notion.databases.query(
            database_id=database_id,
            filter={
                "and": [
                    {"property": "Name", "title": {"equals": file_data["filename"]}},
                ]
            },
            page_size=1,
        )
        results = response.get("results", [])
        if results:
            return results[0]["id"]
    except Exception:
        pass
    return None
