"""
client.py
Purpose: Handle embedding requests with batching, retries, and metrics.
Why: Day 3 is about turning chunked text → embeddings (lists of floats). :contentReference[oaicite:0]{index=0}
"""

import os
import time
import backoff
from typing import List
from openai import OpenAI


# Model & batch config
EMBED_MODEL = os.environ.get("EMBED_MODEL", "text-embedding-3-small")
BATCH_SIZE = int(os.environ.get("EMBED_BATCH_SIZE", "32"))

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY must be set in environment")

# client = httpx.Client(timeout=30.0, headers={"Authorization": f"Bearer {OPENAI_API_KEY}"})
client = OpenAI()

def _log_metrics(batch_texts: List[str], duration: float, vectors: List[List[float]]):
    """Log useful metrics (batch size, tokens est, latency)."""
    token_est = sum(len(t.split()) for t in batch_texts)
    print(
        f"Embedded {len(batch_texts)} chunks "
        f"(~{token_est} tokens) in {duration:.2f}s, "
        f"vector_dim={len(vectors[0]) if vectors else 'N/A'}"
    )

@backoff.on_exception(backoff.expo, Exception, max_tries=5)
def _embed_batch(batch_texts: List[str]) -> List[List[float]]:
    """Call OpenAI embeddings endpoint for one batch."""
    response = client.embeddings.create(
        model=EMBED_MODEL,
        input=batch_texts,
    )
    print(f"response is {response}")
    # Response returns objects with embedding vectors
    vectors = [d.embedding for d in response.data]
    return vectors

def embed_chunks(chunks: List[str]) -> List[List[float]]:
    """
    Batch over chunks, call _embed_batch, collect results.
    Returns: list of embedding vectors.
    """
    vectors: List[List[float]] = []
    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i : i + BATCH_SIZE]
        start = time.time()
        batch_vecs = _embed_batch(batch)
        duration = time.time() - start
        _log_metrics(batch, duration, batch_vecs)
        vectors.extend(batch_vecs)
    return vectors
