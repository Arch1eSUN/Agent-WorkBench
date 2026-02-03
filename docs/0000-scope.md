# Scope

## What we are building
一个用于开发/调试/回放 AI Agent 的全栈工作台。

## Non-goals (for MVP)
- 多租户/复杂权限体系
- 完整计费
- 大规模分布式执行

## Core UX (must-have)
1) 对话（Chat）
2) 结构化事件流（timeline）
3) 二次确认（审批）
4) 回放（replay）

## Security principles
- 默认只读
- 有副作用动作必须二次确认
- 记录审计日志
