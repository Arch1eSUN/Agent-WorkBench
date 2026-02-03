from __future__ import annotations

import asyncio
import json
import uuid
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .events import CreateRunRequest, CreateRunResponse, RunEvent
from .index import list_runs
from .storage import append_event, now_ms, read_events

app = FastAPI(title="Agent Workbench Backend")

# Dev CORS: allow the local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3010", "http://localhost:3010"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/runs")
def get_runs():
    return {"runs": list_runs()}


@app.post("/runs", response_model=CreateRunResponse)
def create_run(req: CreateRunRequest):
    run_id = f"run_{uuid.uuid4().hex[:12]}"

    append_event(
        RunEvent(
            run_id=run_id,
            event_id="e1",
            ts_ms=now_ms(),
            type="checkpoint",
            summary=f"run created: {req.title}",
            payload={"title": req.title, "prompt": req.prompt},
        )
    )

    # A tiny demo stream for now (until we wire LangGraph runtime)
    append_event(
        RunEvent(
            run_id=run_id,
            event_id="e2",
            ts_ms=now_ms(),
            type="llm_call",
            summary="(demo) plan",
            payload={"text": "Plan steps…"},
        )
    )

    return CreateRunResponse(run_id=run_id)


@app.get("/runs/{run_id}/events")
def get_events(run_id: str):
    events = list(read_events(run_id))
    return {"run_id": run_id, "events": [e.model_dump() for e in events]}


@app.get("/runs/{run_id}/stream")
def stream_events(run_id: str):
    async def gen() -> AsyncIterator[bytes]:
        # naive tail-follow: poll file and emit new lines
        sent = 0
        while True:
            events = list(read_events(run_id))
            if sent < len(events):
                for e in events[sent:]:
                    yield (
                        f"event: run_event\n"
                        f"data: {json.dumps(e.model_dump())}\n\n"
                    ).encode("utf-8")
                sent = len(events)
            await asyncio.sleep(0.5)

    return StreamingResponse(gen(), media_type="text/event-stream")
