"""Dropbox connector using the official Dropbox SDK."""

from __future__ import annotations

import os
from collections.abc import Iterator
from datetime import datetime
from typing import Any

from ..models import CloudSource, FileRecord
from .base import CloudConnector


class DropboxConnector(CloudConnector):
    source = CloudSource.DROPBOX

    def __init__(self, config: dict[str, Any]) -> None:
        self.access_token = config.get("access_token", "")
        self._dbx = None

    def authenticate(self) -> None:
        import dropbox

        if not self.access_token:
            raise ValueError(
                "Dropbox access token not configured.\n"
                "Generate one at: https://www.dropbox.com/developers/apps"
            )
        self._dbx = dropbox.Dropbox(self.access_token)
        # Verify the token works
        self._dbx.users_get_current_account()

    def scan(self, path_filter: str | None = None) -> Iterator[FileRecord]:
        import dropbox as dbx_module

        if not self._dbx:
            self.authenticate()

        root_path = path_filter or ""
        result = self._dbx.files_list_folder(root_path, recursive=True)

        while True:
            for entry in result.entries:
                if isinstance(entry, dbx_module.files.FileMetadata):
                    filename = entry.name
                    ext = os.path.splitext(filename)[1] if "." in filename else ""

                    yield FileRecord(
                        filename=filename,
                        cloud_source=CloudSource.DROPBOX,
                        cloud_id=entry.id,
                        cloud_path=entry.path_display or entry.path_lower or "",
                        extension=ext,
                        mime_type="",  # Dropbox doesn't return MIME in listing
                        size_bytes=entry.size,
                        direct_link=self._make_web_link(entry.path_display or ""),
                        content_hash=entry.content_hash or "",
                        last_modified=entry.server_modified if entry.server_modified else None,
                    )

            if not result.has_more:
                break
            result = self._dbx.files_list_folder_continue(result.cursor)

    def get_download_link(self, cloud_id: str) -> str:
        if not self._dbx:
            self.authenticate()
        try:
            link = self._dbx.sharing_create_shared_link_with_settings(cloud_id)
            return link.url
        except Exception:
            return ""

    def get_content_hash(self, cloud_id: str) -> str | None:
        if not self._dbx:
            self.authenticate()
        try:
            meta = self._dbx.files_get_metadata(cloud_id)
            return getattr(meta, "content_hash", None)
        except Exception:
            return None

    @staticmethod
    def _make_web_link(path: str) -> str:
        if path:
            return f"https://www.dropbox.com/home{path}"
        return ""
