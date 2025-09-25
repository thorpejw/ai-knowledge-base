# Purpose: Containerize the worker service (mirrors your FastAPI Dockerfile style). :contentReference[oaicite:15]{index=15}
FROM python:3.11-slim
WORKDIR /app

# Install uv (same approach as ingest-api)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

# Deps
COPY pyproject.toml ./
RUN uv sync --frozen || uv sync  # first build may not have a lockfile yet

# App code
COPY worker ./worker

CMD ["uv", "run", "python", "-m", "worker.main"]
