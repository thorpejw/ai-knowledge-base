"""
models.py
Purpose: Typed message contracts for jobs and progress events, mirrored from your web side.
Why: Your plan calls out zod/TS on the web and Pydantic mirrors on Python for type-safety. :contentReference[oaicite:3]{index=3}
"""

from pydantic import BaseModel, Field
from typing import Literal, Optional


class IngestJob(BaseModel):
    # Enqueued by web (Week 2). Holds the minimal info to find the file on disk. :contentReference[oaicite:4]{index=4}
    documentId: str = Field(..., alias="documentId")
    userId: str = Field(..., alias="userId")