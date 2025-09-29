"""
txt.py
Simple text parser for .txt files.
"""

from pathlib import Path

def parse_txt(path: str) -> str:
    """Read a UTF-8 .txt file and return its contents."""
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    return text.replace("\r\n", "\n").replace("\r", "\n")
