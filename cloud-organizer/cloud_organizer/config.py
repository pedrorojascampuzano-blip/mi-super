"""Configuration loader for the Cloud File Organizer."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import yaml


DEFAULT_CONFIG_PATHS = [
    Path("config.yaml"),
    Path.home() / ".cloud-organizer" / "config.yaml",
]


def find_config_path() -> Path | None:
    env_path = os.environ.get("CLOUD_ORGANIZER_CONFIG")
    if env_path:
        p = Path(env_path)
        if p.exists():
            return p

    for path in DEFAULT_CONFIG_PATHS:
        if path.exists():
            return path
    return None


def load_config(path: Path | None = None) -> dict[str, Any]:
    if path is None:
        path = find_config_path()

    if path is None or not path.exists():
        return _default_config()

    with open(path) as f:
        user_config = yaml.safe_load(f) or {}

    config = _default_config()
    _deep_merge(config, user_config)
    return config


def _default_config() -> dict[str, Any]:
    return {
        "google_drive": {
            "credentials_file": "credentials.json",
        },
        "onedrive": {
            "client_id": "",
            "client_secret": "",
            "tenant_id": "common",
        },
        "dropbox": {
            "access_token": "",
        },
        "icloud": {
            "local_path": str(Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs"),
        },
        "notion": {
            "api_key": "",
            "database_id": "",
        },
        "gemini": {
            "api_key": "",
            "model": "gemini-2.0-flash",
        },
        "database": {
            "path": "cloud_organizer.db",
        },
        "web": {
            "host": "127.0.0.1",
            "port": 5050,
        },
    }


def _deep_merge(base: dict, override: dict) -> None:
    for key, value in override.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            _deep_merge(base[key], value)
        else:
            base[key] = value


def get_db_path(config: dict[str, Any]) -> Path:
    return Path(config["database"]["path"])
