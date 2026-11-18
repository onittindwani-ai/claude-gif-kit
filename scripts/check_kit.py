#!/usr/bin/env python3
"""Checks the kit is complete and contains nothing private. Prints OK or the problems. Exit code 1 on problems."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = [
    "README.md", "00-START-HERE.md", "LICENSE", "CHANGELOG.md", "CLAUDE.md", "package.json", "tsconfig.json",
    "src/index.ts", "src/Root.tsx", "src/Pipeline.tsx",
    "docs/01-HOW-THIS-GIF-WAS-MADE.md", "docs/02-THE-PROMPTS.md", "docs/03-VEO-PROMPTS.md", "docs/04-GIF-RECIPE.md",
    "docs/05-DESIGN-RULES.md", "docs/06-LOGOS-AND-LICENCES.md", "docs/07-THE-COMMENT-ASK.md",
    "scripts/make_gif.py", "scripts/check_gif_timing.py", "scripts/make_placeholder_clips.sh",
    "skills/gif-from-a-sketch/SKILL.md",
]
PRIVATE_PATTERNS = {
    "private storage link": re.compile(r"drive\.google\.com|docs\.google\.com|notion\.(so|site)", re.I),
    "local path": re.compile(r"/Users/[A-Za-z0-9_.-]+"),
    "email address": re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
}
DASH = re.compile("[–—]")
TEXT_SUFFIXES = {".md", ".ts", ".tsx", ".py", ".sh", ".json", ".yml", ".txt", ".svg"}
SKIP_DIRS = {"node_modules", ".git", "out"}
SELF = Path(__file__).resolve()


def scan_text(text: str) -> list[str]:
    problems = [name for name, pat in PRIVATE_PATTERNS.items() if pat.search(text)]
    if DASH.search(text):
        problems.append("em or en dash")
    return problems


def check(root: Path = ROOT) -> list[str]:
    problems = [f"missing {p}" for p in REQUIRED if not (root / p).exists()]
    for path in root.rglob("*"):
        if not path.is_file() or path == SELF or path.suffix not in TEXT_SUFFIXES:
            continue
        if any(part in SKIP_DIRS for part in path.relative_to(root).parts):
            continue
        if path.name == "check_kit.py" or path.name == "test_check_kit.py":
            continue
        for p in scan_text(path.read_text(encoding="utf-8", errors="ignore")):
            problems.append(f"{path.relative_to(root)}: {p}")
    return problems


def main() -> int:
    problems = check()
    if problems:
        print("\n".join(problems))
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
