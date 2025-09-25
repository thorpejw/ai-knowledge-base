"""
txt.py
Purpose: Extract raw UTF-8 text from .txt files.
"""

from pathlib import Path

def parse_txt(path: str) -> str:
    """Return file contents as UTF-8 text."""
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    return text.replace("\r\n", "\n").replace("\r", "\n")
