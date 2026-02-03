# Agent-WorkBench

AI 全栈 Agent 工作台（Winston）。

## 目标
构建一个最小但可扩展的“AI Agent 全栈工作台”，用于：
- 可视化运行（timeline：LLM/tool/结果/错误）
- Human-in-the-loop（二次确认/审批）
- Run replay（回放：按事件流复现）
- 逐步演进到可调试、可回溯、可分叉的 agent 开发体验（参考 LangGraph/Studio 思路）

## 目录
- `frontend/`：Web UI（Next.js）
- `backend/`：后端服务（FastAPI + LangGraph）
- `docs/`：架构与设计文档

## 本地开发
- 前端：默认 `http://127.0.0.1:3010`
- 后端：默认 `http://127.0.0.1:8787`

> 注：依赖安装与启动方式见 `frontend/README.md` 与 `backend/README.md`。
