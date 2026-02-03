# UI 信息架构（草案）

## 导航
- Runs（运行列表/回放）
- Chat（对话与当前 run）
- Tools（工具清单与分级）
- Settings（模型/环境/权限）

## Chat 页核心区块
- 左：会话/任务列表
- 中：消息流（用户/assistant）
- 右：Inspector（选中 step 的输入/输出/状态 diff）

## Timeline（Run steps）
Step 类型：
- llm_call
- tool_call
- tool_result
- approval_required
- error
- state_checkpoint

每个 step：id、timestamp、parentId、status、summary、rawPayload
