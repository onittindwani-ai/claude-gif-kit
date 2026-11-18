#!/bin/sh
# Makes 9 tiny placeholder clips (a1 a2 a3 b1 b2 b3 c1 c2 c3) so the template renders on a fresh clone.
# Replace them with your own footage: same names, vertical 9:16, 4 seconds or longer, any frame rate.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/clips
i=0
for name in a1 a2 a3 b1 b2 b3 c1 c2 c3; do
  i=$((i + 1))
  hue=$((i * 37 % 360))
  ffmpeg -v error -y -f lavfi -i "color=c=black:s=360x640:r=24:d=5" \
    -vf "geq=r='128+100*sin(2*PI*(X/360+T/4)+${i})':g='128+100*sin(2*PI*(Y/640+T/5)+${i}*1.3)':b='128+100*sin(2*PI*((X+Y)/800+T/3)+${i}*0.7)',hue=h=${hue}" \
    -c:v libx264 -pix_fmt yuv420p -crf 30 "public/clips/${name}.mp4"
  echo "made public/clips/${name}.mp4"
done
