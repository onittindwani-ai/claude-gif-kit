#!/usr/bin/env python3
"""Turn a 60 fps video into a GIF whose frames all last the same whole number of hundredths of a second.

A GIF stores frame durations in 1/100 s. 50 fps (20 ms) and 25 fps (40 ms) are exact; 30 fps is not (it alternates 30 and 40 ms).
Usage: python3 scripts/make_gif.py in.mp4 out.gif --fps 50 --width 540 --hold-still main.png --max-seconds 14.6
"""
import argparse
import subprocess
import sys
from pathlib import Path

EXACT_FPS = (50, 25, 20, 10)


def delay_ms(fps: int) -> float:
    return 1000.0 / fps


def is_exact_rate(fps: int) -> bool:
    """True when every frame lasts a whole number of hundredths of a second."""
    centis = 100.0 / fps
    return abs(centis - round(centis)) < 1e-9 and round(centis) >= 2


def video_filter(fps: int, width: int) -> str:
    if not is_exact_rate(fps):
        raise ValueError(f"{fps} fps does not give whole hundredths of a second per frame; use one of {EXACT_FPS}")
    scale = f"scale={width}:-1:flags=lanczos"
    if fps == 50:
        return f"framerate=fps=50:interp_start=0:interp_end=255:scene=100,{scale}"
    return f"fps={fps},{scale}"


def palette_cmd(src: str, fps: int, width: int, pal: str, max_seconds: float | None) -> list[str]:
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if max_seconds:
        cmd += ["-t", str(max_seconds)]
    return cmd + ["-i", src, "-vf", video_filter(fps, width) + ",palettegen=max_colors=256:stats_mode=full", pal]


def gif_cmd(src: str, fps: int, width: int, pal: str, out: str, max_seconds: float | None) -> list[str]:
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if max_seconds:
        cmd += ["-t", str(max_seconds)]
    return cmd + [
        "-i", src, "-i", pal,
        "-lavfi", video_filter(fps, width) + "[x];[x][1:v]paletteuse=dither=none:diff_mode=rectangle",
        "-loop", "0", out,
    ]


def hold_cmds(still: str, video: str, hold_s: float, workdir: Path) -> tuple[list[list[str]], str]:
    """Commands that put the finished still in front of the video, so the GIF's first frame is the whole picture."""
    hold = str(workdir / "hold.mp4")
    joined = str(workdir / "gifsrc.mp4")
    return (
        [
            ["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "60", "-t", str(hold_s), "-i", still,
             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "14", hold],
            ["ffmpeg", "-v", "error", "-y", "-i", hold, "-i", video, "-filter_complex",
             "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "14", joined],
        ],
        joined,
    )


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("gif")
    ap.add_argument("--fps", type=int, default=50)
    ap.add_argument("--width", type=int, default=540)
    ap.add_argument("--hold-still", default=None, help="PNG of the finished main screen to show first")
    ap.add_argument("--hold-seconds", type=float, default=0.6)
    ap.add_argument("--max-seconds", type=float, default=None)
    args = ap.parse_args(argv)

    out = Path(args.gif)
    out.parent.mkdir(parents=True, exist_ok=True)
    cmds: list[list[str]] = []
    src = args.video
    if args.hold_still:
        pre, src = hold_cmds(args.hold_still, args.video, args.hold_seconds, out.parent)
        cmds += pre
    pal = str(out.parent / "palette.png")
    cmds.append(palette_cmd(src, args.fps, args.width, pal, args.max_seconds))
    cmds.append(gif_cmd(src, args.fps, args.width, pal, str(out), args.max_seconds))
    for c in cmds:
        subprocess.run(c, check=True)
    print(f"wrote {out} ({out.stat().st_size / 1e6:.1f} MB), every frame {delay_ms(args.fps):.0f} ms")
    return 0


if __name__ == "__main__":
    sys.exit(main())
