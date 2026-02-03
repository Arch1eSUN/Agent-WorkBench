"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  async function refreshRuns() {
    const res = await fetch(`${BACKEND}/runs`, { cache: "no-store" });
    const data = (await res.json()) as { runs: RunSummary[] };
    setRuns(data.runs);
    if (!selectedRunId && data.runs[0]) setSelectedRunId(data.runs[0].id);
  }

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
    refreshRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedRunId) return;
    loadEvents(selectedRunId);
    subscribe(selectedRunId);
    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRunId]);

  return (
    <WorkbenchShell
      sidebar={
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Runs</div>
            <button
              onClick={createRun}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300 hover:bg-white/5"
            >
              New
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={newRunTitle}
              onChange={(e) => setNewRunTitle(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs outline-none placeholder:text-zinc-600"
              placeholder="run title"
            />
          </div>

          <div className="space-y-2">
            {runs.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRunId(r.id)}
                className={`w-full rounded-lg border border-white/10 p-2 text-left hover:bg-white/5 ${
                  r.id === selectedRunId ? "bg-white/5" : ""
                }`}
              >
                <div className="text-sm text-zinc-100 line-clamp-2">{r.title}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="truncate">{r.id}</span>
                  <span className="shrink-0">{fmtTime(r.created_ts_ms)}</span>
                </div>
              </button>
            ))}
            {runs.length === 0 ? (
              <div className="text-xs text-zinc-500">No runs yet. Click New.</div>
            ) : null}
          </div>
        </div>
      }
      main={
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Chat</div>
            <div className="text-xs text-zinc-500">
              (MVP) Chat UI is placeholder; we drive runs via the sidebar.
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-300">
            Selected run: <span className="text-zinc-100">{selectedRunId ?? "(none)"}</span>
          </div>

          <div className="text-xs text-zinc-500">
            Next: wire a real message → LangGraph execution.
          </div>
        </div>
      }
      timeline={
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Timeline</div>
            <div className="text-xs text-zinc-500">Live SSE + persisted events</div>
          </div>

          <div className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
            {events.map((e) => (
              <button
                key={e.event_id}
                onClick={() => setSelectedEventId(e.event_id)}
                className={`flex w-full items-start gap-3 p-3 text-left hover:bg-white/5 ${
                  e.event_id === selectedEventId ? "bg-white/5" : ""
                }`}
              >
                <div className="w-20 shrink-0 text-xs text-zinc-500">{fmtTime(e.ts_ms)}</div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-400">{e.type}</div>
                  <div className="text-sm text-zinc-100 truncate">{e.summary}</div>
                </div>
              </button>
            ))}
            {events.length === 0 ? (
              <div className="p-3 text-xs text-zinc-500">No events.</div>
            ) : null}
          </div>
        </div>
      }
      inspector={
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Inspector</div>
            <div className="text-xs text-zinc-500">Selected event payload</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            {selectedEvent ? (
              <>
                <div className="text-xs text-zinc-400">{selectedEvent.type}</div>
                <div className="mt-1 text-sm text-zinc-100">{selectedEvent.summary}</div>
                <pre className="mt-3 max-h-[60vh] overflow-auto text-xs text-zinc-300">
{JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </>
            ) : (
              <div className="text-xs text-zinc-500">Select an event.</div>
            )}
          </div>
        </div>
      }
    />
  );
}
