import asyncio
import uuid
from .storage import append_event, now_ms
from .events import RunEvent

async def run_agent_simulation(run_id: str, prompt: str):
    """
    Simulates a multi-step LangGraph agent execution.
    In a real app, this would be: `await graph.ainvoke({"messages": [prompt]})`
    """
    
    # 1. Start / Thinking
    await asyncio.sleep(0.5)
    append_event(RunEvent(
        run_id=run_id, event_id=uuid.uuid4().hex, ts_ms=now_ms(),
        type="llm_call",
        summary="planning execution path",
        payload={"model": "gpt-4o", "input": prompt}
    ))

    # 2. Tool Call (Web Search)
    await asyncio.sleep(1.5)
    tool_call_id = uuid.uuid4().hex
    append_event(RunEvent(
        run_id=run_id, event_id=tool_call_id, ts_ms=now_ms(),
        type="tool_call",
        summary="web_search: 'agent architecture patterns'",
        payload={"tool": "web_search", "query": "agent architecture patterns"}
    ))

    # 3. Tool Result
    await asyncio.sleep(2.0)
    append_event(RunEvent(
        run_id=run_id, event_id=uuid.uuid4().hex, ts_ms=now_ms(),
        type="tool_result",
        summary="found 3 articles",
        payload={"result": "Found articles on ReAct, Plan-and-Solve, and LangGraph...", "ref_id": tool_call_id}
    ))

    # 4. Final Answer
    await asyncio.sleep(1.0)
    append_event(RunEvent(
        run_id=run_id, event_id=uuid.uuid4().hex, ts_ms=now_ms(),
        type="llm_call",
        summary="final response",
        payload={"text": f"Based on the search, here is a summary of architectures for '{prompt}'...", "done": True}
    ))
