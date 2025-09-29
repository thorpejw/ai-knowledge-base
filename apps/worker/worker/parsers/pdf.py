"""
pdf.py
PDF parser using pypdf.
"""

from pathlib import Path
from pypdf import PdfReader

def parse_pdf(path: str) -> str:
    """Extract text from a PDF file, page by page."""
    reader = PdfReader(str(Path(path)))
    parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            parts.append(text)
    return "\n\n---\n\n".join(parts).strip()
