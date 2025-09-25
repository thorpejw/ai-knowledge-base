"""
main.py
Worker entrypoint. Now handles: parsing → chunking.
"""

import time
import logging
from pathlib import Path
from .models import IngestJob
from .redis_queue import pop_next_job
from .events import step
from .parsers import PARSERS, parse_txt
from .storage import find_path_for_document
from .chunking import chunk_text

logging.basicConfig(level=logging.INFO)

def pick_parser_for(path: str):
    """Choose a parser function based on file extension; default to txt."""
    ext = Path(path).suffix.lower()
    return PARSERS.get(ext, parse_txt)

def parse_document(file_path: str) -> str:
    """Dispatch to the appropriate parser and return text."""
    parser = pick_parser_for(file_path)
    try:
        return parser(file_path)
    except Exception as e:
        logging.error(f"Parser failed for {file_path}: {e}")
        raise

def handle_job(job: IngestJob) -> None:
    """Process a single ingest job through parsing + chunking stages."""
    step(jobId=job.documentId, document_id=job.documentId, user_id=job.userId,
         status="parsing", progress=5, message="Starting parse")

    path = find_path_for_document(job.documentId)
    if not path:
        step(jobId=job.documentId, document_id=job.documentId, user_id=job.userId,
             status="error", progress=100, message="File not found")
        return

    text = parse_document(path)
    logging.info(f"Parsed document {job.documentId}, length={len(text)} chars")

    step(jobId=job.documentId, document_id=job.documentId, user_id=job.userId,
         status="chunking", progress=15, message="Chunking text")

    chunks = chunk_text(text)
    logging.info(f"Chunked {job.documentId} → {len(chunks)} chunks")

    # In-memory only (persistence added Day 3/4)
    step(jobId=job.documentId, document_id=job.documentId, user_id=job.userId,
         status="ready", progress=30, message="Chunked (embedding tomorrow)")

def run_loop() -> None:
    """Main worker loop: pop jobs and handle them."""
    logging.info("Worker started, waiting for jobs...")
    while True:
        job_data = pop_next_job(timeout_seconds=5)
        if job_data:
            try:
                job = IngestJob.model_validate(job_data)
                handle_job(job)
            except Exception as e:
                logging.error(f"Error handling job: {e}")
        else:
            time.sleep(1)

if __name__ == "__main__":
    run_loop()
