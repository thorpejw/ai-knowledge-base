"""
events.py
Purpose: Small helpers to publish consistent job progress events via Redis pub/sub.
Why: Day 5 will replace the fake WS updates by subscribing to these events. :contentReference[oaicite:9]{index=9}
"""

from .models import ProgressEvent
from .redis_queue import publish

EVENTS_CHANNEL = "events:jobs"

def emit(stage: ProgressEvent) -> None:
    """Serialize and publish a ProgressEvent to EVENTS_CHANNEL."""
    payload = stage.model_dump(by_alias=True)
    publish(EVENTS_CHANNEL, payload)

def step(job_id: str, document_id: str, user_id: str, status: str, progress: int, message: str | None = None) -> None:
    """Ergonomic wrapper to build + emit a ProgressEvent with common fields."""
    if not (0 <= progress <= 100):
        raise ValueError("Progress must be between 0 and 100.")
    event = ProgressEvent(
        jobId=job_id,
        documentId=document_id,
        progress=progress,
        status=status,
        userId=user_id,
        message=message
    )
    emit(event)