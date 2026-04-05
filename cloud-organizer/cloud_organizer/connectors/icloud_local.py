"""iCloud connector via local filesystem scan.

Apple does not provide a public API for iCloud Drive. This connector
scans the local sync folder (e.g. ~/Library/Mobile Documents/com~apple~CloudDocs
on macOS) to index files that are synced via iCloud.
"""

from __future__ import annotations

import hashlib
import mimetypes
import os
from collections.abc import Iterator
from datetime import datetime
from pathlib import Path
from typing import Any

from ..models import CloudSource, FileRecord
from .base import CloudConnector

HASH_CHUNK_SIZE = 8192  # 8 KB chunks for hashing


class ICloudLocalConnector(CloudConnector):
    source = CloudSource.ICLOUD

    def __init__(self, config: dict[str, Any]) -> None:
        self.local_path = Path(config.get("local_path", "")).expanduser()

    def authenticate(self) -> None:
        if not self.local_path.exists():
            raise FileNotFoundError(
                f"iCloud Drive folder not found: {self.local_path}\n"
                "Make sure iCloud Drive is enabled and syncing to this machine.\n"
                "macOS default: ~/Library/Mobile Documents/com~apple~CloudDocs\n"
                "Windows default: ~/iCloudDrive"
            )

    def scan(self, path_filter: str | None = None) -> Iterator[FileRecord]:
        self.authenticate()

        scan_root = self.local_path
        if path_filter:
            scan_root = self.local_path / path_filter.lstrip("/")

        for root, _dirs, files in os.walk(scan_root):
            # Skip hidden directories
            root_path = Path(root)
            if any(part.startswith(".") for part in root_path.parts):
                continue

            for filename in files:
                if filename.startswith("."):
                    continue

                filepath = root_path / filename
                try:
                    stat = filepath.stat()
                except OSError:
                    continue

                rel_path = filepath.relative_to(self.local_path)
                ext = filepath.suffix
                mime, _ = mimetypes.guess_type(str(filepath))

                yield FileRecord(
                    filename=filename,
                    cloud_source=CloudSource.ICLOUD,
                    cloud_id=str(rel_path),
                    cloud_path="/" + str(rel_path),
                    extension=ext,
                    mime_type=mime or "",
                    size_bytes=stat.st_size,
                    direct_link="",  # No web link for local iCloud files
                    content_hash=self._compute_hash(filepath),
                    last_modified=datetime.fromtimestamp(stat.st_mtime),
                )

    def get_download_link(self, cloud_id: str) -> str:
        return ""  # iCloud local files don't have web links

    def get_content_hash(self, cloud_id: str) -> str | None:
        filepath = self.local_path / cloud_id
        if filepath.exists():
            return self._compute_hash(filepath)
        return None

    @staticmethod
    def _compute_hash(filepath: Path) -> str:
        sha256 = hashlib.sha256()
        try:
            with open(filepath, "rb") as f:
                while chunk := f.read(HASH_CHUNK_SIZE):
                    sha256.update(chunk)
            return sha256.hexdigest()
        except OSError:
            return ""
