FROM python:3.11-slim

WORKDIR /app

# uv installation
RUN pip install uv
# COPY apps/ingest-api/pyproject.toml apps/ingest-api/uv.lock ./apps/ingest-api/
COPY apps/ingest-api ./apps/ingest-api
WORKDIR /app/apps/ingest-api
RUN uv sync --frozen


CMD ["uv", "run", "uvicorn", "ingest_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
