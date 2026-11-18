# The prompts

Four prompts carried the whole build. Replace the words in [brackets].

## Prompt 1: the brief (attach your sketch)

```text
Build a [4:5, 1080 by 1350, 60 fps] animated explainer in Remotion, as one composition where every frame is a pure
function of the frame number (no random, no CSS animation, no Date).

From my sketch:
- Top: [three groups of footage tiles: a-roll, b-roll, raw footage], each tile playing a real vertical clip.
- Middle: curves carry small dots from the groups into one square container. Inside it, [four logos] take turns:
  the current logo slides up and out while the next one rises into the same place.
- Under it: one row of [seven] tool logos.
- Below: a timeline with a ruler and three tracks (video, graphics, audio waveform) that a playhead wipes across.
- Bottom: [four] finished vertical clips fly out of the timeline, each with its platform logo under it.

Rules: pure black background, white text, one accent colour [yellow], Poppins. Headline [FOOTAGE IN. CONTENT OUT.]
visible from the first frame. Keep 130 px free at the bottom. Real logos only, with a licence table. Never invent a
number. Give me stills of the first frame, a mid frame and the last frame before you render anything.
```

## Prompt 2: a notes round (attach screenshots)

```text
Change only these things and keep everything else exactly as it is:
1. [The container with the rotating logos is too wide next to the logo tile. Make its border hug the tile.]
2. [Make the tool logos a little smaller.]
Show me a still of the last frame so I can check it.
```

One topic per line, exact words, "keep everything else". That is what keeps a build from drifting.

## Prompt 3: the export

```text
Render the full video at 60 fps, silent. Then make the GIF with scripts/make_gif.py at 50 fps so every frame lasts exactly
20 ms, with the first frame being the finished main screen. Report sizes and check the frame timing with
scripts/check_gif_timing.py.
```

## Prompt 4: the comment ask

```text
Add a comment ask inside the picture: a white strip at the very top, there from the first frame, reading
COMMENT [RAW] FOR THE [NAME OF THE RESOURCE] with a bobbing down arrow. The words get underlined one by one from left to
right, once, slowly, finishing on the last word exactly when the screen changes; the keyword gets a bold curved
underline in a contrasting colour. After [12.4 s] the main content slides up and blurs out and an
end screen builds in: COMMENT, the keyword on a big yellow bar, what they get, a bonus line, a down arrow. Keep the same
single underline pass on the end screen. Do not put the keyword in the post text.
```
