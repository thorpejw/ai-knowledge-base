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
from .embeddings import embed_chunks
from .vector_stores import upsert_vectors


logging.basicConfig(level=logging.INFO)

def pick_parser_for(path: str):
    """Choose a parser function based on file extension; default to txt."""
    ext = Path(path).suffix.lower()
    return PARSERS.get(ext, parse_txt)

def parse_document(file_path: str) -> str:
    """Dispatch to the appropriate parser and return text."""
    parser = pick_parser_for(file_path)
    logging.info(f"parser is {parser}")
    try:
        return parser(file_path)
    except Exception as e:
        logging.error(f"Parser failed for {file_path}: {e}")
        raise

def handle_job(job: IngestJob) -> None:
    """Process a single ingest job through parsing + chunking stages."""
    logging.info("About to begin")
    # begin step
    step(job.documentId, job.documentId, job.userId,"parsing", 5, "Starting parse")
    logging.info("LET's GO!")

    # find document step
    path = find_path_for_document(job.documentName)
    if not path:
        logging.error("Error!")
        step(job.documentId, job.documentId, job.userId,"error", 100, "File not found")
        return

    # parse document step
    text = parse_document(path)
    logging.info(f"Parsed document {job.documentId}, length={len(text)} chars")

    # chuck document content step
    step(job.documentId, job.documentId, job.userId,"chunking", 15, "Chunking text")
    chunks = chunk_text(text)
    logging.info(f"Chunked {job.documentId} → {len(chunks)} chunks")

    # embedding step
    step(job.documentId,job.documentId,job.userId,"embedding", 25, "Generating embeddings")
    vectors = embed_chunks(chunks)
    logging.info(f"Embedded {len(chunks)} chunks → {len(vectors)} vectors (dim={len(vectors[0]) if vectors else 0})")

    step(job.documentId, job.documentId,job.userId,"indexing", 50, "Upserting into Pinecone")

    upsert_vectors(job.userId, job.documentId, chunks, vectors)
    logging.info(f"Upserted Vectors")
    # In-memory only (persistence added Day 3/4)
    step(job.documentId, job.documentId, job.userId,"ready", 30, "Chunked (embedding tomorrow)")

def run_loop() -> None:
    """Main worker loop: pop jobs and handle them."""
    logging.info("Worker started, waiting for jobs...")
    while True:
        job_data = pop_next_job(5)
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
