# Design rules that made the GIF stop the scroll

Mechanisms only. Copy the ideas, never another creator's words, footage or marks.

## From a frame by frame study of one reference account

- **Pure black and white, one accent.** Everything is white or grey. One saturated colour (here yellow) marks the point. Colour inside the picture means something.
- **One central object that keeps changing.** The container in the middle never moves, but the logo inside it is always sliding up while the next rises in.
- **Thin lines.** The curves are 2.5 px grey lines, the dots carry a soft glow. Glow is used only on the key shape.
- **Constant motion.** Something changes about every second. Nothing sits still for long.
- **Big negative space.** Elements are small and spaced; the eye never has to search.

## Scroll stopping text

- A huge two line headline visible from frame 0: white line, then a solid accent bar with dark text. 80 px or more.
- Text that matters is never below 26 px on the 1080 canvas. Labels 26 to 32 px, headline 80 px, end screen 130 to 210 px.
- A strip at the very top with the ask, there from the first frame, so the static preview already carries it.
- Words get underlined one by one, left to right, once, at a slow pace (`STRIP_UL` frames), and the last underline finishes right as the screen changes. The keyword gets a bold curved arc in a contrasting colour (blue on yellow, `UL_RAW_COLOR`). This keeps the eye moving along the ask without repeating.

## Layout

- 1080 by 1350 (4:5). Keep about 130 px free at the bottom: phones crop and cover the lower edge.
- Content is scaled to 93.5% and moved down 72 px under the strip; the strip is 68 px high.
- Real logos on flat rounded tiles, same size in a row, with a thin white border. Dark tile for light logos, light tile for dark logos.
- Source tiles 60 by 108, tool tiles 84, finished clips 80 by 142, platform tiles 52.

## Motion rules (every one was a review note)

1. Entrances: blur to sharp in 0.2 to 0.5 s. Exits are cuts or a slide with blur. No big bounces.
2. Nothing is half drawn on the first frame: the headline and the strip are fully there.
3. No element crosses another. No text on top of animation.
4. A moving thing lands and settles before it ends.
5. The container for the logo slot is as wide as its tile plus a small margin, not wider.
6. Every frame is a pure function of the frame number.

## What to leave out

Author names or handles on the picture, invented numbers, fake dashboards, emblem icons standing in for words, neon glow on everything, gradient text.
