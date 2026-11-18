---
name: gif-from-a-sketch
description: Turn a sketch and a few sentences into a scroll stopping animated explainer (video and GIF) in Remotion, with real logos, an even GIF frame rhythm and an optional comment ask inside the picture. Use when the user wants an animated LinkedIn or Instagram graphic made in code.
---

# GIF from a sketch

## Inputs to collect first (ask only for what is missing)

1. The sketch or a plain description: what goes in at the top, what happens in the middle, what comes out at the bottom.
2. The words: headline, group names, tool names, platform names.
3. The accent colour (default yellow), the aspect ratio (default 4:5, 1080 by 1350) and the length.
4. Whether there is a comment ask, its keyword and the exact name of the resource. Never invent the resource.

## Steps

1. Read `docs/05-DESIGN-RULES.md` and `docs/04-GIF-RECIPE.md`.
2. Copy `src/Pipeline.tsx`, change only the constants at the top and the words. Keep every frame a pure function of the frame number.
3. Collect real logos with a licence row (`docs/06-LOGOS-AND-LICENCES.md`). If a logo is not available, show a typeset name tile and say so.
4. Render three stills (first frame, main screen, end screen) and look at them at full size. Fix with exact numbers, one topic at a time.
5. Render the video at 60 fps, silent. Make the GIF with `scripts/make_gif.py` (50 fps) and check it with `scripts/check_gif_timing.py`.
6. Report: file sizes, what is real and what is placeholder, and what the user must confirm. Never post or send anything.

## Checks before saying it is done

- Bottom margin kept, text at least 26 px, nothing overlapping, last frame settled.
- First frame of the GIF is the finished main screen.
- Every name, number and logo on screen is real or labelled as an example.
