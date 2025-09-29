"""
md.py
Simple Markdown parser — strips code blocks, returns mostly-clean text.
"""

import re
from pathlib import Path

FENCE_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)

def parse_md(path: str) -> str:
    """Return markdown text with code fences removed."""
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    text = FENCE_RE.sub("", text)
    # collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text
