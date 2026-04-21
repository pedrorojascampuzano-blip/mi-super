"""OneDrive connector using Microsoft Graph API."""

from __future__ import annotations

import os
from collections.abc import Iterator
from datetime import datetime
from typing import Any

import requests

from ..models import CloudSource, FileRecord
from .base import CloudConnector

GRAPH_BASE = "https://graph.microsoft.com/v1.0"
AUTHORITY = "https://login.microsoftonline.com/{tenant_id}"
SCOPES_GRAPH = ["Files.Read.All"]


class OneDriveConnector(CloudConnector):
    source = CloudSource.ONEDRIVE

    def __init__(self, config: dict[str, Any]) -> None:
        self.client_id = config.get("client_id", "")
        self.client_secret = config.get("client_secret", "")
        self.tenant_id = config.get("tenant_id", "common")
        self._token: str = ""
        self._session: requests.Session | None = None

    def authenticate(self) -> None:
        import msal

        authority = AUTHORITY.format(tenant_id=self.tenant_id)
        app = msal.PublicClientApplication(self.client_id, authority=authority)

        # Try device code flow (works without a redirect URI)
        flow = app.initiate_device_flow(scopes=SCOPES_GRAPH)
        if "user_code" not in flow:
            raise RuntimeError(f"OneDrive auth failed: {flow.get('error_description', 'unknown error')}")

        print(f"\n  To sign in to OneDrive, open: {flow['verification_uri']}")
        print(f"  Enter code: {flow['user_code']}\n")

        result = app.acquire_token_by_device_flow(flow)
        if "access_token" not in result:
            raise RuntimeError(f"OneDrive auth failed: {result.get('error_description', 'unknown error')}")

        self._token = result["access_token"]
        self._session = requests.Session()
        self._session.headers["Authorization"] = f"Bearer {self._token}"

    def scan(self, path_filter: str | None = None) -> Iterator[FileRecord]:
        if not self._session:
            self.authenticate()

        yield from self._scan_folder("/me/drive/root/children", "/")

    def _scan_folder(self, endpoint: str, current_path: str) -> Iterator[FileRecord]:
        url = GRAPH_BASE + endpoint

        while url:
            resp = self._session.get(url)
            resp.raise_for_status()
            data = resp.json()

            for item in data.get("value", []):
                item_path = current_path + item["name"]

                if "folder" in item:
                    yield from self._scan_folder(
                        f"/me/drive/items/{item['id']}/children",
                        item_path + "/",
                    )
                elif "file" in item:
                    filename = item["name"]
                    ext = os.path.splitext(filename)[1] if "." in filename else ""
                    hashes = item.get("file", {}).get("hashes", {})

                    yield FileRecord(
                        filename=filename,
                        cloud_source=CloudSource.ONEDRIVE,
                        cloud_id=item["id"],
                        cloud_path=item_path,
                        extension=ext,
                        mime_type=item.get("file", {}).get("mimeType", ""),
                        size_bytes=item.get("size", 0),
                        direct_link=item.get("webUrl", ""),
                        content_hash=hashes.get("sha256Hash", hashes.get("sha1Hash", "")),
                        last_modified=_parse_datetime(item.get("lastModifiedDateTime")),
                    )

            url = data.get("@odata.nextLink")

    def get_download_link(self, cloud_id: str) -> str:
        if not self._session:
            self.authenticate()
        resp = self._session.get(f"{GRAPH_BASE}/me/drive/items/{cloud_id}")
        resp.raise_for_status()
        return resp.json().get("webUrl", "")


def _parse_datetime(dt_str: str | None) -> datetime | None:
    if not dt_str:
        return None
    try:
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None
