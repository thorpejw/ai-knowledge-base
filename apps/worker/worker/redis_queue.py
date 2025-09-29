"""
redis_queue.py
Purpose: Connect to Redis and provide queue helpers:
 - pop_next_job(): blocking pop from "jobs:ingest:file" (Week 2 used rPush to enqueue). :contentReference[oaicite:6]{index=6}
 - publish_event(): thin pub/sub helper for progress events (used by events.py).
Env needed: REDIS_URL=redis://redis:6379/0  (already in your infra/.env). :contentReference[oaicite:7]{index=7}
"""

import json
import os
from typing import Optional
from redis import Redis

_client: Optional[Redis] = None

def get_client() -> Redis:
    """Return a singleton Redis client (hint: create it if missing, using REDIS_URL)."""
    global _client
    if _client is None:
        url = os.environ.get("REDIS_URL")
        if not url:
            raise RuntimeError("REDIS_URL not configured in environment")
        _client = Redis.from_url(url, decode_responses=True)
    return _client

def pop_next_job(timeout_seconds: int = 5) -> Optional[dict]:
    """
    Block-pop the next job JSON from "jobs:ingest:file".
    Returns dict like {"documentId": "...", "userId": "..."} or None on timeout.
    """
    client = get_client()
    result = client.blpop("jobs:ingest:file", timeout_seconds)
    if result:
        _, payload = result
        try:
            return json.loads(payload)
        except Exception as e:
            print(f"Failed to decode job payload: {e}")
            return None
    return None

def publish(channel: str, payload: dict) -> None:
    """Publish a JSON message to a Redis pub/sub channel (e.g., 'events:jobs')."""
    client = get_client()
    client.publish(channel, json.dumps(payload))
