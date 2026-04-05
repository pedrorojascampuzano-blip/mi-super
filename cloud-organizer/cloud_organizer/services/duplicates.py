"""Duplicate file detection service."""

from __future__ import annotations

from typing import Any

from rich.console import Console
from rich.table import Table

from ..db import Database

console = Console()


def find_duplicates(
    db: Database,
    method: str = "hash",
) -> list[list[dict[str, Any]]]:
    """Find duplicate files across clouds.

    Args:
        db: Database instance.
        method: Detection method - 'hash' (exact content match) or 'name' (same filename).

    Returns:
        List of groups, where each group is a list of duplicate file dicts.
    """
    if method == "hash":
        groups = db.get_duplicates_by_hash()
    elif method == "name":
        groups = db.get_duplicates_by_name()
    else:
        console.print(f"[red]Unknown method: {method}. Use 'hash' or 'name'.[/red]")
        return []

    return groups


def display_duplicates(groups: list[list[dict[str, Any]]], method: str = "hash") -> None:
    """Display duplicate groups in a formatted table."""
    if not groups:
        console.print("[green]No duplicates found![/green]")
        return

    label = "content hash" if method == "hash" else "filename"
    console.print(f"\n[bold]Found {len(groups)} groups of duplicates (by {label}):[/bold]\n")

    for i, group in enumerate(groups, 1):
        table = Table(title=f"Group {i}: {group[0]['filename']}", show_lines=True)
        table.add_column("Cloud", style="cyan", width=10)
        table.add_column("Path", style="white")
        table.add_column("Size", style="green", justify="right")
        table.add_column("Modified", style="dim")

        for f in group:
            size = _human_size(f.get("size_bytes", 0))
            modified = (f.get("last_modified") or "")[:10]
            cloud_label = {
                "gdrive": "G Drive",
                "onedrive": "OneDrive",
                "dropbox": "Dropbox",
                "icloud": "iCloud",
            }.get(f["cloud_source"], f["cloud_source"])

            table.add_row(cloud_label, f["cloud_path"], size, modified)

        console.print(table)
        console.print()

    total_files = sum(len(g) for g in groups)
    potential_savings = sum(
        sum(f.get("size_bytes", 0) for f in g[1:])  # all but one copy
        for g in groups
    )
    console.print(
        f"[bold]Summary:[/bold] {total_files} files in {len(groups)} groups. "
        f"Potential savings: {_human_size(potential_savings)}"
    )


def _human_size(size_bytes: int) -> str:
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if abs(size_bytes) < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024  # type: ignore[assignment]
    return f"{size_bytes:.1f} PB"
