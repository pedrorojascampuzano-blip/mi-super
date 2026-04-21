"""CLI interface for the Cloud File Organizer."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table

from .config import get_db_path, load_config
from .db import Database

app = typer.Typer(
    name="cloud-organizer",
    help="Index, tag, and sync files across multiple cloud services.",
    add_completion=False,
)
console = Console()


def _get_db(config: dict | None = None) -> Database:
    if config is None:
        config = load_config()
    db = Database(get_db_path(config))
    db.init_schema()
    return db


@app.command()
def scan(
    source: str = typer.Option("all", "--source", "-s", help="Cloud source: gdrive, onedrive, dropbox, icloud, all"),
    path_filter: Optional[str] = typer.Option(None, "--path", "-p", help="Path prefix to limit scan scope"),
    config_path: Optional[Path] = typer.Option(None, "--config", "-c", help="Path to config.yaml"),
) -> None:
    """Scan and index files from cloud services."""
    from .services.indexer import run_scan

    config = load_config(config_path)
    db = _get_db(config)

    try:
        results = run_scan(db, config, source=source, path_filter=path_filter)
        if not results:
            console.print("[yellow]No sources were scanned. Check your config.yaml[/yellow]")
    finally:
        db.close()


@app.command()
def status() -> None:
    """Show database statistics and last scan info."""
    config = load_config()
    db = _get_db(config)

    try:
        stats = db.get_stats()

        table = Table(title="Cloud File Organizer - Status")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="green", justify="right")

        table.add_row("Total files indexed", str(stats["total_files"]))
        for cloud, count in stats["by_cloud"].items():
            label = {"gdrive": "Google Drive", "onedrive": "OneDrive", "dropbox": "Dropbox", "icloud": "iCloud"}.get(cloud, cloud)
            table.add_row(f"  {label}", str(count))
        table.add_row("Unique tags", str(stats["total_tags"]))
        table.add_row("Synced to Notion", str(stats["notion_synced"]))

        last_scan = db.get_last_scan()
        if last_scan:
            table.add_row("Last scan", f"{last_scan['cloud_source']} @ {last_scan.get('completed_at', 'in progress')}")

        console.print(table)
    finally:
        db.close()


@app.command(name="list")
def list_files(
    cloud: Optional[str] = typer.Option(None, "--cloud", help="Filter by cloud source"),
    file_type: Optional[str] = typer.Option(None, "--type", "-t", help="Filter by file extension"),
    tag: Optional[str] = typer.Option(None, "--tag", help="Filter by tag"),
    search: Optional[str] = typer.Option(None, "--search", "-q", help="Search by filename"),
    page: int = typer.Option(1, "--page", help="Page number"),
    per_page: int = typer.Option(50, "--per-page", help="Results per page"),
) -> None:
    """List indexed files with optional filters."""
    config = load_config()
    db = _get_db(config)

    try:
        files, total = db.get_files(
            cloud=cloud, extension=file_type, tag=tag,
            search=search, page=page, per_page=per_page,
        )

        if not files:
            console.print("[yellow]No files found matching your filters.[/yellow]")
            return

        table = Table(title=f"Files ({total} total, page {page})")
        table.add_column("Name", style="white", max_width=40)
        table.add_column("Type", style="cyan", width=8)
        table.add_column("Size", style="green", justify="right", width=10)
        table.add_column("Cloud", style="blue", width=10)
        table.add_column("Tags", style="magenta", max_width=30)
        table.add_column("Modified", style="dim", width=12)

        for f in files:
            ext = (f.get("extension") or "").lstrip(".")
            size = _human_size(f.get("size_bytes", 0))
            cloud_label = {"gdrive": "G Drive", "onedrive": "OneDrive", "dropbox": "Dropbox", "icloud": "iCloud"}.get(f["cloud_source"], f["cloud_source"])
            tags = f.get("tags") or ""
            modified = (f.get("last_modified") or "")[:10]
            table.add_row(f["filename"], ext, size, cloud_label, tags, modified)

        console.print(table)

        total_pages = (total + per_page - 1) // per_page
        if total_pages > 1:
            console.print(f"[dim]Page {page}/{total_pages}. Use --page N to navigate.[/dim]")
    finally:
        db.close()


@app.command()
def tag(
    auto: bool = typer.Option(False, "--auto", help="Auto-tag untagged files using AI"),
    file_id: Optional[str] = typer.Option(None, "--file-id", help="File ID to tag manually"),
    add: Optional[str] = typer.Option(None, "--add", help="Tag name to add manually"),
    remove: Optional[str] = typer.Option(None, "--remove", help="Tag name to remove"),
    limit: int = typer.Option(200, "--limit", help="Max files to auto-tag"),
    config_path: Optional[Path] = typer.Option(None, "--config", "-c", help="Path to config.yaml"),
) -> None:
    """Tag files manually or auto-tag with AI."""
    from .services.tagger import auto_tag_files

    config = load_config(config_path)
    db = _get_db(config)

    try:
        if auto:
            auto_tag_files(db, config, limit=limit)
        elif file_id and add:
            added = db.add_tags(file_id, [add])
            console.print(f"[green]Added {added} tag(s) to file[/green]")
        elif file_id and remove:
            db.remove_tag(file_id, remove)
            console.print(f"[green]Removed tag '{remove}'[/green]")
        else:
            console.print("[yellow]Use --auto for AI tagging, or --file-id with --add/--remove[/yellow]")
    finally:
        db.close()


@app.command(name="sync-notion")
def sync_notion(
    cloud: Optional[str] = typer.Option(None, "--cloud", help="Only sync files from this cloud"),
    force: bool = typer.Option(False, "--force", help="Re-sync all files, even already synced"),
    config_path: Optional[Path] = typer.Option(None, "--config", "-c", help="Path to config.yaml"),
) -> None:
    """Sync indexed files to Notion database."""
    from .services.notion_sync import sync_to_notion

    config = load_config(config_path)
    db = _get_db(config)

    try:
        sync_to_notion(db, config, cloud_filter=cloud, force=force)
    finally:
        db.close()


@app.command(name="find-duplicates")
def find_duplicates_cmd(
    method: str = typer.Option("hash", "--method", "-m", help="Detection method: hash or name"),
) -> None:
    """Find duplicate files across cloud services."""
    from .services.duplicates import display_duplicates, find_duplicates

    config = load_config()
    db = _get_db(config)

    try:
        groups = find_duplicates(db, method=method)
        display_duplicates(groups, method=method)
    finally:
        db.close()


@app.command()
def serve(
    host: Optional[str] = typer.Option(None, "--host", help="Host to bind to"),
    port: Optional[int] = typer.Option(None, "--port", help="Port to bind to"),
    config_path: Optional[Path] = typer.Option(None, "--config", "-c", help="Path to config.yaml"),
) -> None:
    """Launch the web dashboard."""
    from .web.app import create_app

    config = load_config(config_path)
    flask_app = create_app(config)

    final_host = host or config.get("web", {}).get("host", "127.0.0.1")
    final_port = port or config.get("web", {}).get("port", 5050)

    console.print(f"\n[bold green]Cloud File Organizer Dashboard[/bold green]")
    console.print(f"  Open: [link]http://{final_host}:{final_port}[/link]\n")

    flask_app.run(host=final_host, port=final_port, debug=True)


@app.command()
def init() -> None:
    """Interactive setup: create config.yaml from prompts."""
    from pathlib import Path

    config_path = Path("config.yaml")
    if config_path.exists():
        overwrite = typer.confirm("config.yaml already exists. Overwrite?", default=False)
        if not overwrite:
            raise typer.Abort()

    console.print("\n[bold]Cloud File Organizer - Setup[/bold]\n")

    sections = []

    # Google Drive
    if typer.confirm("Configure Google Drive?", default=True):
        cred_file = typer.prompt("  Path to credentials.json", default="credentials.json")
        sections.append(f"google_drive:\n  credentials_file: \"{cred_file}\"")

    # OneDrive
    if typer.confirm("Configure OneDrive?", default=False):
        client_id = typer.prompt("  Azure App Client ID")
        sections.append(f"onedrive:\n  client_id: \"{client_id}\"\n  client_secret: \"\"\n  tenant_id: \"common\"")

    # Dropbox
    if typer.confirm("Configure Dropbox?", default=False):
        token = typer.prompt("  Dropbox access token")
        sections.append(f"dropbox:\n  access_token: \"{token}\"")

    # iCloud
    if typer.confirm("Configure iCloud (local folder scan)?", default=False):
        default_path = "~/Library/Mobile Documents/com~apple~CloudDocs"
        local_path = typer.prompt("  iCloud Drive local path", default=default_path)
        sections.append(f"icloud:\n  local_path: \"{local_path}\"")

    # Notion
    if typer.confirm("Configure Notion?", default=True):
        api_key = typer.prompt("  Notion integration API key")
        db_id = typer.prompt("  Notion database ID")
        sections.append(f"notion:\n  api_key: \"{api_key}\"\n  database_id: \"{db_id}\"")

    # Gemini
    if typer.confirm("Configure Gemini AI (for auto-tagging)?", default=True):
        gemini_key = typer.prompt("  Gemini API key")
        sections.append(f"gemini:\n  api_key: \"{gemini_key}\"\n  model: \"gemini-2.0-flash\"")

    # Defaults
    sections.append("database:\n  path: \"cloud_organizer.db\"")
    sections.append("web:\n  host: \"127.0.0.1\"\n  port: 5050")

    config_content = "\n\n".join(sections) + "\n"
    config_path.write_text(config_content)

    console.print(f"\n[green]Config saved to {config_path}[/green]")
    console.print("Run [bold]cloud-organizer scan[/bold] to start indexing your files!")


def _human_size(size_bytes: int) -> str:
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if abs(size_bytes) < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024  # type: ignore[assignment]
    return f"{size_bytes:.1f} PB"


if __name__ == "__main__":
    app()
