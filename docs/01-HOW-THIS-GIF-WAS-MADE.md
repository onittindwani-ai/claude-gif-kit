# How this GIF was made

The GIF in the post is one Remotion composition (`src/Pipeline.tsx`), 1080 by 1350, 60 fps. Claude Code wrote it from a
sketch and a few sentences, and it was shaped by about eight rounds of review notes. This page is the whole path, so you
can repeat it for your own idea.

## The path

1. **Start from a sketch plus words, not a prompt.** Draw boxes and arrows: what goes in on top, what the middle does,
   what comes out at the bottom. Write one sentence per box. Give Claude the image and the sentences.
   (Template: `docs/02-THE-PROMPTS.md`, prompt 1.)
2. **Make the footage.** The nine small clips in the picture are AI generated stock, 4 seconds each, vertical.
   (`docs/03-VEO-PROMPTS.md`.) Use your own footage if you have it.
3. **Collect real logos** with their licences before you design around them. (`docs/06-LOGOS-AND-LICENCES.md`.)
4. **Study one reference account frame by frame** and write down mechanisms, never wording. Here: one fixed caption slot,
   thin white lines, one central object that keeps changing, a glow only on the key shape, one accent colour.
   (`docs/05-DESIGN-RULES.md`.)
5. **Build it as code where every frame is a pure function of the frame number.** No random numbers, no CSS animation,
   no `Date`. Then any frame can be rendered alone, and a fix never changes another frame.
6. **Review with pictures, not with hope.** Render stills at the key frames, look at them at full size, then give notes
   with exact words ("make the container narrower than the logo tile", not "make it better"). Keep the notes short, one
   topic each. About eight rounds changed: layout, sizes, one logo slot that swaps, a three track timeline, platform
   logos, a comment strip, an end screen, an underline loop.
7. **Export the video first, the GIF second.** A video at 60 fps is the smooth one. The GIF recipe is in
   `docs/04-GIF-RECIPE.md` and it matters: frame timing in a GIF is whole hundredths of a second.
8. **Ask for the comment inside the picture,** not in the post text. (`docs/07-THE-COMMENT-ASK.md`.)

## What Claude did and what you do

| You | Claude |
| --- | --- |
| The idea, the sketch, the sentences | The composition code, the timings, the exports |
| Taste: "too wide", "too busy", "this looks AI" | Fixes with exact numbers, stills to check |
| Every claim on screen is true | Never invents a number, logo or result |
| The final yes | Never posts anything |

## Honest limits

- The footage tiles are AI generated stock. Do not present them as your own shoot.
- The timeline in the picture is decorative. It is not a screenshot of a real project.
- Whether LinkedIn plays a GIF as smoothly as a video depends on how it processes the file. Upload the video when you can.
