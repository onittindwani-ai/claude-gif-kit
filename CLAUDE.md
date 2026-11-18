# Claude Code instructions for this kit

This repo is a Remotion template plus the notes that built it. When the user asks to change or rebuild the animation, use the
skill in `skills/gif-from-a-sketch/SKILL.md` and follow `docs/05-DESIGN-RULES.md`.

Rules that always apply:
- Every frame is a pure function of the frame number. No random numbers, no CSS animation, no `Date`.
- Never invent a number, logo or result. Real logos only, with a row in `docs/06-LOGOS-AND-LICENCES.md`.
- Show stills (first frame, a mid frame, last frame) before any full render.
- Change only what the user names. Keep everything else exactly as it is.
- A GIF needs an even frame rhythm: 50 fps (20 ms) or 25 fps (40 ms). Use `scripts/make_gif.py` and `scripts/check_gif_timing.py`.
- No dashes in text the user may publish. Do not post or send anything for the user.
