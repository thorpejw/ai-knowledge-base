FROM python:3.11-slim

WORKDIR /app

# uv installation
RUN pip install uv

COPY apps/ingest-api/pyproject.toml apps/ingest-api/uv.lock ./
RUN uv sync --frozen

COPY apps/ingest-api ./ingest-api

CMD ["uv", "run", "uvicorn", "ingest_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
