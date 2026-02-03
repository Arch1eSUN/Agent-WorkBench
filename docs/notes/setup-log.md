# Setup Log

## 2026-02-03

- 后端：创建 venv `backend/.venv` 并成功安装：fastapi, uvicorn, pydantic, langgraph, langchain, langsmith
  - 注意：需要设置 `SSL_CERT_FILE=/etc/ssl/cert.pem` 才能通过 PyPI 证书校验（否则会报 CERTIFICATE_VERIFY_FAILED）
  - zsh 下安装带方括号的包名要加引号：`'uvicorn[standard]'`

- 前端：使用 `npm create next-app@latest` 初始化 Next.js（TypeScript + ESLint + Tailwind + App Router + src-dir）

下一步：把后端的事件流（SSE）与前端的 timeline UI 接起来。
