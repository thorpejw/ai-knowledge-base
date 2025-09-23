FROM python:3.11-slim

WORKDIR /app

# uv installation
RUN pip install uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY ingest_api ./ingest_api

CMD ["uv", "run", "uvicorn", "ingest_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
