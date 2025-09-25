# Purpose: Export a registry mapping file extensions → parser functions.
from .txt import parse_txt
from .md import parse_md
from .pdf import parse_pdf

PARSERS = {
    ".txt": parse_txt,
    ".md": parse_md,
    ".pdf": parse_pdf,
}
