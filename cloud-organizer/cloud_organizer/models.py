"""Data models for the Cloud File Organizer."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional


class CloudSource(str, Enum):
    GDRIVE = "gdrive"
    ONEDRIVE = "onedrive"
    DROPBOX = "dropbox"
    ICLOUD = "icloud"


class TagSource(str, Enum):
    MANUAL = "manual"
    AI = "ai"


@dataclass
class FileRecord:
    filename: str
    cloud_source: CloudSource
    cloud_id: str
    cloud_path: str
    extension: str = ""
    mime_type: str = ""
    size_bytes: int = 0
    direct_link: str = ""
    content_hash: str = ""
    last_modified: Optional[datetime] = None
    last_scanned: Optional[datetime] = None
    notion_page_id: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    @property
    def file_type_label(self) -> str:
        """Human-readable file type based on extension."""
        ext = self.extension.lower().lstrip(".")
        type_map = {
            "pdf": "PDF", "doc": "Word", "docx": "Word", "xls": "Excel",
            "xlsx": "Excel", "ppt": "PowerPoint", "pptx": "PowerPoint",
            "txt": "Text", "csv": "CSV", "json": "JSON", "xml": "XML",
            "jpg": "Image", "jpeg": "Image", "png": "Image", "gif": "Image",
            "svg": "Image", "webp": "Image", "bmp": "Image", "heic": "Image",
            "mp4": "Video", "mov": "Video", "avi": "Video", "mkv": "Video", "webm": "Video",
            "mp3": "Audio", "wav": "Audio", "flac": "Audio", "aac": "Audio", "ogg": "Audio",
            "py": "Code", "js": "Code", "ts": "Code", "java": "Code", "cpp": "Code",
            "c": "Code", "go": "Code", "rs": "Code", "rb": "Code", "php": "Code",
            "html": "Web", "css": "Web", "scss": "Web",
            "zip": "Archive", "tar": "Archive", "gz": "Archive", "rar": "Archive", "7z": "Archive",
        }
        return type_map.get(ext, ext.upper() if ext else "Unknown")


@dataclass
class Tag:
    file_id: str
    name: str
    source: TagSource = TagSource.MANUAL
    id: str = field(default_factory=lambda: str(uuid.uuid4()))


@dataclass
class ScanResult:
    cloud_source: CloudSource
    started_at: datetime
    completed_at: Optional[datetime] = None
    files_found: int = 0
    files_new: int = 0
    files_updated: int = 0
    errors: int = 0
