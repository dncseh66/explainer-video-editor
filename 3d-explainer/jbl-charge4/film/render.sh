#!/bin/zsh
# Render all frames headless: film/render.sh  (serves film/ on :8781, writes frames/, then encodes exports/jbl-charge4-10s.mp4)
cd "${0:A:h}/.." || exit 1
rm -rf frames && mkdir frames
LOG=$(mktemp); python3 -I film/serve.py "$PWD/frames" 8781 > $LOG 2>&1 & SRV=$!
PROF=$(mktemp -d)
sleep 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --user-data-dir=$PROF --use-angle=metal --enable-gpu --ignore-gpu-blocklist \
  --window-size=1920,1200 --no-first-run --disable-background-timer-throttling --enable-logging=stderr --v=0 "http://127.0.0.1:8781/index.html?auto=1" > $LOG.chrome 2>&1 & CHR=$!
for i in {1..200}; do sleep 2; grep -q "/done" $LOG && break; grep -q "ERR" $LOG && { cat $LOG; break; }
  if [ $i -ge 15 ] && ! grep -q "frame" $LOG; then echo "NO FRAMES - console:"; grep -i "console" $LOG.chrome | tail -8; break; fi; done
kill $CHR $SRV 2>/dev/null; rm -rf $PROF
echo "frames: $(ls frames | wc -l)"
swift film/encode.swift frames 30 exports/jbl-charge4-10s.mp4 2>&1 | grep -v warning | tail -2
