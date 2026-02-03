# 指令与二次确认（草案）

## 分级
- read-only：直接执行
- write/system：需要确认

## 审批协议（建议）
当需要确认时，返回：
- actionId
- actionSummary
- riskLevel
- exactCommand / exactSideEffect

用户确认格式：
- confirm <actionId>
或
- 确认 <actionId>
