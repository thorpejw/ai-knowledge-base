"""
md.py
Purpose: Extract text from Markdown. For Day 1 keep it simple: strip code fences, keep headings.
Hint: Later you might remove frontmatter (--- blocks) or convert to plain text.
"""

import re
from pathlib import Path

FENCE_RE = re.compile(r"```[\\s\\S]*?```", re.MULTILINE)  # crude; good enough for v1

def parse_md(path: str) -> str:
    """Return roughly-cleaned markdown text."""
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    text = FENCE_RE.sub("",text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text
