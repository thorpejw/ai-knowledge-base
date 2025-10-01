# 📚 AI Knowledge Base

End-to-end RAG (retrieval-augmented generation) system.  
Upload documents → parse → chunk → embed → index into Pinecone → query with semantic search.  
Built with **Next.js**, **FastAPI**, **Python worker**, **Redis**, **Pinecone**, and **WebSockets**.  

---

## 🚀 Features

- User authentication & file upload (Next.js app)  
- Background ingestion worker (Python, Redis queue)  
- Document parsing (.txt, .md, .pdf)  
- Chunking (token-based, configurable)  
- OpenAI embeddings (batched, retried)  
- Vector storage in Pinecone (per-user namespace)  
- Realtime job progress via Redis pub/sub → WebSocket relay  
- Query API (retrieval from Pinecone)  

---

## 🖥️ Prerequisites

Run these on Debian (tested on **Debian 12 Bookworm**):

```bash
sudo apt update && sudo apt install -y \
  curl git python3 python3-venv python3-pip \
  docker.io docker-compose \
  build-essential
```

Install [pnpm](https://pnpm.io/):  
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Install [uv](https://github.com/astral-sh/uv) (Python package/dependency manager):  
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## 📂 Project Structure

```
apps/
  web/              # Next.js frontend
  websocket-server/ # Node.js WebSocket relay
  ingest-api/       # FastAPI ingestion service (Week 2)
  worker/           # Python worker (Week 3–4)
infra/
  docker-compose.yml
  .env              # environment variables
```

---

## ⚙️ Environment Variables

Copy `infra/.env.example` → `infra/.env` and fill in:

```ini
# Database
DATABASE_URL=postgresql://app:app@postgres:5432/app

# Redis
REDIS_URL=redis://redis:6379/0

# File storage
FILE_STORAGE_DIR=/data/uploads

# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_INDEX=ai-knowledge-base

# WebSocket server
WS_PORT=3001
```

Make sure you create a Pinecone index manually in your Pinecone console with:
- Dimension = 1536 (for text-embedding-3-small)  
- Metric = cosine  

---

## 🛠️ Build & Run

From the root directory:

```bash
# Build and start all services
pnpm install
pnpm compose:up
```

This runs:
- **Postgres** (for auth/documents metadata)  
- **Redis** (for job queue + pub/sub)  
- **Next.js web** (frontend, http://localhost:3000)  
- **WebSocket server** (ws://localhost:3001)  
- **FastAPI ingest-api** (http://localhost:8000)  
- **Python worker** (runs continuously, processes uploads)  

---

## 🧑‍💻 Development Workflow

- **Upload a document** via Next.js web app.  
- File is saved → job enqueued in Redis → worker picks it up.  
- Worker runs:  
  `parse → chunk → embed → index into Pinecone`  
- Progress is published to Redis → WebSocket server → frontend UI.  
- **Query endpoint** (`/query`) lets you ask semantic questions against your documents.  

---

## 🩺 Health Checks

- Ingest API: `curl http://localhost:8000/health`  
- Websocket server: connect to `ws://localhost:3001?userId=123`  
- Worker logs:  
  ```bash
  docker logs -f worker
  ```  

---

## 🔮 Next Steps

- Week 4: Retrieval + querying via FastAPI `/query` endpoint.  
- Week 5: Stream RAG answers back to the UI.  
- Week 6: Observability & polish (structured logs, metrics).  
