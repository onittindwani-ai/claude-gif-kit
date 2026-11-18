#!/usr/bin/env python3
"""Print how many frames of a GIF last each duration. A smooth GIF prints exactly one line.

Usage: python3 scripts/check_gif_timing.py out/pipeline.gif
"""
import subprocess
import sys
from collections import Counter


def summarize(durations: list[float]) -> Counter:
    return Counter(round(d, 3) for d in durations)


def is_even(durations: list[float]) -> bool:
    return len(summarize(durations)) == 1


def read_durations(path: str) -> list[float]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "packet=duration_time", "-of", "csv=p=0", path],
        check=True, capture_output=True, text=True,
    ).stdout
    return [float(x) for x in out.split() if x.strip()]


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__)
        return 2
    durations = read_durations(argv[1])
    counts = summarize(durations)
    for d, n in sorted(counts.items()):
        print(f"{n:6d} frames of {d * 1000:.0f} ms")
    if is_even(durations):
        print("OK: every frame lasts the same time")
        return 0
    print("UNEVEN: frame durations differ; rebuild with 50 or 25 fps")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
