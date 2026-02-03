# 后端架构（草案）

## 目标
- 把 agent 执行抽象成“事件流 + 可回放的状态快照（checkpoint）”。

## 组件
- Orchestrator（编排/状态机）
- Tool Facade（工具门面：校验、审计、权限、幂等）
- Event Bus（把执行事件推给前端：SSE/WebSocket）
- Storage
  - Runs/Steps（结构化事件）
  - Checkpoints（可恢复状态）
  - Artifacts（大对象：文件/网页/日志）

## MVP 取舍
- 先落盘 JSONL（runs/{runId}.jsonl）+ checkpoints/{runId}/{stepId}.json
- 后续再换 SQLite/Postgres
