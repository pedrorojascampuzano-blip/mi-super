"""Google Drive connector using the Google Drive API v3."""

from __future__ import annotations

import os
from collections.abc import Iterator
from datetime import datetime
from pathlib import Path
from typing import Any

from ..models import CloudSource, FileRecord
from .base import CloudConnector

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]


class GoogleDriveConnector(CloudConnector):
    source = CloudSource.GDRIVE

    def __init__(self, config: dict[str, Any]) -> None:
        self.credentials_file = config.get("credentials_file", "credentials.json")
        self.service = None
        self._folder_cache: dict[str, str] = {}

    def authenticate(self) -> None:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build

        creds = None
        token_path = Path("token.json")

        if token_path.exists():
            creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not Path(self.credentials_file).exists():
                    raise FileNotFoundError(
                        f"Google credentials file not found: {self.credentials_file}\n"
                        "Download it from Google Cloud Console → APIs & Services → Credentials"
                    )
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, SCOPES)
                creds = flow.run_local_server(port=0)
            token_path.write_text(creds.to_json())

        self.service = build("drive", "v3", credentials=creds)

    def scan(self, path_filter: str | None = None) -> Iterator[FileRecord]:
        if not self.service:
            self.authenticate()

        page_token = None
        query = "trashed = false"
        fields = (
            "nextPageToken, files(id, name, mimeType, size, md5Checksum, "
            "modifiedTime, parents, webViewLink)"
        )

        while True:
            response = (
                self.service.files()
                .list(
                    q=query,
                    fields=fields,
                    pageSize=1000,
                    pageToken=page_token,
                    supportsAllDrives=True,
                    includeItemsFromAllDrives=True,
                )
                .execute()
            )

            for item in response.get("files", []):
                if item.get("mimeType") == "application/vnd.google-apps.folder":
                    self._folder_cache[item["id"]] = item["name"]
                    continue

                cloud_path = self._resolve_path(item)
                if path_filter and not cloud_path.startswith(path_filter):
                    continue

                filename = item["name"]
                ext = os.path.splitext(filename)[1] if "." in filename else ""

                yield FileRecord(
                    filename=filename,
                    cloud_source=CloudSource.GDRIVE,
                    cloud_id=item["id"],
                    cloud_path=cloud_path,
                    extension=ext,
                    mime_type=item.get("mimeType", ""),
                    size_bytes=int(item.get("size", 0)),
                    direct_link=item.get("webViewLink", ""),
                    content_hash=item.get("md5Checksum", ""),
                    last_modified=_parse_datetime(item.get("modifiedTime")),
                )

            page_token = response.get("nextPageToken")
            if not page_token:
                break

    def get_download_link(self, cloud_id: str) -> str:
        if not self.service:
            self.authenticate()
        file = self.service.files().get(fileId=cloud_id, fields="webViewLink").execute()
        return file.get("webViewLink", "")

    def get_content_hash(self, cloud_id: str) -> str | None:
        if not self.service:
            self.authenticate()
        file = self.service.files().get(fileId=cloud_id, fields="md5Checksum").execute()
        return file.get("md5Checksum")

    def _resolve_path(self, item: dict) -> str:
        parents = item.get("parents", [])
        if not parents:
            return "/" + item["name"]

        parts = []
        current = parents[0]
        seen = set()
        while current and current not in seen:
            seen.add(current)
            name = self._folder_cache.get(current)
            if name:
                parts.append(name)
                break
            else:
                parts.append("...")
                break
        parts.reverse()
        return "/" + "/".join(parts) + "/" + item["name"]


def _parse_datetime(dt_str: str | None) -> datetime | None:
    if not dt_str:
        return None
    try:
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None
