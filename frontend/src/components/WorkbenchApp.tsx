"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WorkbenchShell } from "@/components/WorkbenchShell";

type RunSummary = {
  id: string;
  title: string;
  created_ts_ms?: number | null;
};

type EventType =
  | "llm_call"
  | "tool_call"
  | "tool_result"
  | "approval_required"
  | "error"
  | "checkpoint";

type RunEvent = {
  run_id: string;
  event_id: string;
  ts_ms: number;
  type: EventType;
  summary: string;
  payload: Record<string, unknown>;
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8787";

function fmtTime(tsMs?: number | null) {
  if (!tsMs) return "";
  const d = new Date(tsMs);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function WorkbenchApp() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [newRunTitle, setNewRunTitle] = useState<string>("demo");

  const esRef = useRef<EventSource | null>(null);

  const selectedEvent = useMemo(
    () => events.find((e) => e.event_id === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  const refreshRuns = useCallback(async () => {
    const res = await fetch(`${BACKEND}/runs`, { cache: "no-store" });
    const data = (await res.json()) as { runs: RunSummary[] };
    setRuns(data.runs);
    if (!selectedRunId && data.runs[0]) setSelectedRunId(data.runs[0].id);
  }, [selectedRunId]);

  async function loadEvents(runId: string) {
    const res = await fetch(`${BACKEND}/runs/${runId}/events`, { cache: "no-store" });
    const data = (await res.json()) as { run_id: string; events: RunEvent[] };
    setEvents(data.events);
    setSelectedEventId(data.events.at(-1)?.event_id ?? null);
  }

  function subscribe(runId: string) {
    // tear down existing
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const es = new EventSource(`${BACKEND}/runs/${runId}/stream`);
    es.addEventListener("run_event", (evt) => {
      try {
        const e = JSON.parse((evt as MessageEvent).data) as RunEvent;
        setEvents((prev) => {
          // de-dup
          if (prev.some((x) => x.event_id === e.event_id)) return prev;
          return [...prev, e];
        });
      } catch {
        // ignore
      }
    });
    es.onerror = () => {
      // keep the UI alive; EventSource will retry
    };
    esRef.current = es;
  }

  async function createRun() {
    const res = await fetch(`${BACKEND}/runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: newRunTitle, prompt: "" }),
    });
    const data = (await res.json()) as { run_id: string };
    await refreshRuns();
    setSelectedRunId(data.run_id);
  }

  useEffect(() => {
    void (async () => {
      await refreshRuns();
    })();
  }, [refreshRuns]);

  useEffect(() => {
    if (!selectedRunId) return;
    void (async () => {
      await loadEvents(selectedRunId);
    })();
    subscribe(selectedRunId);
    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [selectedRunId]);

  return (
    <WorkbenchShell
      sidebar={
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="ui-title">Runs</div>
            <button
              onClick={createRun}
              className="rounded-md border border-white/10 px-2 py-1 ui-micro hover:bg-white/5"
            >
              New
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={newRunTitle}
              onChange={(e) => setNewRunTitle(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/25 px-2 py-1 ui-micro outline-none placeholder:text-white/35"
              placeholder="run title"
            />
          </div>

          <div className="space-y-2">
            {runs.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRunId(r.id)}
                data-selected={r.id === selectedRunId}
                className="liquid-item w-full rounded-lg border border-white/10 p-2 text-left"
              >
                <div className="ui-title line-clamp-2">{r.title}</div>
                <div className="mt-1 flex items-center justify-between ui-micro ui-mono">
                  <span className="truncate">{r.id}</span>
                  <span className="shrink-0">{fmtTime(r.created_ts_ms)}</span>
                </div>
              </button>
            ))}
            {runs.length === 0 ? (
              <div className="ui-subtitle">No runs yet. Click New.</div>
            ) : null}
          </div>
        </div>
      }
      main={
        <div className="space-y-3">
          <div>
            <div className="ui-title">Chat</div>
            <div className="ui-subtitle">
              (MVP) Chat UI is placeholder; we drive runs via the sidebar.
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-3 ui-title">
            Selected run: <span className="ui-title">{selectedRunId ?? "(none)"}</span>
          </div>

          <div className="ui-subtitle">
            Next: wire a real message → LangGraph execution.
          </div>
        </div>
      }
      timeline={
        <div className="space-y-3">
          <div>
            <div className="ui-title">Timeline</div>
            <div className="ui-subtitle">Live SSE + persisted events</div>
          </div>

          <div className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
            {events.map((e) => (
              <button
                key={e.event_id}
                onClick={() => setSelectedEventId(e.event_id)}
                data-selected={e.event_id === selectedEventId}
                className="liquid-item flex w-full items-start gap-3 p-3 text-left"
              >
                <div className="w-20 shrink-0 ui-subtitle ui-mono">{fmtTime(e.ts_ms)}</div>
                <div className="min-w-0">
                  <div className="ui-micro ui-mono">{e.type}</div>
                  <div className="ui-title truncate">{e.summary}</div>
                </div>
              </button>
            ))}
            {events.length === 0 ? (
              <div className="p-3 ui-subtitle">No events.</div>
            ) : null}
          </div>
        </div>
      }
      inspector={
        <div className="space-y-3">
          <div>
            <div className="ui-title">Inspector</div>
            <div className="ui-subtitle">Selected event payload</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            {selectedEvent ? (
              <>
                <div className="ui-micro ui-mono">{selectedEvent.type}</div>
                <div className="mt-1 ui-title">{selectedEvent.summary}</div>
                <pre className="mt-3 max-h-[60vh] overflow-auto ui-micro">
{JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </>
            ) : (
              <div className="ui-subtitle">Select an event.</div>
            )}
          </div>
        </div>
      }
    />
  );
}
