"""
pdf.py
Purpose: Extract text from PDF using pypdf (fast path).
Caveat: Not all PDFs are text-friendly; this is good enough for Week 3 MVP. :contentReference[oaicite:13]{index=13}
"""

from pathlib import Path
from pypdf import PdfReader   # uncomment when you implement

def parse_pdf(path: str) -> str:
    """Extract text page-by-page."""
    reader = PdfReader(str(Path(path)))
    parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            parts.append(text)
    return "\n\n---\n\n".join(parts).strip()