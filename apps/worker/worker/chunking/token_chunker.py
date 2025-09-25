"""
token_chunker.py
Purpose: Break large documents into overlapping chunks, sized by tokens.
Why: Embedding APIs have context limits. Week 3 requires ~800–1200 tokens with 100–200 overlap.  :contentReference[oaicite:0]{index=0}
"""

from typing import List

# Configurable defaults (can be overridden via env or args)
CHUNK_SIZE = 1000     # target max tokens per chunk
CHUNK_OVERLAP = 150   # overlap tokens between chunks

def count_tokens(text: str) -> int:
    """
    Very naive token count. 
    """
    return len(text.split())

def split_into_chunks(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """
    Split text into overlapping chunks.
    """

    words = text.split()
    chunks: List[str] = []
    step = max(1, chunk_size - overlap)

    for i in range(0, len(words), step):
        window = words[i : i + chunk_size]
        if not window:
            break
        chunks.append(" ".join(window))
        if i + chunk_size >= len(words):
            break
    
    return chunks

def chunk_text(text: str) -> List[str]:
    """Public API: split a doc string into configured chunks."""
    return split_into_chunks(text, CHUNK_SIZE, CHUNK_OVERLAP)
