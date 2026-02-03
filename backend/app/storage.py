from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Iterable

from .events import RunEvent

ROOT = Path(__file__).resolve().parents[1]
RUNS_DIR = ROOT / "runs"


def ensure_dirs() -> None:
    RUNS_DIR.mkdir(parents=True, exist_ok=True)


def run_events_path(run_id: str) -> Path:
    return RUNS_DIR / f"{run_id}.jsonl"


def append_event(evt: RunEvent) -> None:
    ensure_dirs()
    p = run_events_path(evt.run_id)
    with p.open("a", encoding="utf-8") as f:
        f.write(evt.model_dump_json())
        f.write("\n")


def read_events(run_id: str) -> Iterable[RunEvent]:
    p = run_events_path(run_id)
    if not p.exists():
        return []

    out: list[RunEvent] = []
    with p.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            out.append(RunEvent.model_validate_json(line))
    return out


def now_ms() -> int:
    return int(time.time() * 1000)
