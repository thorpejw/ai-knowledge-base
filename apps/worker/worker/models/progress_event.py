from pydantic import BaseModel
from typing import Literal, Optional

JobStage = Literal["queued", "parsing", "chunking", "embedding", "indexing", "ready", "error"]


class ProgressEvent(BaseModel):
    # Published via Redis pub/sub → forwarded to your websocket-server to the client. :contentReference[oaicite:5]{index=5}
    type: Literal["job"] = "job"
    jobId: str
    status: JobStage
    progress: int = 0  # 0-100
    message: Optional[str] = None
    documentId: Optional[str] = None
    userId: Optional[str] = None