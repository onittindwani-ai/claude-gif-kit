# The GIF recipe

## Why a GIF looks choppy when the video is smooth

A GIF stores each frame's duration in whole hundredths of a second. At 30 fps one frame should last 33.3 ms, which a GIF cannot
store, so the encoder alternates 30 ms and 40 ms frames. That uneven rhythm is the judder you see. At 60 fps it is worse.

The fix is to choose a frame rate whose frames last an exact whole number of hundredths:

| GIF frame rate | Duration of every frame | Result |
| --- | --- | --- |
| 50 fps | 20 ms | The smoothest a GIF can be. Biggest file |
| 25 fps | 40 ms | Even rhythm, half the frames. Much smaller |
| 30 fps | 30 and 40 ms mixed | Uneven. Avoid |

## The commands (what `scripts/make_gif.py` runs)

```text
# 1. optional: put the finished still first, so the static preview shows the whole picture
ffmpeg -loop 1 -framerate 60 -t 0.6 -i out/main.png -c:v libx264 -pix_fmt yuv420p -crf 14 out/hold.mp4
ffmpeg -i out/hold.mp4 -i out/pipeline.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" out/gifsrc.mp4

# 2. build one palette for the whole clip, blend 60 fps down to 50 fps, scale
ffmpeg -i out/gifsrc.mp4 -vf "framerate=fps=50:interp_start=0:interp_end=255:scene=100,scale=540:-1:flags=lanczos,palettegen=max_colors=256:stats_mode=full" out/pal.png

# 3. apply it with no dither (dither flickers on moving footage and bloats the file)
ffmpeg -i out/gifsrc.mp4 -i out/pal.png -lavfi "framerate=fps=50:interp_start=0:interp_end=255:scene=100,scale=540:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=none:diff_mode=rectangle" -loop 0 out/pipeline.gif
```

`framerate=fps=50` blends neighbouring frames, so the 60 to 50 conversion does not drop frames unevenly.

## Check it

`python3 scripts/check_gif_timing.py out/pipeline.gif` prints how many frames last each duration. A smooth GIF prints one line.

## Sizes measured on this build (540 px wide, about 14.6 s)

| Setting | Size |
| --- | --- |
| 50 fps, no dither | about 9 MB |
| 25 fps, no dither | about 6 MB |

Photographic content is what makes GIFs big. A GIF of flat graphics is a fraction of this. If a platform rejects the size, post the video.
