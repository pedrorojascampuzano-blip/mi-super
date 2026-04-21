"""File indexer - orchestrates scanning across cloud connectors and writing to DB."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from rich.console import Console

from ..connectors import CONNECTORS
from ..db import Database
from ..models import CloudSource, ScanResult

console = Console()


def run_scan(
    db: Database,
    config: dict[str, Any],
    source: str = "all",
    path_filter: str | None = None,
) -> list[ScanResult]:
    """Scan one or all cloud sources and index files into the database.

    Args:
        db: Database instance.
        config: Full application config.
        source: Cloud source key ('gdrive', 'onedrive', 'dropbox', 'icloud', 'all').
        path_filter: Optional path prefix to limit scan scope.

    Returns:
        List of ScanResult for each scanned source.
    """
    db.init_schema()
    results = []

    sources_to_scan = list(CONNECTORS.keys()) if source == "all" else [source]

    for src_key in sources_to_scan:
        connector_cls = CONNECTORS.get(src_key)
        if not connector_cls:
            console.print(f"[yellow]Unknown source: {src_key}, skipping[/yellow]")
            continue

        cloud_config = config.get(src_key, config.get(_config_key(src_key), {}))
        if not _is_configured(src_key, cloud_config):
            console.print(f"[dim]{src_key} not configured, skipping[/dim]")
            continue

        result = ScanResult(
            cloud_source=CloudSource(src_key),
            started_at=datetime.utcnow(),
        )
        log_id = db.log_scan_start(result)

        console.print(f"\n[bold blue]Scanning {src_key}...[/bold blue]")

        try:
            connector = connector_cls(cloud_config)
            connector.authenticate()

            for file_record in connector.scan(path_filter):
                try:
                    is_new = db.upsert_file(file_record)
                    result.files_found += 1
                    if is_new:
                        result.files_new += 1
                    else:
                        result.files_updated += 1

                    if result.files_found % 100 == 0:
                        console.print(f"  [dim]...{result.files_found} files processed[/dim]")

                except Exception as e:
                    result.errors += 1
                    console.print(f"  [red]Error indexing {file_record.filename}: {e}[/red]")

        except Exception as e:
            console.print(f"[red]Failed to scan {src_key}: {e}[/red]")
            result.errors += 1

        result.completed_at = datetime.utcnow()
        db.log_scan_complete(log_id, result)

        console.print(
            f"  [green]Done:[/green] {result.files_found} found, "
            f"{result.files_new} new, {result.files_updated} updated, "
            f"{result.errors} errors"
        )
        results.append(result)

    return results


def _config_key(src_key: str) -> str:
    """Map connector key to config section name."""
    mapping = {
        "gdrive": "google_drive",
        "onedrive": "onedrive",
        "dropbox": "dropbox",
        "icloud": "icloud",
    }
    return mapping.get(src_key, src_key)


def _is_configured(src_key: str, cloud_config: dict) -> bool:
    """Check if a cloud source has minimum required configuration."""
    if src_key == "gdrive":
        return bool(cloud_config.get("credentials_file"))
    elif src_key == "onedrive":
        return bool(cloud_config.get("client_id"))
    elif src_key == "dropbox":
        return bool(cloud_config.get("access_token"))
    elif src_key == "icloud":
        return bool(cloud_config.get("local_path"))
    return False
