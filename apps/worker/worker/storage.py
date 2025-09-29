"""
storage.py
Purpose: Locate uploaded files by documentId → file path.
Where does the path come from? For Day 1, we’ll read from disk using a simple convention:
  infra/.env has FILE_STORAGE_DIR (e.g., /data/uploads) set in Week 2. :contentReference[oaicite:10]{index=10}
Later (Week 4/5) you may move to DB lookups or S3/MinIO.
"""

import os
import glob
import logging

logging.basicConfig(level=logging.INFO)

BASE_DIR = os.environ.get("FILE_STORAGE_DIR", "/data/uploads")  # matches your compose mounts. :contentReference[oaicite:11]{index=11}

def find_path_for_document(document_name: str) -> str | None:
    """
    Naive strategy: files were saved with unique names, not by docId.
    For Day 1, you can store the file path in Redis as part of the job,
    or search heuristically (e.g., "{docId}-*.*") if you encode it in filenames.
    """
    # This demo uses a glob-based heuristic; feel free to replace with a DB lookup.
    logging.info(f"documentName is {document_name}")
    pattern = os.path.join(BASE_DIR, f"{document_name}*")
    logging.info(f"patter is {pattern}")
    matches = glob.glob(pattern)
    logging.info(f"matches is {matches}")
    return matches[0] if matches else None
