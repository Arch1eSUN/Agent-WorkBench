from __future__ import annotations

from typing import Any, Dict, Literal, Optional
from pydantic import BaseModel

EventType = Literal[
    "llm_call",
    "tool_call",
    "tool_result",
    "approval_required",
    "error",
    "checkpoint",
]

class RunEvent(BaseModel):
    run_id: str
    event_id: str
    ts_ms: int
    type: EventType
    summary: str
    payload: Dict[str, Any] = {}

class CreateRunRequest(BaseModel):
    title: str
    prompt: Optional[str] = None

class CreateRunResponse(BaseModel):
    run_id: str
