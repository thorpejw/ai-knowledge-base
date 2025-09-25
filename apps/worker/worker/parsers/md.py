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
    # TODO: Implement:
    # 1) Read UTF-8 text.
    # 2) Remove code blocks with FENCE_RE.sub("", text).
    # 3) Optionally collapse > quoted lines or excessive blank lines.
    # 4) Return cleaned text.
    raise NotImplementedError
