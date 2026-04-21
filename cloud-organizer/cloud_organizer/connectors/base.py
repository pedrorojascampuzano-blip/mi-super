"""Abstract base class for cloud service connectors."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterator
from typing import Any

from ..models import CloudSource, FileRecord


class CloudConnector(ABC):
    """Base interface that all cloud connectors must implement."""

    source: CloudSource

    @abstractmethod
    def __init__(self, config: dict[str, Any]) -> None:
        """Initialize with service-specific config."""

    @abstractmethod
    def authenticate(self) -> None:
        """Establish authenticated session with the cloud service."""

    @abstractmethod
    def scan(self, path_filter: str | None = None) -> Iterator[FileRecord]:
        """Yield FileRecord for every file found in the cloud.

        Args:
            path_filter: Optional path prefix to limit the scan scope.
        """

    @abstractmethod
    def get_download_link(self, cloud_id: str) -> str:
        """Return a direct/web link to access the file."""

    def get_content_hash(self, cloud_id: str) -> str | None:
        """Return content hash if the provider supports it. Optional."""
        return None
