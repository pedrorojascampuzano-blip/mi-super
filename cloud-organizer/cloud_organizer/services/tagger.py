"""AI auto-tagging service using Google Gemini API."""

from __future__ import annotations

import json
import time
from typing import Any

from rich.console import Console

from ..db import Database
from ..models import TagSource

console = Console()

BATCH_SIZE = 20
TAG_PROMPT = """You are a file organization assistant. Given a list of files with their metadata,
suggest 3-5 descriptive tags for each file. Tags should be lowercase, single words or short phrases
(max 2 words), and describe the file's likely content, purpose, or category.

Files:
{files_json}

Respond with a JSON array where each element has "file_id" and "tags" (array of strings).
Example: [{"file_id": "abc123", "tags": ["finance", "report", "quarterly"]}]

IMPORTANT: Return ONLY the JSON array, no markdown formatting or extra text."""


def auto_tag_files(
    db: Database,
    config: dict[str, Any],
    limit: int = 200,
) -> dict[str, int]:
    """Auto-tag untagged files using Gemini AI.

    Returns:
        Dict with 'files_tagged' and 'tags_added' counts.
    """
    import google.generativeai as genai

    gemini_config = config.get("gemini", {})
    api_key = gemini_config.get("api_key", "")
    model_name = gemini_config.get("model", "gemini-2.0-flash")

    if not api_key:
        console.print("[red]Gemini API key not configured[/red]")
        return {"files_tagged": 0, "tags_added": 0}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    untagged_ids = db.get_untagged_file_ids(limit=limit)
    if not untagged_ids:
        console.print("[green]All files are already tagged![/green]")
        return {"files_tagged": 0, "tags_added": 0}

    console.print(f"[blue]Auto-tagging {len(untagged_ids)} files...[/blue]")

    total_tagged = 0
    total_tags = 0

    for i in range(0, len(untagged_ids), BATCH_SIZE):
        batch_ids = untagged_ids[i : i + BATCH_SIZE]
        batch_files = []

        for fid in batch_ids:
            file_data = db.get_file_by_id(fid)
            if file_data:
                batch_files.append({
                    "file_id": file_data["id"],
                    "filename": file_data["filename"],
                    "extension": file_data["extension"],
                    "mime_type": file_data["mime_type"],
                    "size_bytes": file_data["size_bytes"],
                    "cloud_path": file_data["cloud_path"],
                    "cloud_source": file_data["cloud_source"],
                })

        if not batch_files:
            continue

        try:
            prompt = TAG_PROMPT.format(files_json=json.dumps(batch_files, indent=2))
            response = model.generate_content(prompt)
            text = response.text.strip()

            # Strip markdown code block if present
            if text.startswith("```"):
                text = text.split("\n", 1)[1] if "\n" in text else text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                text = text.strip()

            tag_results = json.loads(text)

            for item in tag_results:
                file_id = item.get("file_id", "")
                tags = item.get("tags", [])
                if file_id and tags:
                    added = db.add_tags(file_id, tags, source=TagSource.AI)
                    total_tags += added
                    total_tagged += 1

            console.print(f"  [dim]Batch {i // BATCH_SIZE + 1}: tagged {len(tag_results)} files[/dim]")

        except json.JSONDecodeError as e:
            console.print(f"  [red]Failed to parse AI response: {e}[/red]")
        except Exception as e:
            console.print(f"  [red]Gemini API error: {e}[/red]")

        # Rate limiting
        time.sleep(1)

    console.print(f"[green]Done: {total_tagged} files tagged, {total_tags} tags added[/green]")
    return {"files_tagged": total_tagged, "tags_added": total_tags}
