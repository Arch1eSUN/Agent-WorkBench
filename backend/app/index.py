from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

from .events import RunEvent
from .storage import RUNS_DIR


def list_runs() -> List[Dict[str, Any]]:
    if not RUNS_DIR.exists():
        return []

    runs: list[dict[str, Any]] = []
    for p in sorted(RUNS_DIR.glob('run_*.jsonl'), key=lambda x: x.stat().st_mtime, reverse=True):
        run_id = p.stem
        title = run_id
        ts_ms = None
        try:
            first_line = p.read_text(encoding='utf-8').splitlines()[0]
            evt = RunEvent.model_validate_json(first_line)
            title = (evt.payload or {}).get('title') or evt.summary or run_id
            ts_ms = evt.ts_ms
        except Exception:
            pass

        runs.append({
            'id': run_id,
            'title': title,
            'created_ts_ms': ts_ms,
        })

    return runs
