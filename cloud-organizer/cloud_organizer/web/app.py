"""Flask web dashboard for the Cloud File Organizer."""

from __future__ import annotations

import threading
from typing import Any

from flask import Flask, jsonify, render_template, request

from ..config import get_db_path, load_config
from ..db import Database


def create_app(config: dict[str, Any] | None = None) -> Flask:
    if config is None:
        config = load_config()

    app = Flask(__name__)
    app.config["CO_CONFIG"] = config

    def get_db() -> Database:
        db = Database(get_db_path(config))
        db.init_schema()
        return db

    # --- Pages ---

    @app.route("/")
    def dashboard():
        return render_template("dashboard.html")

    # --- API ---

    @app.route("/api/files")
    def api_files():
        db = get_db()
        try:
            files, total = db.get_files(
                cloud=request.args.get("cloud"),
                extension=request.args.get("type"),
                tag=request.args.get("tag"),
                search=request.args.get("search"),
                page=int(request.args.get("page", 1)),
                per_page=int(request.args.get("per_page", 100)),
            )
            return jsonify({"files": files, "total": total})
        finally:
            db.close()

    @app.route("/api/stats")
    def api_stats():
        db = get_db()
        try:
            stats = db.get_stats()
            last_scan = db.get_last_scan()
            stats["last_scan"] = last_scan
            return jsonify(stats)
        finally:
            db.close()

    @app.route("/api/filters")
    def api_filters():
        db = get_db()
        try:
            return jsonify({
                "clouds": db.get_all_clouds(),
                "extensions": db.get_all_extensions(),
                "tags": db.get_all_tags(),
            })
        finally:
            db.close()

    @app.route("/api/files/<file_id>/tags", methods=["POST"])
    def api_add_tags(file_id: str):
        db = get_db()
        try:
            data = request.get_json() or {}
            tags = data.get("tags", [])
            if tags:
                added = db.add_tags(file_id, tags)
                return jsonify({"added": added})
            return jsonify({"error": "No tags provided"}), 400
        finally:
            db.close()

    @app.route("/api/files/<file_id>/tags", methods=["DELETE"])
    def api_remove_tag(file_id: str):
        db = get_db()
        try:
            data = request.get_json() or {}
            tag_name = data.get("tag", "")
            if tag_name:
                db.remove_tag(file_id, tag_name)
                return jsonify({"removed": tag_name})
            return jsonify({"error": "No tag provided"}), 400
        finally:
            db.close()

    @app.route("/api/scan", methods=["POST"])
    def api_scan():
        from ..services.indexer import run_scan

        data = request.get_json() or {}
        source = data.get("source", "all")

        def do_scan():
            db = get_db()
            try:
                run_scan(db, config, source=source)
            finally:
                db.close()

        thread = threading.Thread(target=do_scan, daemon=True)
        thread.start()
        return jsonify({"status": "scan_started", "source": source})

    @app.route("/api/sync-notion", methods=["POST"])
    def api_sync_notion():
        from ..services.notion_sync import sync_to_notion

        data = request.get_json() or {}
        cloud_filter = data.get("cloud")
        force = data.get("force", False)

        def do_sync():
            db = get_db()
            try:
                sync_to_notion(db, config, cloud_filter=cloud_filter, force=force)
            finally:
                db.close()

        thread = threading.Thread(target=do_sync, daemon=True)
        thread.start()
        return jsonify({"status": "sync_started"})

    @app.route("/api/auto-tag", methods=["POST"])
    def api_auto_tag():
        from ..services.tagger import auto_tag_files

        def do_tag():
            db = get_db()
            try:
                auto_tag_files(db, config)
            finally:
                db.close()

        thread = threading.Thread(target=do_tag, daemon=True)
        thread.start()
        return jsonify({"status": "tagging_started"})

    @app.route("/api/duplicates")
    def api_duplicates():
        from ..services.duplicates import find_duplicates

        db = get_db()
        try:
            method = request.args.get("method", "hash")
            groups = find_duplicates(db, method=method)
            return jsonify({"groups": groups, "total_groups": len(groups)})
        finally:
            db.close()

    return app
