"""SQLite database layer for the Cloud File Organizer."""

from __future__ import annotations

import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

from .models import CloudSource, FileRecord, ScanResult, Tag, TagSource

SCHEMA = """
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    extension TEXT DEFAULT '',
    mime_type TEXT DEFAULT '',
    size_bytes INTEGER DEFAULT 0,
    cloud_source TEXT NOT NULL,
    cloud_path TEXT NOT NULL,
    cloud_id TEXT NOT NULL,
    direct_link TEXT DEFAULT '',
    content_hash TEXT DEFAULT '',
    last_modified TEXT,
    last_scanned TEXT,
    notion_page_id TEXT DEFAULT '',
    UNIQUE(cloud_source, cloud_id)
);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    file_id TEXT NOT NULL,
    name TEXT NOT NULL,
    source TEXT DEFAULT 'manual',
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    UNIQUE(file_id, name)
);

CREATE TABLE IF NOT EXISTS scan_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cloud_source TEXT NOT NULL,
    started_at TEXT NOT NULL,
    completed_at TEXT,
    files_found INTEGER DEFAULT 0,
    files_new INTEGER DEFAULT 0,
    files_updated INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_files_cloud_source ON files(cloud_source);
CREATE INDEX IF NOT EXISTS idx_files_extension ON files(extension);
CREATE INDEX IF NOT EXISTS idx_files_content_hash ON files(content_hash);
CREATE INDEX IF NOT EXISTS idx_tags_file_id ON tags(file_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
"""


class Database:
    def __init__(self, db_path: str | Path = "cloud_organizer.db"):
        self.db_path = str(db_path)
        self._conn: sqlite3.Connection | None = None

    @property
    def conn(self) -> sqlite3.Connection:
        if self._conn is None:
            self._conn = sqlite3.connect(self.db_path)
            self._conn.row_factory = sqlite3.Row
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._conn.execute("PRAGMA foreign_keys=ON")
        return self._conn

    def init_schema(self) -> None:
        self.conn.executescript(SCHEMA)
        self.conn.commit()

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None

    # --- Files ---

    def upsert_file(self, record: FileRecord) -> bool:
        """Insert or update a file record. Returns True if it was a new insert."""
        now = datetime.utcnow().isoformat()
        try:
            self.conn.execute(
                """INSERT INTO files
                   (id, filename, extension, mime_type, size_bytes, cloud_source,
                    cloud_path, cloud_id, direct_link, content_hash, last_modified, last_scanned)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                   ON CONFLICT(cloud_source, cloud_id) DO UPDATE SET
                    filename=excluded.filename,
                    extension=excluded.extension,
                    mime_type=excluded.mime_type,
                    size_bytes=excluded.size_bytes,
                    cloud_path=excluded.cloud_path,
                    direct_link=excluded.direct_link,
                    content_hash=excluded.content_hash,
                    last_modified=excluded.last_modified,
                    last_scanned=excluded.last_scanned
                """,
                (
                    record.id, record.filename, record.extension, record.mime_type,
                    record.size_bytes, record.cloud_source.value, record.cloud_path,
                    record.cloud_id, record.direct_link, record.content_hash,
                    record.last_modified.isoformat() if record.last_modified else None,
                    now,
                ),
            )
            self.conn.commit()
            return self.conn.total_changes > 0
        except sqlite3.Error:
            self.conn.rollback()
            raise

    def get_files(
        self,
        cloud: str | None = None,
        extension: str | None = None,
        tag: str | None = None,
        search: str | None = None,
        page: int = 1,
        per_page: int = 100,
    ) -> tuple[list[dict[str, Any]], int]:
        """Query files with filters. Returns (rows, total_count)."""
        conditions: list[str] = []
        params: list[Any] = []

        if cloud:
            conditions.append("f.cloud_source = ?")
            params.append(cloud)
        if extension:
            conditions.append("f.extension = ?")
            params.append(extension)
        if tag:
            conditions.append("f.id IN (SELECT file_id FROM tags WHERE name = ?)")
            params.append(tag)
        if search:
            conditions.append("f.filename LIKE ?")
            params.append(f"%{search}%")

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        count_row = self.conn.execute(
            f"SELECT COUNT(*) FROM files f {where}", params
        ).fetchone()
        total = count_row[0] if count_row else 0

        offset = (page - 1) * per_page
        rows = self.conn.execute(
            f"""SELECT f.*, GROUP_CONCAT(DISTINCT t.name) as tags
                FROM files f
                LEFT JOIN tags t ON t.file_id = f.id
                {where}
                GROUP BY f.id
                ORDER BY f.last_modified DESC NULLS LAST
                LIMIT ? OFFSET ?""",
            [*params, per_page, offset],
        ).fetchall()

        return [dict(r) for r in rows], total

    def get_file_by_id(self, file_id: str) -> dict[str, Any] | None:
        row = self.conn.execute(
            """SELECT f.*, GROUP_CONCAT(DISTINCT t.name) as tags
               FROM files f LEFT JOIN tags t ON t.file_id = f.id
               WHERE f.id = ? GROUP BY f.id""",
            (file_id,),
        ).fetchone()
        return dict(row) if row else None

    def get_all_extensions(self) -> list[str]:
        rows = self.conn.execute(
            "SELECT DISTINCT extension FROM files WHERE extension != '' ORDER BY extension"
        ).fetchall()
        return [r["extension"] for r in rows]

    def get_all_clouds(self) -> list[str]:
        rows = self.conn.execute(
            "SELECT DISTINCT cloud_source FROM files ORDER BY cloud_source"
        ).fetchall()
        return [r["cloud_source"] for r in rows]

    def get_untagged_file_ids(self, limit: int = 100) -> list[str]:
        rows = self.conn.execute(
            """SELECT f.id FROM files f
               LEFT JOIN tags t ON t.file_id = f.id
               WHERE t.id IS NULL LIMIT ?""",
            (limit,),
        ).fetchall()
        return [r["id"] for r in rows]

    def mark_notion_synced(self, file_id: str, notion_page_id: str) -> None:
        self.conn.execute(
            "UPDATE files SET notion_page_id = ? WHERE id = ?",
            (notion_page_id, file_id),
        )
        self.conn.commit()

    # --- Tags ---

    def add_tags(self, file_id: str, tags: list[str], source: TagSource = TagSource.MANUAL) -> int:
        """Add tags to a file. Returns count of newly added tags."""
        added = 0
        for tag_name in tags:
            tag = Tag(file_id=file_id, name=tag_name.strip().lower(), source=source)
            try:
                self.conn.execute(
                    "INSERT OR IGNORE INTO tags (id, file_id, name, source) VALUES (?, ?, ?, ?)",
                    (tag.id, tag.file_id, tag.name, tag.source.value),
                )
                added += self.conn.total_changes
            except sqlite3.Error:
                continue
        self.conn.commit()
        return added

    def remove_tag(self, file_id: str, tag_name: str) -> None:
        self.conn.execute(
            "DELETE FROM tags WHERE file_id = ? AND name = ?",
            (file_id, tag_name.strip().lower()),
        )
        self.conn.commit()

    def get_all_tags(self) -> list[str]:
        rows = self.conn.execute(
            "SELECT DISTINCT name FROM tags ORDER BY name"
        ).fetchall()
        return [r["name"] for r in rows]

    # --- Scan Log ---

    def log_scan_start(self, result: ScanResult) -> int:
        cursor = self.conn.execute(
            "INSERT INTO scan_log (cloud_source, started_at) VALUES (?, ?)",
            (result.cloud_source.value, result.started_at.isoformat()),
        )
        self.conn.commit()
        return cursor.lastrowid or 0

    def log_scan_complete(self, log_id: int, result: ScanResult) -> None:
        self.conn.execute(
            """UPDATE scan_log SET
               completed_at=?, files_found=?, files_new=?, files_updated=?, errors=?
               WHERE id=?""",
            (
                result.completed_at.isoformat() if result.completed_at else None,
                result.files_found, result.files_new, result.files_updated,
                result.errors, log_id,
            ),
        )
        self.conn.commit()

    def get_last_scan(self, cloud_source: str | None = None) -> dict[str, Any] | None:
        if cloud_source:
            row = self.conn.execute(
                "SELECT * FROM scan_log WHERE cloud_source = ? ORDER BY id DESC LIMIT 1",
                (cloud_source,),
            ).fetchone()
        else:
            row = self.conn.execute(
                "SELECT * FROM scan_log ORDER BY id DESC LIMIT 1"
            ).fetchone()
        return dict(row) if row else None

    # --- Stats ---

    def get_stats(self) -> dict[str, Any]:
        total = self.conn.execute("SELECT COUNT(*) FROM files").fetchone()[0]
        by_cloud = {}
        for row in self.conn.execute(
            "SELECT cloud_source, COUNT(*) as cnt FROM files GROUP BY cloud_source"
        ).fetchall():
            by_cloud[row["cloud_source"]] = row["cnt"]

        total_tags = self.conn.execute("SELECT COUNT(DISTINCT name) FROM tags").fetchone()[0]
        notion_synced = self.conn.execute(
            "SELECT COUNT(*) FROM files WHERE notion_page_id != ''"
        ).fetchone()[0]

        return {
            "total_files": total,
            "by_cloud": by_cloud,
            "total_tags": total_tags,
            "notion_synced": notion_synced,
        }

    # --- Duplicates ---

    def get_duplicates_by_hash(self) -> list[list[dict[str, Any]]]:
        """Find files with the same content hash across different clouds."""
        rows = self.conn.execute(
            """SELECT f.*, GROUP_CONCAT(DISTINCT t.name) as tags
               FROM files f LEFT JOIN tags t ON t.file_id = f.id
               WHERE f.content_hash != '' AND f.content_hash IN (
                   SELECT content_hash FROM files
                   WHERE content_hash != ''
                   GROUP BY content_hash HAVING COUNT(*) > 1
               )
               GROUP BY f.id
               ORDER BY f.content_hash, f.cloud_source"""
        ).fetchall()

        groups: dict[str, list[dict[str, Any]]] = {}
        for row in rows:
            h = row["content_hash"]
            groups.setdefault(h, []).append(dict(row))
        return list(groups.values())

    def get_duplicates_by_name(self) -> list[list[dict[str, Any]]]:
        """Find files with the same name across different clouds."""
        rows = self.conn.execute(
            """SELECT f.*, GROUP_CONCAT(DISTINCT t.name) as tags
               FROM files f LEFT JOIN tags t ON t.file_id = f.id
               WHERE LOWER(f.filename) IN (
                   SELECT LOWER(filename) FROM files
                   GROUP BY LOWER(filename) HAVING COUNT(*) > 1
               )
               GROUP BY f.id
               ORDER BY LOWER(f.filename), f.cloud_source"""
        ).fetchall()

        groups: dict[str, list[dict[str, Any]]] = {}
        for row in rows:
            key = row["filename"].lower()
            groups.setdefault(key, []).append(dict(row))
        return list(groups.values())
