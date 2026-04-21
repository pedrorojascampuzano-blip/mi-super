"""Cloud service connectors for scanning and indexing files."""

from .google_drive import GoogleDriveConnector
from .onedrive import OneDriveConnector
from .dropbox_connector import DropboxConnector
from .icloud_local import ICloudLocalConnector

CONNECTORS = {
    "gdrive": GoogleDriveConnector,
    "onedrive": OneDriveConnector,
    "dropbox": DropboxConnector,
    "icloud": ICloudLocalConnector,
}

__all__ = ["CONNECTORS", "GoogleDriveConnector", "OneDriveConnector", "DropboxConnector", "ICloudLocalConnector"]
