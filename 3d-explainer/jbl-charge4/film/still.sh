#!/bin/zsh
# Debug still: film/still.sh <t> [cam] <out.png>  — screenshots index.html?t=<t>&cam=<cam> headless
cd "${0:A:h}" || exit 1
T=$1; CAM=$2; OUT=$3
python3 -I -m http.server 8782 --bind 127.0.0.1 > /dev/null 2>&1 & SRV=$!; sleep 1; PROF=$(mktemp -d)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --user-data-dir=$PROF --use-angle=metal --enable-gpu --ignore-gpu-blocklist --hide-scrollbars \
  --window-size=1920,1120 --virtual-time-budget=8000 --screenshot="$OUT" "http://127.0.0.1:8782/index.html?t=$T&cam=$CAM" > /dev/null 2>&1
kill $SRV; rm -rf $PROF
