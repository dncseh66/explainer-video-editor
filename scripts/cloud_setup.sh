#!/bin/bash
# Installs what a Linux cloud session needs to finish films: ffmpeg + a headless Chromium.
# Runs automatically at session start in cloud sessions (.claude/settings.json hook); safe to re-run.
set -u
SUDO=""; [ "$(id -u)" != 0 ] && command -v sudo >/dev/null && SUDO="sudo"

if ! command -v ffmpeg >/dev/null; then
  echo "installing ffmpeg..."
  $SUDO apt-get update -qq >/dev/null 2>&1
  $SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg >/dev/null 2>&1 || echo "ffmpeg install failed"
fi

have_chrome() {
  command -v google-chrome >/dev/null || command -v chromium >/dev/null || command -v chromium-browser >/dev/null \
    || ls ~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome >/dev/null 2>&1
}
if ! have_chrome; then
  echo "installing headless chromium (playwright)..."
  python3 -m pip install -q playwright >/dev/null 2>&1 || pip install -q playwright >/dev/null 2>&1
  python3 -m playwright install --with-deps chromium >/dev/null 2>&1 || echo "chromium install failed"
fi

command -v ffmpeg >/dev/null && echo "ffmpeg ok" || echo "ffmpeg MISSING"
have_chrome && echo "chromium ok" || echo "chromium MISSING"
exit 0
