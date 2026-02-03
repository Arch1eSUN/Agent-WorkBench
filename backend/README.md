# Backend (FastAPI + LangGraph)

## Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
# 如果你在企业网络/证书环境，建议：export SSL_CERT_FILE=/etc/ssl/cert.pem
pip install -r requirements.txt
```

## Run
```bash
cd backend
source .venv/bin/activate
export SSL_CERT_FILE=/etc/ssl/cert.pem
uvicorn app.main:app --reload --port 8787
```

## Health
- http://127.0.0.1:8787/health

下一步：加 /runs、/runs/{id}/stream(SSE)、/runs/{id}/events(JSONL) 三个端点。
